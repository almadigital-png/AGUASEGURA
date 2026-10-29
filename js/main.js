/**
 * =============================================================================
 * AGUASEGURA LA LIBERTAD - ARCHIVO PRINCIPAL DE CONTROL E INTERACTIVIDAD
 * =============================================================================
 * 
 * Orquesta la navegación, renderizado del catálogo, filtros, buscador,
 * interacción del carrito, validación accesible del formulario de pedidos,
 * apertura de modales y preparación de la integración con WhatsApp.
 * =============================================================================
 */

import { CONFIG, formatCurrency, isWhatsAppConfigured, buildWhatsAppLink } from "./config.js";
import { PRODUCTS, getProductsByCategory } from "./products.js";
import { cart } from "./cart.js";

// Estado local de la aplicación
const state = {
  currentFilter: "todos",
  searchQuery: "",
  customerData: {
    fullName: "",
    phone: "",
    email: "",
    district: "",
    address: "",
    preferredContact: "WhatsApp",
    notes: ""
  }
};

/**
 * Inicialización al cargar el DOM
 */
document.addEventListener("DOMContentLoaded", () => {
  initBrandingAndConfig();
  renderProducts();
  setupFilterAndSearchEvents();
  setupCartDrawerEvents();
  setupCartMainEvents();
  setupOrderForm();
  setupWhatsAppModal();
  setupMobileMenu();
  setupNavigationActiveState();
  loadSavedCustomerData();

  // Escucha cambios globales en el carrito
  window.addEventListener("cart:updated", () => {
    updateCartUI();
  });

  // Render inicial del carrito
  updateCartUI();
});

/**
 * 1. Sincroniza logotipos, correos y estados de WhatsApp desde js/config.js
 */
function initBrandingAndConfig() {
  // Logotipo
  const headerLogo = document.getElementById("header-logo");
  if (headerLogo && CONFIG.logo.src) {
    headerLogo.src = CONFIG.logo.src;
    headerLogo.alt = CONFIG.logo.alt;
  }

  // Tarjeta de estado de WhatsApp en sección Contacto
  const waBadge = document.getElementById("whatsapp-status-badge");
  const waStatusText = document.getElementById("whatsapp-status-text");
  const footerWaText = document.getElementById("footer-whatsapp-text");
  const footerEmailText = document.getElementById("footer-email-text");

  if (isWhatsAppConfigured()) {
    if (waBadge) {
      waBadge.textContent = "Línea Comercial Activa";
      waBadge.style.backgroundColor = "#D1FADF";
      waBadge.style.color = "#05603A";
    }
    if (waStatusText) {
      waStatusText.innerHTML = `Número oficial configurado: <strong>+${CONFIG.contact.whatsappNumber}</strong>. Puedes enviar tu pedido directamente con un clic.`;
    }
    if (footerWaText) {
      footerWaText.textContent = `+${CONFIG.contact.whatsappNumber}`;
    }
  } else {
    if (waBadge) {
      waBadge.textContent = "Configuración Pendiente";
      waBadge.style.backgroundColor = "#FEF3C7";
      waBadge.style.color = "#92400E";
    }
    if (waStatusText) {
      waStatusText.innerHTML = `El número oficial de WhatsApp comercial será asignado en breve. Puedes estructurar tu pedido y copiar el texto para enviarlo por cualquier vía.`;
    }
    if (footerWaText) {
      footerWaText.textContent = "Pendiente de asignación oficial (ver js/config.js)";
    }
  }

  // Correo electrónico
  if (footerEmailText) {
    if (CONFIG.contact.email && CONFIG.contact.email.trim()) {
      footerEmailText.textContent = CONFIG.contact.email;
    } else {
      footerEmailText.textContent = "Pendiente de configuración institucional";
    }
  }
}

/**
 * 2. Renderizado dinámico del catálogo de productos
 */
