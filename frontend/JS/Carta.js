let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const toast = new bootstrap.Toast(document.getElementById('toast-producto'));

document.addEventListener('DOMContentLoaded', function() {
    cargarProductos();
    actualizarCarrito();

    document.getElementById('vaciar-carrito').addEventListener('click', vaciarCarrito);
    document.getElementById('finalizar-compra').addEventListener('click', finalizarCompra);
});

// ---------- CARGA DE PRODUCTOS ----------
function cargarProductos() {
    const productos = [
        { id: 1, nombre: "Flat White", precio: 10.00, categoria: "cafe", descripcion: "Espresso con leche vaporizada, textura sedosa y fina espuma.", tamaño: "8 Oz", imagen: "../img/white.jpg", destacado: true },
        { id: 2, nombre: "Cappuccino Clásico", precio: 12.00, categoria: "cafe", descripcion: "Espresso balanceado con leche vaporizada y espuma cremosa.", tamaño: "12 Oz", imagen: "../img/cappuccino.jpg", destacado: false },
        { id: 3, nombre: "Latte Macchiato", precio: 14.00, categoria: "cafe", descripcion: "Leche vaporizada con un toque de espresso, en capas perfectas.", tamaño: "16 Oz", imagen: "../img/latte.jpg", destacado: true },
        { id: 4, nombre: "Mocha Especial", precio: 16.00, categoria: "cafe", descripcion: "Espresso con chocolate y leche vaporizada, coronado con crema.", tamaño: "12 Oz", imagen: "../img/mocha.jpg", destacado: false },
        { id: 5, nombre: "Cheesecake de Fresa", precio: 18.00, categoria: "postres", descripcion: "Delicioso cheesecake con salsa de fresa natural.", tamaño: "Porción individual", imagen: "../img/cheesecake.jpg", destacado: true },
        { id: 6, nombre: "Brownie con Helado", precio: 15.00, categoria: "postres", descripcion: "Brownie de chocolate servido con bola de helado de vainilla.", tamaño: "Porción individual", imagen: "../img/brownie.jpg", destacado: false },
        { id: 7, nombre: "Tiramisú Clásico", precio: 20.00, categoria: "postres", descripcion: "Postre italiano con café, cacao y queso mascarpone.", tamaño: "Porción individual", imagen: "../img/tiramisu.jpg", destacado: true },
        { id: 8, nombre: "Frappé de Vainilla", precio: 14.00, categoria: "bebidas", descripcion: "Bebida fría mezclada con hielo y esencia de vainilla.", tamaño: "16 Oz", imagen: "../img/frappe.jpg", destacado: false },
        { id: 9, nombre: "Limonada de Menta", precio: 10.00, categoria: "bebidas", descripcion: "Refrescante limonada con hojas de menta fresca.", tamaño: "500ml", imagen: "../img/limonada.jpg", destacado: true },
        { id: 10, nombre: "Smoothie de Frutos Rojos", precio: 16.00, categoria: "bebidas", descripcion: "Mezcla de frutos rojos con yogurt natural.", tamaño: "16 Oz", imagen: "../img/smoothie.jpg", destacado: false },
        { id: 11, nombre: "Club Sandwich", precio: 22.00, categoria: "sandwiches", descripcion: "Pollo, tocino, lechuga, tomate y mayonesa casera.", tamaño: "Triple capa", imagen: "../img/club.jpg", destacado: true },
        { id: 12, nombre: "Sandwich Vegano", precio: 18.00, categoria: "sandwiches", descripcion: "Vegetales frescos con hummus y aguacate.", tamaño: "Doble capa", imagen: "../img/vegano.jpg", destacado: false }
    ];
    mostrarProductos(productos);
}

