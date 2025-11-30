const titulo = localStorage.getItem('anuncio_titulo');
const mensaje = localStorage.getItem('anuncio_mensaje');

if (titulo) {
  document.getElementById('anuncio-titulo').textContent = titulo;
}

if (mensaje) {
  
  if (/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(mensaje.trim())) {
    const img = document.getElementById('anuncio-img');
    if (img) {
      img.src = mensaje.trim();
      img.style.display = 'block';
    }
    document.getElementById('anuncio-mensaje').style.display = 'none';
  } else {
    document.getElementById('anuncio-mensaje').textContent = mensaje;
    document.getElementById('anuncio-mensaje').style.display = 'block';
    const img = document.getElementById('anuncio-img');
    if (img) img.style.display = 'none';
  }
}

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


const toastEl = document.getElementById('toast-producto');
const toast = new bootstrap.Toast(toastEl, { delay: 3000 });


document.querySelectorAll(".add-to-cart").forEach(boton => {
  boton.addEventListener("click", e => {
    e.preventDefault();
    
    const nombre = boton.getAttribute("data-name");
    const precio = parseFloat(boton.getAttribute("data-price"));

   
    const productoExistente = carrito.find(p => p.nombre === nombre);
    if (productoExistente) {
      productoExistente.cantidad++;
    } else {
      carrito.push({ nombre, precio, cantidad: 1 });
    }

   
    localStorage.setItem("carrito", JSON.stringify(carrito));

   
    document.getElementById('toast-message').textContent = `${nombre} añadido al carrito`;
    toast.show();

   
    const carritoOffcanvas = new bootstrap.Offcanvas(document.getElementById('carrito'));
    carritoOffcanvas.show();

    renderCarrito();
  });
});


function eliminarProducto(nombre) {
  carrito = carrito.filter(p => p.nombre !== nombre);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderCarrito();
  
 
  document.getElementById('toast-message').textContent = 'Producto eliminado del carrito';
  toast.show();
}


function actualizarCantidad(nombre, nuevaCantidad) {
  if (nuevaCantidad <= 0) {
    eliminarProducto(nombre);
    return;
  }
  
  const producto = carrito.find(p => p.nombre === nombre);
  if (producto) {
    producto.cantidad = nuevaCantidad;
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderCarrito();
  }
}

function renderCarrito() {
  const lista = document.getElementById("lista-carrito");
  const totalSpan = document.getElementById("total");
  lista.innerHTML = "";

  if (carrito.length === 0) {
    lista.innerHTML = `<li class="list-group-item text-center">Tu carrito está vacío</li>`;
    totalSpan.textContent = "S/ 0.00";
    document.getElementById('vaciar-carrito').style.display = 'none';
    document.getElementById('finalizar-compra').style.display = 'none';
  } else {
    let total = 0;
    carrito.forEach(p => {
      const item = document.createElement("li");
      item.className = "list-group-item";
      item.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <strong>${p.nombre}</strong><br>
            <small class="text-muted">S/ ${p.precio.toFixed(2)} c/u</small>
          </div>
          <div class="d-flex align-items-center">
            <button class="btn btn-sm btn-outline-secondary cantidad-btn" data-action="decrease" data-name="${p.nombre}">-</button>
            <span class="mx-2">${p.cantidad}</span>
            <button class="btn btn-sm btn-outline-secondary cantidad-btn" data-action="increase" data-name="${p.nombre}">+</button>
            <button class="btn btn-sm btn-danger ms-2 eliminar-btn" data-name="${p.nombre}">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
        <div class="text-end mt-2">
          <strong>Subtotal: S/ ${(p.precio * p.cantidad).toFixed(2)}</strong>
        </div>
      `;
      lista.appendChild(item);

      total += p.precio * p.cantidad;
    });

    totalSpan.textContent = "S/ " + total.toFixed(2);
    document.getElementById('vaciar-carrito').style.display = 'block';
    document.getElementById('finalizar-compra').style.display = 'block';
  }

  
  document.getElementById("cart-count").textContent =
    carrito.reduce((acc, p) => acc + p.cantidad, 0);

  
  document.querySelectorAll('.cantidad-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const action = this.getAttribute('data-action');
      const nombre = this.getAttribute('data-name');
      const producto = carrito.find(p => p.nombre === nombre);
      
      if (producto) {
        if (action === 'increase') {
          actualizarCantidad(nombre, producto.cantidad + 1);
        } else if (action === 'decrease') {
          actualizarCantidad(nombre, producto.cantidad - 1);
        }
      }
    });
  });

  document.querySelectorAll('.eliminar-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const nombre = this.getAttribute('data-name');
      eliminarProducto(nombre);
    });
  });
}


document.getElementById('vaciar-carrito').addEventListener('click', function() {
  carrito = [];
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderCarrito();
  document.getElementById('toast-message').textContent = 'Carrito vaciado';
  toast.show();
});


document.getElementById('finalizar-compra').addEventListener('click', function() {
  if (carrito.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }
  
  alert('¡Compra finalizada! Gracias por tu pedido.');
  carrito = [];
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderCarrito();
});


document.addEventListener('DOMContentLoaded', function() {
  renderCarrito();
});
