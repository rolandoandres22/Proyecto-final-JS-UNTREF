//funcion para mostrar detalles en modal
export async function verModal (productId) {
    try {
        const response = await fetch(`https://68ba574d6aaf059a5b59f122.mockapi.io/api/v1/products/${productId}`);
        if (!response.ok) throw new Error("Producto no encontrado");
        const producto = await response.json();

        // Crear modal
        const modalHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <div class="modal-header">
                        <h2>${producto.name}</h2>
                    </div>
                    <div class="modal-body">
                        <div class="modal-body-content">
                            <div class="modal-image">
                                <img src="${producto.avatar}" alt="${producto.name}">
                            </div>
                            <div class="modal-info">
                                </br>
                                <span class="product-description"> <strong>Descripcion: </strong> ${producto.descript}</span>
                                <p></p>
                                <br><p><strong>Precio: </strong>$ ${producto.price}</p><br>
                                <p><strong>Unidades disponibles: </strong> ${producto.stock}</p><br>
                                <p><strong>Material: </strong> ${producto.material}</p>
                                <div class="quantity-controls">
                                <span class="quantity-label">Cantidad:</span>
                                <button class="quantity-btn" id="decrease-qty">-</button>
                                <span class="quantity-value" id="quantity">1</span>
                                <button class="quantity-btn" id="increase-qty">+</button>
                            </div>
                    
                            <p><strong>Total:</strong> $<span id="total-price">${producto.price}</span></p>
                    
                            <button class="add-to-cart" id="add-to-cart-btn">
                                <i class="fas fa-shopping-cart"></i> Agregar al carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML("beforeend", modalHTML);
        
        // Referencias a elementos del modal
        const quantityElement = document.getElementById("quantity");
        const totalPriceElement = document.getElementById("total-price");
        const decreaseBtn = document.getElementById("decrease-qty");
        const increaseBtn = document.getElementById("increase-qty");
        const addToCartBtn = document.getElementById("add-to-cart-btn");
        
        let quantity = 1;
        const price = producto.price;
        
        // Actualizar el precio total
        function updateTotal() {
            totalPriceElement.textContent = (price * quantity).toFixed(2);
            quantityElement.textContent = quantity;
        }
        
        // Event listeners para los botones de cantidad
        decreaseBtn.addEventListener("click", () => {
            if (quantity > 1) {
                quantity--;
                updateTotal();
            }
        });
        
        increaseBtn.addEventListener("click", () => {
            if (quantity < producto.stock) {
                quantity++;
                updateTotal();
            }
        });
        
        // Función para mostrar el mensaje de confirmación con dos botones
        function showConfirmationMessage(productName, productQuantity) {
            // Crear el overlay del mensaje de confirmación
            const confirmationHTML = `
                <div class="confirmation-overlay">
                    <div class="confirmation-content">
                        <h3>
                            <i class="fas fa-check-circle"></i>
                            ¡Producto agregado!
                        </h3>
                        <p>
                            Se agregó ${productQuantity} ${productName} al carrito
                        </p>
                        <div style="display: flex; gap: 15px; justify-content: center;">
                            <button id="continue-shopping" class="continue-shopping">
                                Seguir comprando
                            </button>
                            <button id="view-cart" class="view-cart">
                                Ver carrito
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // Insertar el mensaje en el body
            document.body.insertAdjacentHTML("beforeend", confirmationHTML);
            
            // Agregar event listeners a los botones
            document.getElementById("continue-shopping").addEventListener("click", () => {
                // Cerrar ambos modales (confirmación y producto)
                document.querySelector(".confirmation-overlay")?.remove();
                document.querySelector(".modal-overlay")?.remove();
            });
            
            document.getElementById("view-cart").addEventListener("click", () => {
                // Redireccionar a la página del carrito
                window.location.href = "./pages/carrito.html";
            });
            
            // Cerrar al hacer clic fuera del contenido
            document.querySelector(".confirmation-overlay").addEventListener("click", (e) => {
                if (e.target === document.querySelector(".confirmation-overlay")) {
                    document.querySelector(".confirmation-overlay")?.remove();
                    document.querySelector(".modal-overlay")?.remove();
                }
            });
        }

        // Función para mostrar mensaje de error de stock
        function showStockError(productName, maxAvailable) {
            const errorHTML = `
                <div class="confirmation-overlay">
                    <div class="confirmation-content">
                        <h3 style="color: #d9534f;">
                            <i class="fas fa-exclamation-circle"></i>
                            ¡No hay suficiente stock!
                        </h3>
                        <p>
                            No se puede agregar más de ${maxAvailable} unidades de ${productName} al carrito.
                        </p>
                        <button id="close-error" class="continue-shopping">
                            Entendido
                        </button>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML("beforeend", errorHTML);
            
            document.getElementById("close-error").addEventListener("click", () => {
                document.querySelector(".confirmation-overlay")?.remove();
            });
        }

        // escucha el click del boton agregar al carrito
        addToCartBtn.addEventListener("click", async () => {
            try {
                // Primero, obtener el carrito actual
                const carritoResponse = await fetch('https://68ba574d6aaf059a5b59f122.mockapi.io/api/v1/carrito');
                if (!carritoResponse.ok) throw new Error('Error al obtener el carrito');
                
                const carrito = await carritoResponse.json();
                
                // Buscar si el producto ya está en el carrito
                const productoEnCarrito = carrito.find(item => item.id_products == producto.id);
                
                let cantidadFinal = quantity;
                
                // Si el producto ya está en el carrito, sumar las cantidades
                if (productoEnCarrito) {
                    cantidadFinal += productoEnCarrito.cant;
                    
                    // Verificar si la cantidad final supera el stock disponible
                    if (cantidadFinal > producto.stock) {
                        showStockError(producto.name, producto.stock - productoEnCarrito.cant);
                        return;
                    }
                    
                    // Actualizar la cantidad en el carrito existente
                    const updateResponse = await fetch(`https://68ba574d6aaf059a5b59f122.mockapi.io/api/v1/carrito/${productoEnCarrito.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ cant: cantidadFinal })
                    });
                    
                    if (!updateResponse.ok) {
                        throw new Error('Error al actualizar el producto en el carrito');
                    }
                    
                    // Mostrar mensaje de confirmación
                    showConfirmationMessage(producto.name, quantity);
                    
                } else {
                    // Si el producto no está en el carrito, agregarlo como nuevo
                    // Preparar datos para enviar al endpoint
                    const cartData = {
                        id_products: producto.id,
                        cant: quantity,
                        name_product: producto.name,
                        price_product: parseFloat(price),
                        imagen: producto.avatar,
                        stock: producto.stock
                    };
                    
                    const response = await fetch('https://68ba574d6aaf059a5b59f122.mockapi.io/api/v1/carrito', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(cartData)
                    });
                    
                    if (!response.ok) {
                        throw new Error('Error al agregar producto al carrito');
                    }
                    
                    // Mostrar mensaje de confirmación
                    showConfirmationMessage(producto.name, quantity);
                }
                
            } catch (error) {
                console.error('Error:', error);
                alert('Error al conectar con el servidor');
            }
        });
        
        // Manejar cierre del modal
        document.querySelector(".close-modal").addEventListener("click", () => {
            document.querySelector(".modal-overlay").remove();
        });
        
        // Cerrar modal al hacer clic fuera del contenido
        document.querySelector(".modal-overlay").addEventListener("click", (e) => {
            if (e.target === document.querySelector(".modal-overlay")) {
                document.querySelector(".modal-overlay").remove();
            }
        });
        
    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo cargar el producto");
    }
}