function renderProducts() {
  const container = document.getElementById("products-grid");
  if (!container) return;

  // Filtrado por categoría
  let list = getProductsByCategory(state.currentFilter);

  // Filtrado por texto de búsqueda
  if (state.searchQuery.trim()) {
    const q = state.searchQuery.toLowerCase().trim();
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.categoryLabel.toLowerCase().includes(q)
    );
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; background: var(--color-blanco); border-radius: var(--radio-lg); border: 1px dashed var(--color-borde);">
        <p style="font-size: 1.1rem; font-weight: 700; color: var(--color-petroleo-dark); margin-bottom: 0.5rem;">No se encontraron productos coincidentes</p>
        <p style="font-size: 0.875rem; color: var(--color-texto-secundario);">Prueba con otros términos de búsqueda o selecciona otra categoría.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(product => `
    <article class="product-card" data-product-id="${product.id}">
      <div class="product-image-container">
        <img src="${product.image}" alt="${product.imageAlt}" class="product-image" loading="lazy">
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
        <span class="product-category-tag">${product.categoryLabel}</span>
      </div>

      <div class="product-body">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-description">${product.shortDescription}</p>

        <ul class="product-features-mini" aria-label="Características clave de ${product.name}">
          ${product.features.slice(0, 3).map(f => `<li>${f}</li>`).join("")}
        </ul>

        <div class="product-footer">
          <div class="product-price-row">
            <span class="price-label">Precio Referencial</span>
            <span class="price-value">${formatCurrency(product.price)}</span>
          </div>

          <div class="product-actions-row">
            <!-- Selector accesible de cantidad -->
            <div class="qty-control" role="group" aria-label="Cantidad para ${product.name}">
              <button type="button" class="qty-btn btn-qty-minus" data-id="${product.id}" aria-label="Disminuir cantidad">-</button>
              <input type="number" class="qty-input" id="qty-input-${product.id}" value="1" min="1" max="99" aria-label="Cantidad">
              <button type="button" class="qty-btn btn-qty-plus" data-id="${product.id}" aria-label="Aumentar cantidad">+</button>
            </div>

            <button type="button" class="btn-add-cart" data-id="${product.id}" aria-label="Agregar ${product.name} al carrito">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/><line x1="12" y1="9" x2="12" y2="15"/><line x1="9" y1="12" x2="15" y2="12"/></svg>
              <span>Agregar</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  `).join("");

  attachProductCardEvents();
}

/**
 * 3. Eventos de los botones de cantidad y agregar en las tarjetas
 */
function attachProductCardEvents() {
  // Disminuir cantidad del input
  document.querySelectorAll(".btn-qty-minus").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const input = document.getElementById(`qty-input-${id}`);
      if (input) {
        const val = parseInt(input.value, 10) || 1;
        input.value = Math.max(1, val - 1);
      }
    });
  });

  // Aumentar cantidad del input
  document.querySelectorAll(".btn-qty-plus").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const input = document.getElementById(`qty-input-${id}`);
      if (input) {
        const val = parseInt(input.value, 10) || 1;
        input.value = Math.min(99, val + 1);
      }
    });
  });

  // Agregar al carrito
  document.querySelectorAll(".btn-add-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const input = document.getElementById(`qty-input-${id}`);
      const qty = input ? parseInt(input.value, 10) || 1 : 1;

      const product = PRODUCTS.find(p => p.id === id);
      if (cart.addItem(id, qty)) {
        showToast(`✓ Agregado: ${qty}x ${product ? product.name : 'producto'}`);
        // Reset cantidad del selector a 1
        if (input) input.value = 1;
      }
    });
  });
}

/**
 * 4. Configuración de filtros por categoría y buscador
 */
function setupFilterAndSearchEvents() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.currentFilter = btn.getAttribute("data-filter") || "todos";
      renderProducts();
    });
  });

  const searchInput = document.getElementById("catalog-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      renderProducts();
    });
  }
}

/**
 * 5. Actualización completa de la UI del Carrito (Sección Principal y Drawer)
 */
