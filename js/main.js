import { verModal } from "./modal.js";//importamos la funcion vermodal
document.addEventListener("DOMContentLoaded", function() {

const URLbase = "https://68ba574d6aaf059a5b59f122.mockapi.io/api/v1/";//link de mokapi
const content = document.getElementById("content");

async function fetchAllProducts() {
try {//hay que envolverlo en un try-catch porque el await no tiene catch
   const products = await fetch(URLbase + 'products'); //va a devolver una promesa
    if(!products.ok) throw new Error(); //validamos si no hay nada en la respuesta da error
    const productos = await products.json(); //si todo sale bien guardamos la respuesta en la variable productos
    content.innerHTML = ''; // limpieza
    // recorremos con un foreach y generamos HTML para cada uno
        productos.forEach(producto => {
            //codigo html que muestra imagen, nombre, precio y boton para ver detalles
            const productHTML = `
                <div class="product-card" data-id = "${producto.id}">
                    <img src="${producto.avatar}" alt="${producto.name}">
                    <h3>${producto.name}</h3></br>
                    <p>Precio: $${producto.price}</p></br>
                    <button id="verproduct" class="verproduct">Ver el producto</button>
                </div>
            `;
            
            //agregamos el HTML del producto al content
            content.innerHTML += productHTML;
        });
        //agrego event listeners al boton de la card
                document.querySelectorAll(".verproduct").forEach(btn => {
                     btn.addEventListener("click", function() {//escucho el click del boton
                const productId = this.closest(".product-card").getAttribute("data-id");//capturo el id de esa card
                verModal(productId); //muestro el modal
            });
        });
} catch (error) {
    console.error(error.message) //que muestre por consola la propiedad message del error
}
}
// Llamamos a la función que nos muestra todas las card
fetchAllProducts();
});