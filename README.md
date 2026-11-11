# URBAN_DROP — Catálogo Social Streetwear (Fast-Commerce)

Aplicación de **Social Commerce / Fast-Commerce** diseñada bajo principios de **UX Mobile-First** y arquitectura **Zero-JS por defecto** en Astro con TypeScript estricto y Tailwind CSS.

---

## Arquitectura del Proyecto

```text
Catalogo_App/
├── public/
│   └── favicon.svg          # Identidad visual vectorial de URBAN_DROP
├── src/
│   ├── data/
│   │   └── products.ts      # Tipado estricto (TypeScript) y catálogo completo (8 prendas / 4 categorías)
│   ├── pages/
│   │   └── index.astro      # Página principal SSG de Astro con hidratación ligera y delegación de eventos
│   └── env.d.ts             # Declaraciones de tipos de Astro
├── dist/
│   └── index.html           # Compilado estático pre-renderizado listo para producción
├── index.html               # Versión standalone pre-renderizada para apertura directa en navegador
├── astro.config.mjs         # Configuración de Astro + integración Tailwind CSS
├── tailwind.config.mjs      # Tipografías (Plus Jakarta Sans & Space Grotesk) y tema
├── tsconfig.json            # Configuración TypeScript estricta
└── package.json             # Scripts y dependencias del proyecto
```

---

## Funcionalidades Desarrolladas y Principios UX

1. **Zero-JS & Velocidad Instantánea (Astro SSG)**:
   - Todas las tarjetas del catálogo se renderizan en el servidor/build como HTML puro (`CLS = 0`).
   - Optimización **LCP** con `loading="eager"` en la primera prenda del feed y `loading="lazy"` con `decoding="async"` en el resto.
2. **Catálogo Completo y Filtrado Inteligente**:
   - Cobertura completa de las 4 categorías de streetwear: **Hoodies**, **Pantalones**, **T-Shirts** y **Chaquetas** (8 prendas curadas con fotografías múltiples, fit, modelo de referencia, inventario restante y especificaciones de tejido).
   - Filtrado instantáneo combinado por **categorías con contador de piezas** y **buscador en tiempo real** (por nombre, corte `boxy`, `cargo`, `bomber`, gramaje GSM o tela), incluyendo estado vacío interactivo con botón de restablecimiento.
3. **UX Anti-Devolución (Medidas Exactas en cm)**:
   - Al seleccionar cualquier talla (`S`, `M`, `L`, `XL`) tanto en la tarjeta del feed como en el **Product Detail Sheet**, se muestran las medidas reales en centímetros (`Pecho/Cintura` y `Largo`).
   - Tabla comparativa interactiva de todas las tallas dentro del modal de detalles junto con la referencia de altura y talla del modelo en foto.
4. **Carrusel Táctil con Gestos Mobile-First (Ley de Jakob & Ley de Fitts)**:
   - Indicadores superiores estilo **Instagram Stories** sincronizados entre la tarjeta y la galería de alta resolución del modal.
   - Soporte de **gestos táctiles (`swipe` horizontal)** en dispositivos móviles y navegación por teclado (`ArrowLeft` / `ArrowRight` / `Escape`).
   - Áreas táctiles mínimas de `44x44px` ubicadas en la zona natural del pulgar.
5. **Conversión Social sin Fricción (Ley de Hick)**:
   - Redirección directa a **WhatsApp** e **Instagram DM** con mensaje pre-estructurado que incluye nombre de la prenda, precio, talla elegida y medidas en cm.
   - **Confirmador rápido de talla** integrado en el modal de conversión social y **copiado automático al portapapeles** para pegar directamente en Instagram DM.
   - **Bolsa de Selección Drop (Pedido Múltiple)**: permite guardar varias prendas con sus respectivas tallas y enviar un pedido consolidado por WhatsApp en un solo toque.

---

## Ejecución y Uso

### Opción 1: Apertura Directa (Sin servidor)
Puedes abrir directamente [`index.html`](./index.html) o [`dist/index.html`](./dist/index.html) en cualquier navegador moderno.

### Opción 2: Entorno de Desarrollo Astro
```bash
npm install
npm run dev
```
Para generar el compilado estático de producción:
```bash
npm run build
npm run preview
```