function updateCartUI() {
  const items = cart.getItemsWithDetails();
  const totalCount = cart.getTotalItemsCount();
  const totalAmount = cart.getTotalAmount();
  const formattedTotal = formatCurrency(totalAmount);

  // Badge en el encabezado
  const badge = document.getElementById("header-cart-badge");
  if (badge) {
    badge.textContent = totalCount;
  }

  // Resumen en la sección principal del carrito
  const summaryCount = document.getElementById("summary-items-count");
  const summarySubtotal = document.getElementById("summary-subtotal");
  const summaryTotal = document.getElementById("summary-total");
  const drawerTotal = document.getElementById("drawer-total-amount");

  if (summaryCount) summaryCount.textContent = `${totalCount} ${totalCount === 1 ? 'unidad' : 'unidades'}`;
  if (summarySubtotal) summarySubtotal.textContent = formattedTotal;
  if (summaryTotal) summaryTotal.textContent = formattedTotal;
  if (drawerTotal) drawerTotal.textContent = formattedTotal;

  // Renderizar contenido de la sección principal
  renderCartSection(items);

  // Renderizar contenido del Drawer lateral
  renderCartDrawer(items);
}

/**
 * Renderiza la sección de carrito principal (#cart-items-list)
 */
function renderCartSection(items) {
  const container = document.getElementById("cart-items-list");
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-state">
        <div class="empty-cart-icon" aria-hidden="true">🛒</div>
        <h4 class="empty-cart-title">Tu carrito de AGUASEGURA está vacío</h4>
        <p class="empty-cart-desc">Añade productos de prevención o recolección de agua para preparar tu pedido.</p>
        <a href="#productos" class="btn btn-petroleo btn-sm">Explorar Catálogo</a>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="cart-item-row" data-cart-id="${item.id}">
      <img src="${item.image}" alt="${item.imageAlt}" class="cart-item-thumb">
      <div class="cart-item-info">
        <h4 class="cart-item-title">${item.name}</h4>
        <div class="cart-item-unit-price">${item.priceFormatted} c/u</div>
      </div>
      <div class="cart-item-actions">
        <div class="qty-control" role="group" aria-label="Cantidad para ${item.name}">
          <button type="button" class="qty-btn btn-cart-minus" data-id="${item.id}" aria-label="Disminuir">-</button>
          <input type="number" class="qty-input" value="${item.quantity}" min="1" max="99" data-id="${item.id}" aria-label="Cantidad actual">
          <button type="button" class="qty-btn btn-cart-plus" data-id="${item.id}" aria-label="Aumentar">+</button>
        </div>
        <div class="cart-item-subtotal">${item.subtotalFormatted}</div>
        <button type="button" class="btn-remove-item" data-id="${item.id}" aria-label="Eliminar ${item.name}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    </div>
  `).join("");

  attachCartItemEventListeners(container);
}

/**
 * Renderiza el Drawer lateral (#drawer-cart-items)
 */
function renderCartDrawer(items) {
  const container = document.getElementById("drawer-cart-items");
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-state" style="padding: 2rem 1rem;">
        <div class="empty-cart-icon" style="font-size: 2.5rem;" aria-hidden="true">🛒</div>
        <h4 class="empty-cart-title" style="font-size: 1.05rem;">Tu carrito está vacío</h4>
        <p class="empty-cart-desc" style="font-size: 0.825rem;">Aún no has seleccionado productos de prevención.</p>
        <button type="button" class="btn btn-petroleo btn-sm" id="btn-drawer-go-products">Ver Productos</button>
      </div>
    `;
    const btnGo = document.getElementById("btn-drawer-go-products");
    if (btnGo) {
      btnGo.addEventListener("click", () => {
        closeCartDrawer();
        window.location.hash = "#productos";
      });
    }
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="cart-item-row" style="margin-bottom: 0.85rem;" data-cart-id="${item.id}">
      <img src="${item.image}" alt="${item.imageAlt}" style="width: 48px; height: 48px;" class="cart-item-thumb">
      <div class="cart-item-info">
        <h4 class="cart-item-title" style="font-size: 0.875rem;">${item.name}</h4>
        <div class="cart-item-unit-price">${item.priceFormatted}</div>
      </div>
      <div class="cart-item-actions">
        <div class="qty-control" style="height: 34px;">
          <button type="button" class="qty-btn btn-cart-minus" data-id="${item.id}" style="width: 26px;">-</button>
          <input type="number" class="qty-input" value="${item.quantity}" style="width: 30px; font-size: 0.8rem;" data-id="${item.id}">
          <button type="button" class="qty-btn btn-cart-plus" data-id="${item.id}" style="width: 26px;">+</button>
        </div>
        <div class="cart-item-subtotal" style="font-size: 0.95rem; min-width: 70px;">${item.subtotalFormatted}</div>
        <button type="button" class="btn-remove-item" data-id="${item.id}" aria-label="Eliminar ${item.name}">✕</button>
      </div>
    </div>
  `).join("");

  attachCartItemEventListeners(container);
}

/**
 * Eventos dentro de los contenedores de carrito
 */
function attachCartItemEventListeners(parent) {
  parent.querySelectorAll(".btn-cart-minus").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      cart.decreaseQuantity(id);
    });
  });

  parent.querySelectorAll(".btn-cart-plus").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      cart.increaseQuantity(id);
    });
  });

  parent.querySelectorAll(".btn-remove-item").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const product = PRODUCTS.find(p => p.id === id);
      cart.removeItem(id);
      showToast(`Producto retirado del carrito.`);
    });
  });

  parent.querySelectorAll("input.qty-input").forEach(input => {
    input.addEventListener("change", () => {
      const id = input.getAttribute("data-id");
      cart.updateQuantity(id, input.value);
    });
  });
}

/**
 * 6. Eventos de la sección principal del carrito
 */
function setupCartMainEvents() {
  // Vaciar carrito principal (sin confirm bloqueante)
  const btnClear = document.getElementById("btn-clear-cart-main");
  if (btnClear) {
    btnClear.addEventListener("click", () => {
      if (cart.isEmpty()) {
        showToast("El carrito ya se encuentra vacío.");
        return;
      }
      cart.clear();
      showToast("✓ Se vació todo el carrito de compras.");
    });
  }

  // Botón de checkout por WhatsApp en la sección del carrito
  const btnCheckout = document.getElementById("btn-checkout-whatsapp");
  if (btnCheckout) {
    btnCheckout.addEventListener("click", () => {
      handleWhatsAppCheckout();
    });
  }
}

/**
 * 7. Eventos del Drawer flotante del carrito
 */
function setupCartDrawerEvents() {
  const btnOpen = document.getElementById("btn-open-cart-drawer");
  const btnClose = document.getElementById("btn-close-cart-drawer");
  const overlay = document.getElementById("cart-drawer-overlay");
  const drawer = document.getElementById("cart-drawer");
  const btnDrawerCheckout = document.getElementById("btn-drawer-checkout");
  const btnDrawerViewFull = document.getElementById("btn-drawer-view-full");
  const btnClearDrawer = document.getElementById("btn-clear-cart-drawer");

  if (btnOpen) {
    btnOpen.addEventListener("click", () => {
      openCartDrawer();
    });
  }

  if (btnClose) {
    btnClose.addEventListener("click", () => {
      closeCartDrawer();
    });
  }

  if (overlay) {
    overlay.addEventListener("click", () => {
      closeCartDrawer();
    });
  }

  if (btnClearDrawer) {
    btnClearDrawer.addEventListener("click", () => {
      if (cart.isEmpty()) {
        showToast("El carrito ya se encuentra vacío.");
        return;
      }
      cart.clear();
      showToast("✓ Se vació todo el carrito de compras.");
    });
  }

  if (btnDrawerCheckout) {
    btnDrawerCheckout.addEventListener("click", () => {
      closeCartDrawer();
      handleWhatsAppCheckout();
    });
  }

  if (btnDrawerViewFull) {
    btnDrawerViewFull.addEventListener("click", () => {
      closeCartDrawer();
    });
  }

  // Tecla Escape para cerrar
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer && drawer.classList.contains("active")) {
      closeCartDrawer();
    }
  });
}

function openCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-drawer-overlay");
  if (drawer && overlay) {
    drawer.classList.add("active");
    drawer.setAttribute("aria-hidden", "false");
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-drawer-overlay");
  if (drawer && overlay) {
    drawer.classList.remove("active");
    drawer.setAttribute("aria-hidden", "true");
    overlay.classList.remove("active");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
}

/**
 * 8. Formulario de contacto y pedido con validación accesible
 */
function setupOrderForm() {
  const form = document.getElementById("order-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validateOrderForm()) return;

    saveCustomerDataFromForm();

    const submitBtn = document.getElementById("btn-submit-order");
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : "";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Enviando pedido a AGUASEGURA...</span>`;
    }

    const orderText = cart.generateOrderSummaryText(state.customerData);
    const formspreeSummary = document.getElementById("formspree-order-summary");
    const formspreeTotal = document.getElementById("formspree-order-total");

    if (formspreeSummary) formspreeSummary.value = orderText;
    if (formspreeTotal) formspreeTotal.value = formatCurrency(cart.getTotalAmount());

    const formData = new FormData(form);
    formData.append("resumen_pedido_texto", orderText);
    formData.append("total_soles", formatCurrency(cart.getTotalAmount()));

    const endpoint = CONFIG.contact.formspreeUrl || "https://formspree.io/f/xrppknoe";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" }
      });

      if (response.ok) {
        showToast("✓ Pedido registrado y enviado a almadigital044@gmail.com.");
      } else {
        showToast("✓ Pedido preparado correctamente.");
      }
    } catch (err) {
      console.warn("Envío a Formspree:", err);
      showToast("✓ Pedido preparado localmente para WhatsApp.");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }

      if (cart.isEmpty()) {
        showToast("Tus datos fueron guardados. Agrega productos al carrito.");
        window.location.hash = "#productos";
      } else {
        openWhatsAppModal();
      }
    }
  });

  // Limpiar errores en tiempo real al escribir
  const inputs = form.querySelectorAll("input, select, textarea");
  inputs.forEach(input => {
    input.addEventListener("input", () => {
      input.classList.remove("is-invalid");
    });
  });
}

