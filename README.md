# AGUASEGURA La Libertad 💧
> **Prevención, almacenamiento seguro y protección familiar ante lluvias intensas y el Fenómeno de El Niño en la región La Libertad, Perú.**

Página web comercial moderna, responsiva y accesible desarrollada exclusivamente con **HTML5 semántico, CSS3 puro y JavaScript nativo (ES6+)**, sin frameworks ni dependencias complejas.

---

## 📱 Canales Oficiales Configurados

- **Logotipo Oficial**: `assets/images/logo.svg` (diseño oficial con gota de agua, escudo protector y colores institucionales sin franjas provisionales).
- **WhatsApp Comercial Oficial**: `+51 981 405 070` (enlaces directos con mensaje de pedido estructurado hacia `https://wa.me/51981405070`).
- **Correo Electrónico Oficial**: `almadigital044@gmail.com`.
- **Integración de Formularios**: Formspree oficial conectado en `https://formspree.io/f/xrppknoe`.

---

## 📁 Estructura del Proyecto

```text
├── index.html                   # Estructura semántica, accesibilidad y contenido principal
├── css/
│   └── styles.css               # Sistema de diseño, variables CSS3, paleta de colores y responsive
├── js/
│   ├── config.js                # Configuración oficial de marca, logo, correo, Formspree y WhatsApp
│   ├── products.js              # Catálogo comercial con fotografías oficiales en JPG y precios en Soles (S/)
│   ├── cart.js                  # Lógica del carrito, cálculos automáticos y persistencia en localStorage
│   └── main.js                  # Orquestador de eventos, filtros, Formspree y WhatsApp
├── assets/
│   └── images/                  # Carpeta de recursos gráficos y fotografías de productos
│       ├── logo.svg             # Logotipo oficial de AGUASEGURA La Libertad
│       ├── tanque-120l.jpg      # Tanque recolector de lluvia de 120 litros (JPG)
│       ├── canaleta-basica.jpg  # Canaleta recolectora básica con kit (JPG)
│       ├── cubierta-tanque.jpg  # Cubierta protectora con malla anti-zancudo (JPG)
│       ├── kit-emergencia.jpg   # Kit de emergencia familiar (JPG)
│       ├── bolsa-arena.jpg      # Bolsa de arena reutilizable de contención (JPG)
│       └── caja-impermeable.jpg # Caja organizadora estanca para documentos (JPG)
├── metadata.json                # Metadatos del applet
└── README.md                    # Documentación técnica y guía de edición
```

---

## 🎨 Paleta Cromática Oficial

El diseño respeta estrictamente los colores definidos:
- **Azul petróleo (`#0F5D70`)**: Identidad visual principal, barras de navegación y botones destacados.
- **Turquesa (`#29A6A0`)**: Elementos destacados, insignias, detalles de interacción y bordes.
- **Gris muy claro (`#F4F7F8`)**: Fondo limpio de la página y tarjetas para alto contraste.
- **Amarillo cálido (`#F2B84B`)**: Alertas, acentos de llamada a la acción y avisos de prevención.

---

## 🚀 Cómo Ejecutar el Proyecto Localmente

### Opción 1: Visual Studio Code con Extensión Live Server (Recomendado para Vanilla JS)
1. Abre Visual Studio Code.
2. Abre la carpeta del proyecto (`File > Open Folder...`).
3. Instala la extensión **Live Server** (creada por *Ritwick Dey*) desde el panel de Extensiones (`Ctrl + Shift + X`).
4. Haz clic derecho sobre `index.html` y selecciona **"Open with Live Server"** (o presiona `Alt + L, Alt + O`).
5. La página se abrirá en tu navegador en `http://127.0.0.1:5500/index.html`.

### Opción 2: Con Node.js y Vite
```bash
npm install
npm run dev
```
Abre la URL indicada (usualmente `http://localhost:3000`).
