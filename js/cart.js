/**
 * =============================================================================
 * AGUASEGURA LA LIBERTAD - LÓGICA DEL CARRITO DE COMPRAS
 * =============================================================================
 * 
 * Gestiona el estado de los productos seleccionados, cálculo de totales,
 * persistencia en localStorage, validaciones numéricas y emisión de eventos.
 * =============================================================================
 */

import { PRODUCTS, getProductById } from "./products.js";
import { formatCurrency } from "./config.js";

const STORAGE_KEY = "AGUASEGURA_CART_V1";

class Cart {
  constructor() {
    this.items = [];
    this.loadFromStorage();
  }

  /**
   * Carga el estado del carrito desde localStorage
   */
  loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Revalida los productos para sincronizar con los precios actuales de products.js
          this.items = parsed
            .map(item => {
              const product = getProductById(item.id);
              if (!product) return null;
              const qty = parseInt(item.quantity, 10);
              return {
                id: product.id,
                quantity: isNaN(qty) || qty <= 0 ? 1 : qty
              };
            })
            .filter(Boolean);
        }
      }
    } catch (e) {
      console.warn("No se pudo leer el carrito desde localStorage:", e);
      this.items = [];
    }
  }

  /**
   * Guarda el estado actual en localStorage y emite el evento de actualización
   */
  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    } catch (e) {
      console.warn("No se pudo guardar el carrito en localStorage:", e);
    }
    this.emitChange();
  }

  /**
   * Emite un evento del DOM para que la interfaz se actualice de inmediato
   */
  emitChange() {
    const event = new CustomEvent("cart:updated", {
      detail: {
        items: this.getItemsWithDetails(),
        totalCount: this.getTotalItemsCount(),
        totalAmount: this.getTotalAmount()
      }
    });
    window.dispatchEvent(event);
  }

  /**
   * Añade un producto al carrito
   * @param {string} productId - ID del producto
   * @param {number} quantity - Cantidad a agregar (por defecto 1)
   */
  addItem(productId, quantity = 1) {
    const product = getProductById(productId);
    if (!product) {
      console.error(`Producto ${productId} no encontrado`);
      return false;
    }

    const qtyToAdd = Math.max(1, parseInt(quantity, 10) || 1);
    const existingIndex = this.items.findIndex(item => item.id === productId);

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += qtyToAdd;
    } else {
      this.items.push({
        id: productId,
        quantity: qtyToAdd
      });
    }

    this.saveToStorage();
    return true;
  }

  /**
   * Actualiza la cantidad exacta de un producto
   * @param {string} productId - ID del producto
   * @param {number} newQuantity - Nueva cantidad
   */
  updateQuantity(productId, newQuantity) {
    const qty = parseInt(newQuantity, 10);
    const index = this.items.findIndex(item => item.id === productId);

    if (index === -1) return;

    if (isNaN(qty) || qty <= 0) {
      this.removeItem(productId);
      return;
    }

    // Límite razonable por seguridad (máximo 99 unidades por pedido estándar)
    this.items[index].quantity = Math.min(99, qty);
    this.saveToStorage();
  }

  /**
   * Incrementa en 1 la cantidad de un producto
   * @param {string} productId - ID del producto
   */
  increaseQuantity(productId) {
    const item = this.items.find(i => i.id === productId);
    if (item) {
      this.updateQuantity(productId, item.quantity + 1);
    } else {
      this.addItem(productId, 1);
    }
  }

  /**
   * Disminuye en 1 la cantidad de un producto. Si llega a 0, se remueve.
   * @param {string} productId - ID del producto
   */
  decreaseQuantity(productId) {
    const item = this.items.find(i => i.id === productId);
    if (item) {
      if (item.quantity > 1) {
        this.updateQuantity(productId, item.quantity - 1);
      } else {
        this.removeItem(productId);
      }
    }
  }

  /**
   * Elimina un producto por completo del carrito
   * @param {string} productId - ID del producto a eliminar
   */
  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveToStorage();
  }

  /**
   * Vacía todos los productos del carrito
   */
  clear() {
    this.items = [];
    this.saveToStorage();
  }

  /**
   * Obtiene la lista de ítems con sus datos completos y cálculos de subtotal
   * @returns {Array}
   */
  getItemsWithDetails() {
    return this.items.map(item => {
      const product = getProductById(item.id);
      if (!product) return null;
      
      const unitPrice = Number(product.price) || 0;
      const subtotal = Math.round(unitPrice * item.quantity * 100) / 100;

      return {
        ...product,
        quantity: item.quantity,
        subtotal: subtotal,
        subtotalFormatted: formatCurrency(subtotal),
        priceFormatted: formatCurrency(unitPrice)
      };
    }).filter(Boolean);
  }

  /**
   * Conteo total de artículos (suma de todas las unidades)
   * @returns {number}
   */
  getTotalItemsCount() {
    return this.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  }

  /**
   * Calcula el total general del pedido redondeado a 2 decimales
   * @returns {number}
   */
  getTotalAmount() {
    const total = this.getItemsWithDetails().reduce((sum, item) => sum + item.subtotal, 0);
    return Math.round(total * 100) / 100;
  }

  /**
   * Indica si el carrito está completamente vacío
   * @returns {boolean}
   */
  isEmpty() {
    return this.items.length === 0;
  }

  /**
   * Construye el texto ordenado para WhatsApp o cotización formal
   * @param {object} customerData - Datos del cliente
   * @returns {string}
   */
  generateOrderSummaryText(customerData = {}) {
    const items = this.getItemsWithDetails();
    if (items.length === 0) {
      return "El carrito de compras está vacío actualmente.";
    }

    const {
      fullName = "Cliente no especificado",
      phone = "No especificado",
      district = "La Libertad",
      address = "Coordinar entrega",
      preferredContact = "WhatsApp",
      notes = ""
    } = customerData;

    let text = `💧 *PEDIDO - AGUASEGURA LA LIBERTAD* 💧\n`;
    text += `Hola AGUASEGURA, deseo consultar la disponibilidad y coordinar el siguiente pedido de prevención ante lluvias:\n\n`;
    text += `📦 *PRODUCTOS SELECCIONADOS:*\n`;

    items.forEach((item, index) => {
      text += `${index + 1}. *${item.name}*\n`;
      text += `   • Cantidad: ${item.quantity} un.\n`;
      text += `   • Precio unitario: ${item.priceFormatted}\n`;
      text += `   • Subtotal: ${item.subtotalFormatted}\n\n`;
    });

    text += `💰 *MONTO TOTAL REFERENCIAL:* ${formatCurrency(this.getTotalAmount())}\n\n`;
    text += `📍 *DATOS PARA LA ENTREGA:*\n`;
    text += `• Nombre y Apellido: ${fullName}\n`;
    text += `• Celular de contacto: ${phone}\n`;
    text += `• Distrito / Zona: ${district}\n`;
    if (address && address.trim()) {
      text += `• Dirección de referencia: ${address}\n`;
    }
    text += `• Método de contacto preferido: ${preferredContact}\n`;
    if (notes && notes.trim()) {
      text += `• Indicaciones adicionales: ${notes}\n`;
    }

    text += `\nSolicito por favor confirmar disponibilidad de stock, costo y tiempo estimado de entrega, y métodos de pago disponibles. ¡Muchas gracias!`;

    return text;
  }
}

// Exporta una instancia única compartida
export const cart = new Cart();