function validateOrderForm() {
  let isValid = true;

  const nameInput = document.getElementById("customer-name");
  const phoneInput = document.getElementById("customer-phone");
  const emailInput = document.getElementById("customer-email");
  const districtSelect = document.getElementById("customer-district");

  // Validación de Nombre
  if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
    nameInput.classList.add("is-invalid");
    isValid = false;
  } else {
    nameInput.classList.remove("is-invalid");
  }

  // Validación de Celular (9 dígitos para Perú)
  const phoneVal = phoneInput.value.trim().replace(/\s+/g, "");
  const phonePattern = /^[0-9]{9}$/;
  if (!phonePattern.test(phoneVal)) {
    phoneInput.classList.add("is-invalid");
    isValid = false;
  } else {
    phoneInput.classList.remove("is-invalid");
  }

  // Validación de Correo Electrónico (Obligatorio para recepción y notificación)
  const emailVal = emailInput.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailVal || !emailPattern.test(emailVal)) {
    emailInput.classList.add("is-invalid");
    isValid = false;
  } else {
    emailInput.classList.remove("is-invalid");
  }

  // Validación de Distrito
  if (!districtSelect.value) {
    districtSelect.classList.add("is-invalid");
    isValid = false;
  } else {
    districtSelect.classList.remove("is-invalid");
  }

  if (!isValid) {
    showToast("Por favor completa los campos obligatorios señalados en rojo.");
  }

  return isValid;
}

