document.addEventListener("DOMContentLoaded", function() {
  const URLbase = "https://68ba574d6aaf059a5b59f122.mockapi.io/api/v1/";
  const content = document.getElementById("content");
  const totalprice = document.getElementById("totalprice");
  const footer = document.querySelector("footer");

  // modal de confirmación para actualizaciones
  function verModal(mensaje) {
    const overlay = document.createElement("div");
    overlay.classList.add("confirmation-overlay");

    overlay.innerHTML = `
      <div class="confirmation-content">
        <h3><i class="fas fa-check-circle"></i> ${mensaje}</h3>
        <img class="like" src="../img/iconos/like.png" alt=""> 
      </div>
    `;

    document.body.appendChild(overlay);

    setTimeout(() => {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
    }, 2000);
  }

  // modal de confirmación para eliminar
  function confirmarEliminacion(producto, idProducto) {
    const overlay = document.createElement("div");
    overlay.classList.add("confirmation-overlay");

    overlay.innerHTML = `
      <div class="confirmation-content">
        <h3><i class="fas fa-exclamation-triangle"></i> ¿Eliminar producto?</h3>
        <p>¿Seguro que deseas eliminar <strong>${producto}</strong> del carrito?</p>
        <button class="cancelar-btn">Cancelar</button>
        <button class="eliminar-btn">SI, ELIMINAR</button>
      </div>
    `;

    document.body.appendChild(overlay);

    // boton cancelar hace que se cierre el modal
    overlay.querySelector(".cancelar-btn").addEventListener("click", () => {
      document.body.removeChild(overlay);
    });

    // boton eliminar manda la orden de eliminar del carrito
    overlay.querySelector(".eliminar-btn").addEventListener("click", async () => {
      try {
        await fetch(URLbase + "carrito/" + idProducto, { method: "DELETE" });
        fetchAllcart();
      } catch (err) {
        console.error(err);
      }
      document.body.removeChild(overlay);
    });
  }

  // Función para mostrar mensaje de carrito vacío
  function mostrarCarritoVacio() {
    content.innerHTML = `
      <div class="empty-cart-message">
        <p>🛒 Tu carrito está vacío</p>
        <a href="../index.html">Volver a la tienda</a>
      </div>
    `;
    
    // Ocultar el footer con el total y botón de pago
    if (footer) {
      footer.style.display = "none";
    }
  }

  async function fetchAllcart() {
    try {
      const cart = await fetch(URLbase + 'carrito');
      if (!cart.ok) throw new Error("Error al cargar carrito"); 

      const carrito = await cart.json();
      content.innerHTML = ''; // limpieza

      // Verificar si el carrito está vacío
      if (carrito.length === 0) {
        mostrarCarritoVacio();
        return;
      }

      // Mostrar el footer si hay productos
      if (footer) {
        footer.style.display = "flex";
      }

      carrito.forEach(carrito => {
        const productHTML = `
          <div class="carrito-card" data-id="${carrito.id}">
            <img class="cart-img" src="${carrito.imagen}" alt="">
            <span class="quantity-label">${carrito.name_product}</span>

            <div class="quantity-controls2">
              <span class="quantity-label2">Cantidad:</span>
              <button class="quantity-btn2 decrease" data-id="${carrito.id}">-</button>
              <span class="quantity-value2" id="quantity2-${carrito.id}" data-id="${carrito.id}">${carrito.cant}</span>
              <button class="quantity-btn2 increase" data-id="${carrito.id}">+</button>
              <button class="btn-actualizar" data-id="${carrito.id}">
                <img class="act-ico" src="../img/iconos/refresh_157948.png" alt=""><span class="btn-carrito">Actualizar</span>
              </button>
            </div>
            <p><strong>Total:</strong> $<span id="total-price2-${carrito.id}">${(carrito.price_product * carrito.cant).toFixed(2)}</span></p>
            <button class="btn-eliminar" data-id="${carrito.id}">
              <img class="act-ico" src="../img/iconos/trash_919122.png" alt=""><span class="btn-carrito">Eliminar</span>
            </button>
          </div>
        `;

        content.insertAdjacentHTML("beforeend", productHTML);

        const productCard = content.lastElementChild;
        const quantityElement2 = productCard.querySelector(`#quantity2-${carrito.id}`);
        const totalPriceElement2 = productCard.querySelector(`#total-price2-${carrito.id}`);
        const decreaseBtn2 = productCard.querySelector(".decrease");
        const increaseBtn2 = productCard.querySelector(".increase");
        const updateBtn = productCard.querySelector(".btn-actualizar");
        const deleteBtn = productCard.querySelector(".btn-eliminar");

        let quantity = carrito.cant;
        const price = carrito.price_product;
        const stock = carrito.stock;

        // funcion de actualizar subtotal
        function updateTotal2() {
          totalPriceElement2.textContent = (price * quantity).toFixed(2);
          quantityElement2.textContent = quantity;
          updateCartTotal();
        }

        // escucha el boton cantidad - y actualiza con la funcion 
        decreaseBtn2.addEventListener("click", () => {
          if (quantity > 1) {
            quantity--;
            updateTotal2();
          }
        });
        // escucha el boton cantidad + y actualiza con la funcion 
        increaseBtn2.addEventListener("click", () => {
          if (quantity < stock) {
            quantity++;
            updateTotal2();
          }
        });

        // boton actualizar cantidad 
        updateBtn.addEventListener("click", async () => {
          const nuevaCantidad = parseInt(quantityElement2.textContent);

          if (nuevaCantidad === carrito.cant) return; //si la cantidad no cambia no hace nada

          try { //si la cantidad es distinta se agrego o quito se actualiza con put
            const res = await fetch(URLbase + "carrito/" + carrito.id, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ cant: nuevaCantidad }),
            });

            if (!res.ok) throw new Error("Error al actualizar producto");

            verModal("Producto actualizado con éxito");

            fetchAllcart();
          } catch (err) {
            console.error(err);
          }
        });

        // boton eliminar al apretarlo abre modal confirmación
        deleteBtn.addEventListener("click", () => {
          confirmarEliminacion(carrito.name_product, carrito.id);
        });
      });

      updateCartTotal();

    } catch (error) {
      console.error(error.message);
      content.innerHTML = `
        <div class="error-message">
          <p>❌ Error al cargar el carrito</p>
        </div>
      `;
    }
  }

  // total general
  function updateCartTotal() {
    let total = 0;
    document.querySelectorAll(".carrito-card").forEach(card => {
      const subtotal = parseFloat(card.querySelector("span[id^='total-price2']").textContent);
      total += subtotal;
    });
    totalprice.textContent = total.toFixed(2);
  }

  fetchAllcart();
});