/**
 * =============================================================================
 * AGUASEGURA LA LIBERTAD - CATÁLOGO DE PRODUCTOS COMERCIALES
 * =============================================================================
 * 
 * Estructura de datos centralizada con los productos para prevención,
 * recolección de agua y respuesta familiar ante lluvias e inundaciones.
 * Con fotografías oficiales en formato JPG.
 * =============================================================================
 */

export const PRODUCTS = [
  {
    id: "tanque-120l",
    name: "Tanque recolector de lluvia de 120 litros",
    category: "almacenamiento",
    categoryLabel: "Almacenamiento Seguro",
    price: 149.90, // Precio referencial en Soles (S/)
    badge: "Más Solicitado",
    image: "assets/images/tanque-120l.jpg", // Fotografía oficial
    imageAlt: "Tanque recolector de polietileno de 120 litros con tapa hermética",
    shortDescription: "Depósito reforzado con tapa hermética para recolección y almacenamiento higiénico de agua de lluvia.",
    fullDescription: "Fabricado en polietileno de alta densidad con protección contra rayos UV. Cuenta con tapa de rosca de ajuste firme para evitar el ingreso de insectos y suciedad, entrada superior con reborde para acople de canaleta y adaptador inferior para llave de paso o manguera.",
    features: [
      "Capacidad neta: 120 litros",
      "Material: Polietileno virgen virado con filtro UV",
      "Tapa hermética que previene criaderos de zancudos (Dengue)",
      "Salida inferior para grifo de desagüe o distribución",
      "Diseño vertical optimizado para patios y cocheras"
    ],
    usageTip: "Colocar sobre una superficie plana y firme para evitar desbalances cuando esté lleno (peso aproximado: 120 kg)."
  },
  {
    id: "canaleta-basica",
    name: "Canaleta recolectora básica",
    category: "conduccion",
    categoryLabel: "Conducción de Agua",
    price: 59.90, // Precio referencial en Soles (S/)
    badge: "Instalación Fácil",
    image: "assets/images/canaleta-basica.jpg", // Fotografía oficial
    imageAlt: "Kit de canaleta de PVC con soportes, codo de bajada y accesorios para techos",
    shortDescription: "Kit completo de canaleta y accesorios para conducir eficazmente el agua del techo hacia un depósito.",
    fullDescription: "Sistema modular ligero y duradero que recolecta el agua de los tejados, protegiendo las paredes y cimientos de la erosión por goteras y guiando el caudal limpiamente hacia tanques o zonas de desfogue seguro.",
    features: [
      "Incluye tramo principal de 2 metros de PVC de alto impacto",
      "2 soportes de fijación a vigas o aleros con tornillería",
      "Codo direccionador hacia la boca del tanque",
      "Resistente a la corrosión salina típica de la costa liberteña",
      "Malla desmontable en el embudo para retener basura gruesa"
    ],
    usageTip: "Asegúrate de darle una inclinación de al menos 1 cm por metro lineal para evitar estancamientos de agua."
  },
  {
    id: "cubierta-tanque",
    name: "Cubierta protectora para tanque",
    category: "proteccion",
    categoryLabel: "Protección y Filtro",
    price: 24.90, // Precio referencial en Soles (S/)
    badge: "Barrera Sanitaria",
    image: "assets/images/cubierta-tanque.jpg", // Fotografía oficial
    imageAlt: "Cubierta protectora resistente al agua con malla antipolvo y cordón elástico ajustable",
    shortDescription: "Cubierta elástica resistente que ayuda a proteger el depósito de hojas secas, polvo y residuos.",
    fullDescription: "Funda textil impermeable con malla central microporosa que permite el paso continuo del agua mientras bloquea hojas, insectos, arenilla y polvillo transportado por el viento de la costa liberteña.",
    features: [
      "Cordón perimetral elástico de sujeción rápida con tanca",
      "Malla anti-zancudos de trama fina (prevención de dengue)",
      "Tejido sintético imputrescible de secado rápido",
      "Compatible con tanques de 100L a 150L de boca ancha",
      "Lavable a mano y reutilizable temporada tras temporada"
    ],
    usageTip: "Lavar la malla con agua limpia cada 15 días durante lluvias para mantener el flujo constante."
  },
  {
    id: "kit-emergencia",
    name: "Kit de emergencia familiar",
    category: "emergencia",
    categoryLabel: "Respuesta y Emergencia",
    price: 69.90, // Precio referencial en Soles (S/)
    badge: "Recomendado INDECI",
    image: "assets/images/kit-emergencia.jpg", // Fotografía oficial
    imageAlt: "Kit de emergencia familiar con linterna recargable, poncho, silbato y bolso impermeable",
    shortDescription: "Conjunto esencial que incluye linterna LED, silbato de alerta, poncho impermeable y bolsa para documentos.",
    fullDescription: "Paquete preventivo diseñado para mantener a la familia comunicada, iluminada y resguardada ante cortes repentinos de energía o lluvias imprevistas durante la noche.",
    features: [
      "Linterna LED de alta luminosidad con batería recargable USB",
      "Silbato de emergencia de alto decibelio (audible a larga distancia)",
      "Poncho impermeable con capucha reforzada y visibilidad reflectiva",
      "Bolsa estanca hermética (cierre ziploc triple) para DNI, escrituras y dinero",
      "Estuche organizador con manija de transporte rápido"
    ],
    usageTip: "Mantén este kit en un lugar visible y de fácil acceso cerca de la puerta principal de tu vivienda."
  },
  {
    id: "bolsa-arena",
    name: "Bolsa de arena reutilizable (unidad)",
    category: "proteccion",
    categoryLabel: "Contención Perimetral",
    price: 8.50, // Precio referencial en Soles (S/)
    badge: "Económico y Vital",
    image: "assets/images/bolsa-arena.jpg", // Fotografía oficial
    imageAlt: "Bolsa de polipropileno reforzado con amarra para desvío preventivo de corrientes de agua",
    shortDescription: "Bolsa de polipropileno extrafuerte para rellenar con arena y desviar pequeños flujos de agua.",
    fullDescription: "Saco de polipropileno con tratamiento UV y costura doble reforzada. Diseñado para formar diques de contención en portones, entradas a desnivel, puertas de servicio y veredas expuestas a corrientes superficiales.",
    features: [
      "Medidas estándar: 40 cm x 70 cm (capacidad óptima: 15-20 kg)",
      "Cuerda de amarre incorporada para sellado rápido",
      "Material tejido antidesgarro de alta durabilidad",
      "Reutilizable si se vacía y almacena seca después de la temporada",
      "Eficaz para desviar corrientes antes de que ingresen a la casa"
    ],
    usageTip: "Llenar solo hasta 2/3 de su capacidad para permitir que se amolde bien al suelo y entre bolsas contiguas."
  },
  {
    id: "caja-impermeable",
    name: "Caja organizadora impermeable",
    category: "proteccion",
    categoryLabel: "Protección y Resguardo",
    price: 34.90, // Precio referencial en Soles (S/)
    badge: "Sellado Seguro",
    image: "assets/images/caja-impermeable.jpg", // Fotografía oficial
    imageAlt: "Caja organizadora con cierre hermético de silicona para resguardo de documentos y pilas",
    shortDescription: "Caja con tapa hermética para proteger documentos, pilas y objetos valiosos contra salpicaduras y humedad.",
    fullDescription: "Contenedor rígido de policarbonato translúcido con empaque de silicona perimetral y clips de presión en cuatro costados. Asegura que papeles importantes, certificados, medicamentos y aparatos electrónicos se mantengan secos.",
    features: [
      "Empaque perimetral de silicona que bloquea el agua y polvo",
      "4 broches de bloqueo a presión ultra seguros",
      "Capacidad: 10 litros con separadores internos desmontables",
      "Manija ergonómica plegable de transporte",
      "Cuerpo transparente para identificar el contenido sin abrir la tapa"
    ],
    usageTip: "Coloca dentro un sobre absorbente de humedad (sílica) para máxima protección de papeles oficiales y fotos."
  }
];

/**
 * Obtiene un producto por su identificador único
 * @param {string} id - ID del producto
 * @returns {object|null}
 */
export function getProductById(id) {
  return PRODUCTS.find(p => p.id === id) || null;
}

/**
 * Filtra productos por categoría
 * @param {string} category - Categoría a filtrar o 'todos'
 * @returns {Array} Lista filtrada de productos
 */
export function getProductsByCategory(category = "todos") {
  if (!category || category === "todos") {
    return PRODUCTS;
  }
  return PRODUCTS.filter(p => p.category === category);
}
