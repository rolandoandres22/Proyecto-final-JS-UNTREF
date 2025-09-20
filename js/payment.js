document.addEventListener("DOMContentLoaded", function() {
  const URLbase = "https://68ba574d6aaf059a5b59f122.mockapi.io/api/v1/";
  const contentSummary = document.getElementById("content-summary");
  const contentPayment = document.getElementById("content-payment");
  const totalprice = document.getElementById("totalprice");
  const payButton = document.querySelector(".btn-finish");

  // Crear modal para el proceso de pago
  const paymentModal = document.createElement('div');
  paymentModal.id = 'payment-modal';
  paymentModal.className = 'modal';
  paymentModal.innerHTML = `
    <div class="modal-content2">
      <div class="modal-body" id="modal-body">
        <!-- Contenido dinámico del modal -->
      </div>
    </div>
  `;
  document.body.appendChild(paymentModal);

  // Variable para almacenar los items del carrito
  let cartItems = [];

  async function fetchAllcart() {
    try {
      const cart = await fetch(URLbase + 'carrito');
      if (!cart.ok) throw new Error("Error al cargar carrito"); 

      cartItems = await cart.json();
      contentSummary.innerHTML = ''; // limpieza

      // Si hay productos, renderizarlos
      cartItems.forEach(carrito => {
        const productHTML = `
          <div class="payment-card" data-id="${carrito.id}">
            <img class="cart-img" src="${carrito.imagen}" alt="">
            <span class="quantity-label">${carrito.name_product}</span>
              <span class="quantity-label2">Cantidad: ${carrito.cant}</span>
            <strong>Total:</strong> $<span id="total-price2-${carrito.id}">${(carrito.price_product * carrito.cant).toFixed(2)}</span>
          </div>
        `;

        contentSummary.insertAdjacentHTML("beforeend", productHTML);
      });
      
      updateCartTotal();

    } catch (error) {
      console.error(error.message);
      contentSummary.innerHTML = `
        <div class="error-message">
          <p>❌ Error al cargar el carrito</p>
        </div>
      `;
      payButton.disabled = true;
      payButton.textContent = "Error al cargar";
      payButton.style.backgroundColor = "#95a5a6";
    }
  }

  // total general
  function updateCartTotal() {
    let total = 0;
    document.querySelectorAll(".payment-card").forEach(card => {
      const subtotal = parseFloat(card.querySelector("span[id^='total-price2']").textContent);
      total += subtotal;
    });
    totalprice.textContent = total.toFixed(2);
  }

  // Función para vaciar el carrito
  async function clearCart() {
    try {
      // Eliminar cada item del carrito
      for (const item of cartItems) {
        const deleteResponse = await fetch(`${URLbase}carrito/${item.id}`, {
          method: 'DELETE'
        });
        
        if (!deleteResponse.ok) {
          console.error(`Error al eliminar item ${item.id}`);
        }
      }
      
      console.log("Carrito vaciado exitosamente");
    } catch (error) {
      console.error("Error al vaciar el carrito:", error);
    }
  }

  // Mostrar modal con contenido específico
  function showModal(content) {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = content;
    paymentModal.style.display = 'block';
    
    // Añadir event listeners a los botones después de insertar el contenido
    setTimeout(() => {
      const closeBtn = modalBody.querySelector('.modal-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', hideModal);
      }
      
      const retryBtn = modalBody.querySelector('.modal-retry-btn');
      if (retryBtn) {
        retryBtn.addEventListener('click', function() {
          hideModal();
        });
      }

      // Botón para aceptar y redirigir al index
      const acceptBtn = modalBody.querySelector('.modal-accept-btn');
      if (acceptBtn) {
        acceptBtn.addEventListener('click', async function() {
          await clearCart(); // Vaciar el carrito
          window.location.href = "../index.html"; // Redirigir al index
        });
      }
    }, 100);
  }

  // Ocultar modal
  function hideModal() {
    paymentModal.style.display = 'none';
  }

  // Renderizar métodos de pago
  function renderPaymentMethods() {
    contentPayment.innerHTML = `
      <h2>Selecciona un método de pago</h2>
      <form id="payment-form" class="payment-methods">
        <label>
          <input type="radio" name="payment" value="tarjeta" required>
          💳 Tarjeta de Crédito / Débito
        </label><br>
        
        <label>
          <input type="radio" name="payment" value="paypal">
          🅿️ PayPal
        </label><br>
        
        <label>
          <input type="radio" name="payment" value="transferencia">
          🏦 Transferencia Bancaria
        </label><br>
        
        <label>
          <input type="radio" name="payment" value="mercadopago">
          🛒 MercadoPago
        </label>
      </form>
    `;

    // Event listener para el botón de pago
    payButton.addEventListener("click", (event) => {
      event.preventDefault(); // evitamos que recargue la página
      
      const selected = document.querySelector("input[name='payment']:checked");//si hay alguno seleccionado

      if (!selected) {//si no hay metodo de pago seleccionado
        //creamos un modal avisando que hay que elegir uno
        showModal(`
          <div class="error-message">
            <div class="error-icon">⚠️</div>
            <h3>Método de pago requerido</h3>
            <p>Por favor, selecciona un método de pago antes de continuar.</p>
            <button class="modal-close-btn">Entendido</button>
          </div>
        `);
        return;
      }

      // Mostrar spinner en el modal
      showModal(`
        <div class="processing-message">
          <div class="spinner"></div>
          <p>Procesando pago con ${selected.value}...</p>
        </div>
      `);

      // Simular proceso de pago asincrónico con promesas
      simulatePayment(selected.value)
        .then(result => {
          // Mostrar confirmación en el mismo modal
          showModal(`
            <div class="success-message">
              <div class="success-icon">✓</div>
              <h3>¡Pago realizado con éxito!</h3>
              <p>Método: ${result.method}</p>
              <p>ID de transacción: ${result.transactionId}</p>
              <p>Fecha: ${new Date(result.timestamp).toLocaleString()}</p>
              <button class="modal-accept-btn">Aceptar</button>
            </div>
          `);
          
          console.log("Pago exitoso:", result);
        })
        .catch(error => {
          // Mostrar error en el mismo modal
          showModal(`
            <div class="error-message">
              <div class="error-icon">✗</div>
              <h3>Error en el pago</h3>
              <p>${error.message}</p>
              <button class="modal-close-btn">Reintentar mas tarde</button>
            </div>
          `);
          
          console.error("Error en el pago:", error);
        });
    });
  }

  // Función para simular el proceso de pago asincrónico
  function simulatePayment(paymentMethod) {
    return new Promise((resolve, reject) => {
      // Simular demora de red
      setTimeout(() => {
        // Simular éxito o error aleatoriamente (éxito en el 80% de los casos)
        const success = Math.random() > 0.2;
        
        if (success) {
          resolve({
            method: paymentMethod,
            transactionId: 'TRX-' + Math.floor(Math.random() * 1000000),
            timestamp: new Date().toISOString()
          });
        } else {
          reject(new Error('El procesador de pagos no respondió. Intente nuevamente.'));
        }
      }, 2000);
    });
  }

  // Cerrar modal al hacer clic fuera de él
  paymentModal.addEventListener('click', (e) => {
    if (e.target === paymentModal) {
      hideModal();
    }
  });

  // Inicializar
  fetchAllcart();
  renderPaymentMethods();
});