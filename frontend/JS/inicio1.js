
    const CoffeUtils = {
   
      getCart: function() {
        return JSON.parse(localStorage.getItem('carrito')) || [];
      },
      
      
      saveCart: function(carrito) {
        localStorage.setItem('carrito', JSON.stringify(carrito));
        this.updateCartCount();
      },
      
     
      clearCart: function() {
        localStorage.removeItem('carrito');
        this.updateCartCount();
      },
      
    
      updateCartCount: function() {
        const carrito = this.getCart();
        const totalItems = carrito.reduce((total, item) => total + item.quantity, 0);
        
        document.getElementById('cart-count').textContent = totalItems;
        document.querySelectorAll('.cart-count').forEach(el => {
          el.textContent = totalItems;
          el.style.display = totalItems > 0 ? 'inline' : 'none';
        });
      },
      
      
      showToast: function(message, type = 'success') {
        const toastEl = document.getElementById('toast-producto');
        const toastBody = document.getElementById('toast-message');
        
        
        const toastHeader = toastEl.querySelector('.toast-header');
        const icon = toastHeader.querySelector('i');
        
        switch(type) {
          case 'success':
            icon.className = 'bi bi-cart-check-fill text-success me-2';
            break;
          case 'warning':
            icon.className = 'bi bi-exclamation-triangle-fill text-warning me-2';
            break;
          case 'info':
            icon.className = 'bi bi-info-circle-fill text-info me-2';
            break;
          case 'error':
            icon.className = 'bi bi-x-circle-fill text-danger me-2';
            break;
        }
        
        toastBody.textContent = message;
        
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
      }
    };

    // Productos predefinidos
    const productosDestacados = [
      {
        id: 1,
        nombre: "Flat White",
        categoria: "Café",
        precio: 12.00,
        descripcion: "Espresso con leche vaporizada, textura sedosa y fina espuma",
        tamaño: "8 Oz",
        imagen: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
      },
      {
        id: 2,
        nombre: "Café Expresso",
        categoria: "Café",
        precio: 11.00,
        descripcion: "Intenso y aromático, preparado con granos seleccionados",
        tamaño: "6 Oz",
        destacado: true,
        imagen: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
      },
      {
        id: 3,
        nombre: "Cappuccino Clásico",
        categoria: "Café",
        precio: 13.50,
        descripcion: "Balance perfecto entre espresso, leche vaporizada y espuma",
        tamaño: "8 Oz",
        imagen: "https://images.unsplash.com/photo-1568649929103-28ffbefaca1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
      },
      {
        id: 4,
        nombre: "Brownie de Chocolate",
        categoria: "Postres",
        precio: 8.00,
        descripcion: "Húmedo y suave, hecho con cacao puro y trozos de chocolate",
        tamaño: "120 g",
        imagen: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
      },
      {
        id: 5,
        nombre: "Té Chai Latte",
        categoria: "Bebidas",
        precio: 10.00,
        descripcion: "Mezcla de especias aromáticas con leche vaporizada",
        tamaño: "12 Oz",
        imagen: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
      },
      {
        id: 6,
        nombre: "Sandwich Club",
        categoria: "Sandwiches",
        precio: 15.00,
        descripcion: "Pollo, tocino, lechuga, tomate y mayonesa casera",
        tamaño: "Porción completa",
        destacado: true,
        imagen: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
      }
    ];

    
    document.addEventListener('DOMContentLoaded', function () {
   
      cargarProductosDestacados();

      
      configurarEventos();

      
      verificarAnuncios();

      
      CoffeUtils.updateCartCount();
    });

  
    function cargarProductosDestacados() {
      const featuredContainer = document.getElementById('featured-products');

      try {
        let html = '';
        productosDestacados.forEach(producto => {
          html += `
            <div class="col">
              <div class="card h-100 text-center product-card">
                ${producto.destacado ? `
                  <div class="position-absolute top-0 start-0 m-3">
                    <span class="badge bg-warning text-dark">Destacado</span>
                  </div>
                ` : ''}
                
                <div class="card-img-top p-4">
                  <img src="${producto.imagen}" 
                       class="mx-auto rounded-circle bg-white p-2" 
                       alt="${producto.nombre}" 
                       style="width:140px; height:140px; object-fit:cover;" 
                       loading="lazy"
                       onerror="this.src='https://via.placeholder.com/140x140/3c2a21/ffffff?text=Café'">
                </div>

                <div class="hover-overlay">
                  <button type="button" class="btn btn-warning add-to-cart" 
                          data-id="${producto.id}" 
                          data-name="${producto.nombre}" 
                          data-price="${producto.precio}">
                    <i class="bi bi-plus"></i> Agregar
                  </button>
                </div>

                <div class="card-body">
                  <h5 class="card-title fs-4 text-gold">${producto.nombre}</h5>
                  <p class="card-text text-white-70">${producto.descripcion}</p>
                  <p class="card-text text-white-70">${producto.tamaño}</p>
                  <div class="d-flex justify-content-center align-items-center gap-3 mt-4">
                    <span class="h4 mb-0 text-gold">S/ ${producto.precio.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          `;
        });

        featuredContainer.innerHTML = html;

       
        document.querySelectorAll('.add-to-cart').forEach(btn => {
          btn.addEventListener('click', function () {
            const id = this.getAttribute('data-id');
            const nombre = this.getAttribute('data-name');
            const precio = parseFloat(this.getAttribute('data-price'));

            agregarAlCarrito({ id, nombre, precio });
            
           
            const carritoOffcanvas = new bootstrap.Offcanvas(document.getElementById('carrito'));
            carritoOffcanvas.show();
          });
        });

      } catch (error) {
        console.error('Error cargando productos:', error);
        featuredContainer.innerHTML = `
          <div class="col-12 text-center py-4">
            <i class="bi bi-exclamation-triangle display-1 text-warning"></i>
            <p class="text-white-70 mt-2">Error al cargar productos</p>
          </div>
        `;
      }
    }

   
    function configurarEventos() {
      // Formulario de login
      document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();
        handleLogin();
      });

      // Formulario de registro
      document.getElementById('registerForm').addEventListener('submit', function (e) {
        e.preventDefault();
        handleRegister();
      });

      // Carrito eventos
      document.getElementById('vaciar-carrito').addEventListener('click', function () {
        vaciarCarrito();
        CoffeUtils.showToast('Carrito vaciado', 'info');
        actualizarVistaCarrito();
      });

      document.getElementById('finalizar-compra').addEventListener('click', function () {
        finalizarCompra();
      });

      // Actualizar carrito cuando se abre
      document.getElementById('carrito').addEventListener('show.bs.offcanvas', function () {
        actualizarVistaCarrito();
      });
    }

    // Manejar login 
    function handleLogin() {
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;

      // Validación 
      if (email && password) {
        CoffeUtils.showToast('Inicio de sesión simulado correctamente', 'success');
        bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
        document.getElementById('loginForm').reset();
      } else {
        CoffeUtils.showToast('Por favor complete todos los campos', 'warning');
      }
    }

    // Manejar registro 
    function handleRegister() {
      const name = document.getElementById('registerName').value;
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;
      const confirm = document.getElementById('registerConfirm').value;

      // Validaciones
      if (password !== confirm) {
        CoffeUtils.showToast('Las contraseñas no coinciden', 'warning');
        return;
      }

      if (password.length < 6) {
        CoffeUtils.showToast('La contraseña debe tener al menos 6 caracteres', 'warning');
        return;
      }

      if (name && email && password) {
        CoffeUtils.showToast('Cuenta creada exitosamente', 'success');
        bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
        document.getElementById('registerForm').reset();
      }
    }

    // Funciones del carrito
    function agregarAlCarrito(producto) {
      const carrito = CoffeUtils.getCart();
      const productoExistente = carrito.find(item => item.id == producto.id);

      if (productoExistente) {
        productoExistente.quantity += 1;
      } else {
        producto.quantity = 1;
        carrito.push(producto);
      }

      CoffeUtils.saveCart(carrito);
      CoffeUtils.showToast(`${producto.nombre} añadido al carrito`, 'success');
    }

    function vaciarCarrito() {
      CoffeUtils.clearCart();
    }

    // Actualizar vista del carrito
    function actualizarVistaCarrito() {
      const carrito = CoffeUtils.getCart();
      const lista = document.getElementById('lista-carrito');
      const totalSpan = document.getElementById('total');
      const carritoVacio = document.getElementById('carrito-vacio');
      const carritoContenido = document.getElementById('carrito-contenido');

      if (carrito.length === 0) {
        carritoVacio.style.display = 'block';
        carritoContenido.style.display = 'none';
      } else {
        carritoVacio.style.display = 'none';
        carritoContenido.style.display = 'block';

        lista.innerHTML = '';
        let total = 0;

        carrito.forEach((item, index) => {
          const subtotal = item.precio * item.quantity;
          total += subtotal;

          const li = document.createElement('li');
          li.className = 'list-group-item';
          li.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
              <div class="flex-grow-1">
                <h6 class="mb-1">${item.nombre}</h6>
                <small class="text-muted">S/ ${item.precio.toFixed(2)} c/u</small>
                <div class="mt-2 d-flex align-items-center">
                  <button class="btn btn-sm btn-outline-secondary" onclick="actualizarCantidad(${index}, -1)">
                    <i class="bi bi-dash"></i>
                  </button>
                  <span class="mx-3">${item.quantity}</span>
                  <button class="btn btn-sm btn-outline-secondary" onclick="actualizarCantidad(${index}, 1)">
                    <i class="bi bi-plus"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger ms-2" onclick="eliminarDelCarrito(${index})">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
              <div class="text-end">
                <strong>S/ ${subtotal.toFixed(2)}</strong>
              </div>
            </div>
          `;
          lista.appendChild(li);
        });

        totalSpan.textContent = `S/ ${total.toFixed(2)}`;
      }
    }

    // Funciones del carrito
    function actualizarCantidad(index, cambio) {
      const carrito = CoffeUtils.getCart();
      carrito[index].quantity += cambio;

      if (carrito[index].quantity <= 0) {
        carrito.splice(index, 1);
        CoffeUtils.showToast('Producto eliminado', 'info');
      } else {
        CoffeUtils.showToast('Cantidad actualizada', 'success');
      }

      CoffeUtils.saveCart(carrito);
      actualizarVistaCarrito();
    }

    function eliminarDelCarrito(index) {
      const carrito = CoffeUtils.getCart();
      const productoNombre = carrito[index].nombre;
      carrito.splice(index, 1);

      CoffeUtils.saveCart(carrito);
      CoffeUtils.showToast(`${productoNombre} eliminado del carrito`, 'info');
      actualizarVistaCarrito();
    }

    function finalizarCompra() {
      const carrito = CoffeUtils.getCart();

      if (carrito.length === 0) {
        CoffeUtils.showToast('Tu carrito está vacío', 'warning');
        return;
      }

      
      CoffeUtils.showToast('¡Compra finalizada! Gracias por tu pedido.', 'success');
      CoffeUtils.clearCart();
      actualizarVistaCarrito();

      // Cerrar el carrito
      bootstrap.Offcanvas.getInstance(document.getElementById('carrito')).hide();
    }

   
    function verificarAnuncios() {
      const titulo = localStorage.getItem('anuncio_titulo');
      const mensaje = localStorage.getItem('anuncio_mensaje');

      if (titulo) {
        document.getElementById('anuncio-section').style.display = 'block';
        document.getElementById('anuncio-titulo').textContent = titulo;

        if (mensaje) {
         
          if (/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(mensaje.trim())) {
            document.getElementById('anuncio-img').src = mensaje.trim();
            document.getElementById('anuncio-img').style.display = 'block';
            document.getElementById('anuncio-mensaje').style.display = 'none';
          } else {
            document.getElementById('anuncio-mensaje').textContent = mensaje;
            document.getElementById('anuncio-mensaje').style.display = 'block';
            document.getElementById('anuncio-img').style.display = 'none';
          }
        }
      }
    }