// ---------- MOSTRAR PRODUCTOS ----------
function mostrarProductos(productos) {
    const productList = document.getElementById('productList');
    let html = '';

    productos.forEach(producto => {
        const precioClase = producto.precio <= 10 ? 'low' : producto.precio <= 20 ? 'medium' : 'high';
        html += `
            <div class="col ${producto.categoria} ${precioClase}">
                <div class="card h-100 text-center product-card">
                    ${producto.destacado ? '<div class="position-absolute top-0 start-0 m-3"><span class="badge bg-warning text-dark">Destacado</span></div>' : ''}
                    <div class="card-img-top p-4">
                        <img src="${producto.imagen}" class="mx-auto rounded-circle bg-white p-2" alt="${producto.nombre}" style="width:140px; height:140px; object-fit:cover;">
                    </div>
                    <div class="hover-overlay">
                        <button type="button" class="btn btn-warning add-to-cart" data-id="${producto.id}" data-name="${producto.nombre}" data-price="${producto.precio}">
                            <i class="bi bi-plus"></i>
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

    productList.innerHTML = html;

    // Agregar productos al carrito
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const nombre = this.getAttribute('data-name');
            const precio = parseFloat(this.getAttribute('data-price'));
            agregarAlCarrito(id, nombre, precio);
        });
    });
}

// ---------- CARRITO ----------
function agregarAlCarrito(id, nombre, precio) {
    const productoExistente = carrito.find(p => p.id === id);
    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({ id, nombre, precio, cantidad: 1 });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarNotificacion(`${nombre} añadido al carrito`);
    actualizarCarrito();

    const carritoOffcanvas = new bootstrap.Offcanvas(document.getElementById('carrito'));
    carritoOffcanvas.show();
}

function actualizarCarrito() {
    const lista = document.getElementById("lista-carrito");
    const totalSpan = document.getElementById("total");
    const cartCount = document.getElementById("cart-count");
    const carritoVacio = document.getElementById("carrito-vacio");
    const carritoContenido = document.getElementById("carrito-contenido");

    lista.innerHTML = "";
    let total = 0;

    if (carrito.length === 0) {
        carritoVacio.style.display = 'block';
        carritoContenido.style.display = 'none';
        totalSpan.textContent = "S/ 0.00";
    } else {
        carritoVacio.style.display = 'none';
        carritoContenido.style.display = 'block';
        
        carrito.forEach(producto => {
            const subtotal = producto.precio * producto.cantidad;
            total += subtotal;
            const item = document.createElement("li");
            item.className = "list-group-item";
            item.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${producto.nombre}</strong><br>
                        <small class="text-muted">S/ ${producto.precio.toFixed(2)} c/u</small>
                    </div>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-sm btn-outline-secondary cantidad-btn" data-action="decrease" data-id="${producto.id}">-</button>
                        <span class="mx-2">${producto.cantidad}</span>
                        <button class="btn btn-sm btn-outline-secondary cantidad-btn" data-action="increase" data-id="${producto.id}">+</button>
                        <button class="btn btn-sm btn-danger ms-2 eliminar-btn" data-id="${producto.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="text-end mt-2">
                    <strong>Subtotal: S/ ${subtotal.toFixed(2)}</strong>
                </div>
            `;
            lista.appendChild(item);
        });

        totalSpan.textContent = "S/ " + total.toFixed(2);
    }

    cartCount.textContent = carrito.reduce((acc, p) => acc + p.cantidad, 0);

    document.querySelectorAll('.cantidad-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            const id = this.getAttribute('data-id');
            const producto = carrito.find(p => p.id == id);
            if (producto) {
                if (action === 'increase') actualizarCantidad(id, producto.cantidad + 1);
                else if (action === 'decrease') actualizarCantidad(id, producto.cantidad - 1);
            }
        });
    });

    document.querySelectorAll('.eliminar-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            eliminarProducto(this.getAttribute('data-id'));
        });
    });
}

function actualizarCantidad(id, nuevaCantidad) {
    if (nuevaCantidad <= 0) return eliminarProducto(id);
    const producto = carrito.find(p => p.id == id);
    if (producto) {
        producto.cantidad = nuevaCantidad;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarCarrito();
    }
}

function eliminarProducto(id) {
    carrito = carrito.filter(p => p.id != id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
    mostrarNotificacion('Producto eliminado del carrito');
}

function vaciarCarrito() {
    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
    mostrarNotificacion('Carrito vaciado');
}

// ---------- FINALIZAR COMPRA ----------
async function finalizarCompra() {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    const total = carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);

    // Estructura compatible con el backend (PedidoController)
    const pedido = {
        cliente: "Cliente web",
        total: total,
        detalles: carrito.map(p => ({
            cantidad: p.cantidad,
            precio: p.precio,
            subtotal: p.precio * p.cantidad,
            producto: { id: parseInt(p.id) }
        }))
    };

    try {
        console.log("Pedido que se enviará al backend:", JSON.stringify(pedido, null, 2)); // <-- para depurar
        const response = await fetch('http://localhost:8080/pedidos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pedido)
        });

        if (response.ok) {
            const data = await response.json();
            alert(`Compra registrada correctamente.\nTotal: S/ ${data.total.toFixed(2)}\nGracias por tu pedido.`);
            carrito = [];
            localStorage.setItem("carrito", JSON.stringify(carrito));
            actualizarCarrito();
        } else {
            console.error("Respuesta del servidor:", await response.text());
            alert('Error al guardar el pedido en la base de datos.');
        }
    } catch (error) {
        console.error('Error al finalizar la compra:', error);
        alert('Ocurrió un error al conectar con el servidor.');
    }
}

// ---------- TOAST ----------
function mostrarNotificacion(mensaje) {
    document.getElementById('toast-message').textContent = mensaje;
    toast.show();
}