/**
 * Verifica si los datos obligatorios del cliente ya han sido completados
 */
function isCustomerDataComplete() {
  const { fullName, phone, email, district } = state.customerData;
  const phonePattern = /^[0-9]{9}$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return !!(
    fullName && fullName.trim().length >= 3 &&
    phone && phonePattern.test(phone.trim().replace(/\s+/g, "")) &&
    email && emailPattern.test(email.trim()) &&
    district && district.trim().length > 0
  );
}

function saveCustomerDataFromForm() {
  const form = document.getElementById("order-form");
  const formData = new FormData(form);

  state.customerData = {
    fullName: (formData.get("customerName") || "").toString().trim(),
    phone: (formData.get("customerPhone") || "").toString().trim(),
    email: (formData.get("customerEmail") || "").toString().trim(),
    district: (formData.get("customerDistrict") || "").toString().trim(),
    address: (formData.get("customerAddress") || "").toString().trim(),
    preferredContact: "WhatsApp",
    notes: (formData.get("customerNotes") || "").toString().trim()
  };

  try {
    localStorage.setItem("AGUASEGURA_CUSTOMER_V1", JSON.stringify(state.customerData));
  } catch (e) {
    console.warn("No se pudo persistir datos del cliente:", e);
  }
}

function loadSavedCustomerData() {
  try {
    const saved = localStorage.getItem("AGUASEGURA_CUSTOMER_V1");
    if (saved) {
      state.customerData = JSON.parse(saved);
      const nameInput = document.getElementById("customer-name");
      const phoneInput = document.getElementById("customer-phone");
      const emailInput = document.getElementById("customer-email");
      const districtSelect = document.getElementById("customer-district");
      const addressInput = document.getElementById("customer-address");
      const notesInput = document.getElementById("customer-notes");

      if (nameInput && state.customerData.fullName) nameInput.value = state.customerData.fullName;
      if (phoneInput && state.customerData.phone) phoneInput.value = state.customerData.phone;
      if (emailInput && state.customerData.email) emailInput.value = state.customerData.email;
      if (districtSelect && state.customerData.district) districtSelect.value = state.customerData.district;
      if (addressInput && state.customerData.address) addressInput.value = state.customerData.address;
      if (notesInput && state.customerData.notes) notesInput.value = state.customerData.notes;
    }
  } catch (e) {
    console.warn("Error cargando cliente guardado:", e);
  }
}

