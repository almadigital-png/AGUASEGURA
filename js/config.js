/**
 * =============================================================================
 * AGUASEGURA LA LIBERTAD - ARCHIVO DE CONFIGURACIÓN CENTRALIZADA
 * =============================================================================
 * 
 * Configuración oficial de la marca, logotipo oficial, canales de contacto,
 * número de WhatsApp y endpoint de Formspree.
 * =============================================================================
 */

export const CONFIG = {
  // Identidad comercial
  brand: {
    name: "AGUASEGURA La Libertad",
    shortName: "AGUASEGURA",
    tagline: "Prevención, almacenamiento seguro y protección familiar ante lluvias intensas",
    region: "Región La Libertad, Perú",
    purpose: "Emprendimiento orientado a facilitar a las familias de La Libertad productos esenciales para recolectar agua de lluvia, proteger objetos de valor y mitigar riesgos asociados al Fenómeno de El Niño."
  },

  // Logotipo oficial de la empresa
  logo: {
    isPlaceholder: false, // Logotipo oficial adoptado
    src: "/images/logo.jpg", // Ruta al logotipo oficial publicado
    alt: "Logotipo oficial de AGUASEGURA La Libertad",
    notes: "Identidad visual oficial con escudo, gota de agua y colores corporativos."
  },

  // Canales oficiales de contacto y recepción de pedidos
  contact: {
    // Número oficial de WhatsApp comercial (981405070 con prefijo de Perú 51)
    whatsappNumber: "51981405070", 
    whatsappDisplay: "+51 981 405 070",
    
    // Correo electrónico comercial oficial
    email: "almadigital044@gmail.com", 

    // Integración de formulario mediante Formspree
    formspreeUrl: "https://formspree.io/f/xrppknoe",
    
    // Horario referencial de atención ciudadana y recepción de pedidos
    attentionHours: "Lunes a Sábado de 8:00 a.m. a 7:00 p.m.",
    
    // Ámbito territorial de cobertura prioritaria
    coverageAreas: [
      "Trujillo Metropolitano (Trujillo, Víctor Larco, El Porvenir, La Esperanza, Huanchaco, Florencia de Mora, Laredo, Moche, Salaverry)",
      "Valle Chicama y Ascope (Paiján, Casa Grande, Chocope, Cartavio)",
      "Provincias costeras: Chepén, Pacasmayo y Virú",
      "Zonas de sierra liberteña: Otuzco y Sánchez Carrión"
    ]
  },

  // Moneda e idioma
  currency: {
    symbol: "S/",
    code: "PEN",
    locale: "es-PE"
  },

  // Descargos de responsabilidad y notas técnicas de prevención
  disclaimers: {
    waterPotability: "Aviso importante de salubridad: El agua de lluvia recolectada mediante techos y canaletas NO es automáticamente apta para consumo humano directo. Debe ser clorada, filtrada o hervida adecuadamente conforme a las recomendaciones del Ministerio de Salud (MINSA) y DIGESA para prevenir enfermedades diarreicas y gástricas.",
    floodProtection: "Aviso preventivo de gestión de riesgos: Las bolsas de arena y barreras perimetrales son herramientas de mitigación para desviar flujos menores de agua pluvial y salpicaduras; no sustituyen las obras de ingeniería ni garantizan protección absoluta ante huaicos o inundaciones severas. Sigue siempre las instrucciones y alertas emitidas por INDECI y el Centro de Operaciones de Emergencia Regional (COER La Libertad).",
    preventionMosquitoes: "Control del dengue: Todo depósito o tanque recolector debe mantenerse herméticamente tapado con su tapa o malla protectora para evitar la proliferación del zancudo Aedes aegypti, transmisor del Dengue y Chikungunya en La Libertad."
  }
};

/**
 * Formatea un número como moneda en soles peruanos (S/ 00.00)
 * @param {number} amount - Monto numérico
 * @returns {string} Texto formateado en soles peruanos
 */
export function formatCurrency(amount) {
  if (typeof amount !== "number" || isNaN(amount) || amount < 0) {
    return `${CONFIG.currency.symbol} 0.00`;
  }
  return `${CONFIG.currency.symbol} ${amount.toFixed(2)}`;
}

/**
 * Verifica si el número de WhatsApp comercial ya ha sido configurado válidamente
 * @returns {boolean}
 */
export function isWhatsAppConfigured() {
  const number = (CONFIG.contact.whatsappNumber || "").trim();
  return number.length >= 9 && !isNaN(Number(number));
}

/**
 * Construye el enlace de WhatsApp con el mensaje codificado
 * @param {string} encodedMessage - Mensaje codificado para URL
 * @returns {string} Enlace completo de WhatsApp
 */
export function buildWhatsAppLink(encodedMessage) {
  const number = (CONFIG.contact.whatsappNumber || "").trim();
  return `https://wa.me/${number}?text=${encodedMessage}`;
}
