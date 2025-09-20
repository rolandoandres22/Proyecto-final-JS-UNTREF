# Proyecto Final - E-commerce en JavaScript
Diplomatura UNTREF

Este proyecto consiste en el desarrollo de un sitio web de comercio electrónico (E-commerce) utilizando **HTML, CSS y JavaScript**.  
El objetivo es simular la experiencia de un carrito de compras, aplicando conceptos de **fetch, objetos, promesas y eventos**.

-------------------------------------------------------------------------------------------------------

##  Funcionalidades Implementadas

### 1. Diseño de Interfaz de Usuario (UI)
- **Página principal (`index.html`)**: Lista de productos cargados dinámicamente con nombre, imagen y precio.
- **Página de carrito (`carrito.html`)**: Muestra los productos agregados con su cantidad y precio total.
- **Página de pago (`payment.html`)**: Divide en dos secciones: resumen de compra y métodos de pago.
- **Estilos CSS (`styles.css`, `carrito.css`, `modal.css`, `payment.css`)**: Diseño atractivo y responsive.

    Archivos: `index.html`, `carrito.html`, `payment.html`

-------------------------------------------------------------------------------------------------------

### 2. Funcionalidades Básicas
- Agregar productos al carrito desde la página principal.  
- Ver cantidad de ítems y precio total en tiempo real.  
- Eliminar productos del carrito o actualizar su cantidad.  

    Implementación: `carrito.js`

-------------------------------------------------------------------------------------------------------

### 3. Implementación de AJAX y Fetch
- Se utiliza `fetch()` en `main.js` para traer los productos desde una API simulada (archivo/endpoint JSON).  
- El carrito se actualiza dinámicamente sin recargar la página.

    Implementación: `main.js`

------------------------------------------------------------------------------------------------------

### 4. Uso de Objetos
- Los productos y el carrito están modelados como objetos en JavaScript.  
- Se gestionan operaciones como agregar, eliminar, modificar y calcular el total.

    Implementación: `carrito.js`, `main.js`

------------------------------------------------------------------------------------------------------

### 5. Uso de Promesas
- `fetch()` retorna promesas que se resuelven para mostrar los productos.  
- Se manejan errores en caso de que los datos no carguen.

    Implementación: `main.js`

------------------------------------------------------------------------------------------------------

### 6. Eventos
- Eventos `click` para agregar productos al carrito.  
- Eventos en los botones de eliminar y actualizar cantidad.  
- Eventos en el proceso de pago para confirmar la compra.

    Implementación: `carrito.js`, `payment.js`, `modal.js`

------------------------------------------------------------------------------------------------------

### 7. Compra Simulada
- La página `payment.html` muestra los métodos de pago.  
- Al presionar **Pagar**, se simula la compra y se genera un mensaje de confirmación.

    Implementación: `payment.js`

------------------------------------------------------------------------------------------------------

### 8. Estilo y Diseño Responsivo
- Uso de **Flexbox** para adaptar las páginas.  
- Compatible con **PC, tablet y móvil**.  
- Uso de **Google Fonts** y **favicon** para mejorar la estética.  

    Archivos: `styles.css`, `carrito.css`, `modal.css`, `payment.css`.

------------------------------------------------------------------------------------------------------

##  Estructura del Proyecto

```
📂 proyecto-ecommerce
 ┣ 📂 css
 ┃ ┣ styles.css
 ┃ ┣ carrito.css
 ┃ ┣ modal.css
 ┃ ┗ payment.css
 ┣ 📂 img
 ┃ ┣ logo/
 ┃ ┗ iconos/
 ┣ 📂 js
 ┃ ┣ main.js
 ┃ ┣ carrito.js
 ┃ ┣ payment.js
 ┃ ┗ modal.js
 ┣ 📂 pages
 ┃ ┣ carrito.html
 ┃ ┗ payment.html
 ┣ index.html
 ┗ README.md
```

------------------------------------------------------------------------------------------------------

## Tecnologías Utilizadas
- **HTML5**
- **CSS3**
- **JavaScript**

------------------------------------------------------------------------------------------------------

## Autor
Rolando Palermo - Diplomatura UNTREF