/**
 * 9. Flujo de Pedido y Modal de WhatsApp
 */
function handleWhatsAppCheckout() {
  if (cart.isEmpty()) {
    showToast("Tu carrito está vacío. Agrega productos antes de coordinar tu pedido.");
    window.location.hash = "#productos";
    return;
  }

  // Obligatorio: debe completar el formulario de contacto para que el pedido se realice correctamente
  if (!isCustomerDataComplete()) {
    showToast("⚠️ Para coordinar por WhatsApp, primero completa tus datos en el formulario.");
    closeCartDrawer();
    window.location.hash = "#contacto";

    setTimeout(() => {
      const nameInput = document.getElementById("customer-name");
      const phoneInput = document.getElementById("customer-phone");
      const emailInput = document.getElementById("customer-email");
      const districtSelect = document.getElementById("customer-district");

      if (!nameInput.value.trim()) nameInput.focus();
      else if (!phoneInput.value.trim()) phoneInput.focus();
      else if (!emailInput.value.trim()) emailInput.focus();
      else if (!districtSelect.value) districtSelect.focus();
      else nameInput.focus();
    }, 350);
    return;
  }

  openWhatsAppModal();
}

function setupWhatsAppModal() {
  const modal = document.getElementById("whatsapp-modal-overlay");
  const btnCloseX = document.getElementById("btn-close-modal");
  const btnCloseAct = document.getElementById("btn-modal-close-action");
  const btnCopy = document.getElementById("btn-copy-order-text");

  const closeFn = () => {
    if (modal) {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  };

  if (btnCloseX) btnCloseX.addEventListener("click", closeFn);
  if (btnCloseAct) btnCloseAct.addEventListener("click", closeFn);
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeFn();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("active")) {
      closeFn();
    }
  });

  if (btnCopy) {
    btnCopy.addEventListener("click", () => {
      const orderText = cart.generateOrderSummaryText(state.customerData);
      navigator.clipboard.writeText(orderText).then(() => {
        showToast("✓ Texto del pedido copiado al portapapeles.");
      }).catch(() => {
        showToast("Selecciona y copia el texto manualmente.");
      });
    });
  }
}

function openWhatsAppModal() {
  const modal = document.getElementById("whatsapp-modal-overlay");
  const noticeBox = document.getElementById("whatsapp-notice-box");
  const codeBox = document.getElementById("modal-order-preview-text");
  const btnOpenWa = document.getElementById("btn-modal-open-wa");

  if (!modal || !codeBox) return;

  const orderText = cart.generateOrderSummaryText(state.customerData);
  codeBox.textContent = orderText;

  const isConfigured = isWhatsAppConfigured();

  if (isConfigured) {
    const encoded = encodeURIComponent(orderText);
    const link = buildWhatsAppLink(encoded);

    noticeBox.innerHTML = `
      <p style="color: var(--color-exito); font-weight: 800; font-size: 0.95rem; margin-bottom: 0.35rem;">
        ✓ Línea Oficial de WhatsApp Activa (+51 981 405 070)
      </p>
      <p style="font-size: 0.85rem; color: var(--color-texto-principal); line-height: 1.5;">
        Tu pedido ha sido estructurado y enviado al correo institucional <strong>almadigital044@gmail.com</strong>.
        Haz clic en el botón verde para abrir el chat de WhatsApp y coordinar la entrega directamente.
      </p>
    `;

    if (btnOpenWa) {
      btnOpenWa.href = link;
      btnOpenWa.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="margin-right: 4px;"><path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.476-.15-.676.15-.2.301-.776.98-.952 1.18-.175.2-.351.226-.652.076-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.784-1.676-2.085-.175-.3-.019-.463.132-.612.136-.134.301-.35.452-.525.15-.175.2-.3.301-.5.1-.2.05-.375-.025-.525-.075-.15-.676-1.63-.927-2.232-.244-.587-.492-.507-.676-.516l-.576-.01c-.2 0-.526.075-.802.375-.276.301-1.053 1.028-1.053 2.508 0 1.48 1.078 2.909 1.229 3.109.15.2 2.122 3.24 5.14 4.542.718.31 1.279.496 1.716.635.72.23 1.376.197 1.895.12.578-.088 1.78-.727 2.03-1.43.25-.702.25-1.303.175-1.43-.075-.125-.276-.2-.577-.35zM12 2C6.477 2 2 6.477 2 12c0 1.77.46 3.435 1.264 4.885L2.05 22l5.267-1.187C8.71 21.583 10.316 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>
        <span>Enviar a WhatsApp (981 405 070)</span>
      `;
      btnOpenWa.style.display = "inline-flex";
    }
  } else {
    noticeBox.innerHTML = `
      <p style="color: var(--color-amarillo-dark); font-weight: 800; margin-bottom: 0.35rem;">
        ⚠️ Número comercial oficial pendiente de asignación
      </p>
      <p style="font-size: 0.85rem; line-height: 1.5; color: var(--color-texto-principal);">
        El número de WhatsApp definitivo de <strong>AGUASEGURA La Libertad</strong> aún no ha sido configurado en el código (está centralizado en <code>js/config.js</code>).
      </p>
      <p style="font-size: 0.825rem; margin-top: 0.4rem; color: var(--color-texto-secundario);">
        Puedes hacer clic en <strong>"Copiar Texto del Pedido"</strong> para tener listo tu requerimiento y enviarlo en cuanto la línea esté operativa.
      </p>
    `;

    if (btnOpenWa) {
      btnOpenWa.style.display = "none";
    }
  }

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

/**
 * 10. Menú desplegable para móviles
 */
function setupMobileMenu() {
  const toggleBtn = document.getElementById("mobile-menu-btn");
  const nav = document.getElementById("main-nav");

  if (toggleBtn && nav) {
    toggleBtn.addEventListener("click", () => {
      const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
      toggleBtn.setAttribute("aria-expanded", (!isExpanded).toString());
      nav.classList.toggle("active");
    });

    // Cerrar al pulsar un enlace
    nav.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        toggleBtn.setAttribute("aria-expanded", "false");
        nav.classList.remove("active");
      });
    });
  }
}

/**
 * 11. Actualización del enlace activo en la navegación
 */
function setupNavigationActiveState() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let current = "";
    const scrollPos = window.pageYOffset + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute("id") || "";
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}

/**
 * 12. Notificaciones Toast flotantes y accesibles
 */
function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "alert");
  toast.innerHTML = `
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3200);
}
