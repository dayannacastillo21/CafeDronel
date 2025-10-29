const API_URL = "http://localhost:8087/productos";

document.addEventListener("DOMContentLoaded", async () => {
    await cargarProductos();
});

// Cargar productos desde el backend
async function cargarProductos() {
    try {
        const response = await fetch(API_URL);
        const productos = await response.json();

        if (!Array.isArray(productos)) {
            console.error("Los datos recibidos no son un array:", productos);
            return;
        }

        renderProductos(productos);
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}

// Renderizar productos en la tabla
function renderProductos(productos) {
    const tbody = document.getElementById("productosTable");
    tbody.innerHTML = "";

    productos.forEach(prod => {
        tbody.innerHTML += `
            <tr>
                <td>#${prod.id}</td>
                <td>${prod.nombre}</td>
                <td>${prod.categoria}</td>
                <td>S/ ${prod.precio?.toFixed(2) || 0}</td>
                <td>
                    <div class="d-flex justify-content-center gap-2">
                        <button class="btn btn-sm btn-outline-secondary btn-editar" data-id="${prod.id}">
                            <i class="bi bi-pencil"></i> Editar
                        </button>
                        <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${prod.id}">
                            <i class="bi bi-trash"></i> Eliminar
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
}

function agregarEventosBotones() {
    const botonesEditar = document.querySelectorAll(".btn-editar");
    const botonesEliminar = document.querySelectorAll(".btn-eliminar");

    // Abrir modal de edición
    botonesEditar.forEach(btn => {
        btn.addEventListener("click", async () => {
    const id = btn.getAttribute("data-id");
    console.log("EDITAR producto ID:", id); 

    const response = await fetch(`${API_URL}/${id}`);
    const producto = await response.json();
    console.log("Producto cargado:", producto); 

    document.getElementById("idEditar").value = producto.id;
    document.getElementById("nombreEditar").value = producto.nombre;
    document.getElementById("descripcionEditar").value = producto.descripcion || "";
    document.getElementById("tamanoEditar").value = producto.tamano || "";
    document.getElementById("precioEditar").value = producto.precio || 0;
    document.getElementById("categoriaEditar").value = producto.categoria;

    const modalEditar = new bootstrap.Modal(document.getElementById("modalEditar"));
    modalEditar.show();
});
    });

    // Eliminar producto
    botonesEliminar.forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.getAttribute("data-id");
            if (confirm("¿Seguro que deseas eliminar este producto?")) {
                await fetch(`${API_URL}/${id}`, { method: "DELETE" });
                await cargarProductos(); 
            }
        });
    });
}

// Buscador de productos
const inputBuscar = document.getElementById("buscarProducto");
if (inputBuscar) {
    inputBuscar.addEventListener("input", () => {
        const filtro = inputBuscar.value.toLowerCase();
        const filas = document.querySelectorAll("#productosTable tr");

        filas.forEach(fila => {
            const nombre = fila.cells[1].textContent.toLowerCase();
            fila.style.display = nombre.includes(filtro) ? "" : "none";
        });
    });
}

// === ACTUALIZAR PRODUCTO ===
document.getElementById("actualizarProducto").addEventListener("click", async () => {
    const id = document.getElementById("idEditar").value;
    const productoActualizado = {
        nombre: document.getElementById("nombreEditar").value,
        descripcion: document.getElementById("descripcionEditar").value,
        tamaño: document.getElementById("tamanoEditar").value,
        precio: parseFloat(document.getElementById("precioEditar").value),
        categoria: document.getElementById("categoriaEditar").value
    };

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productoActualizado)
        });

        if (response.ok) {
            alert("Producto actualizado correctamente");
            const modal = bootstrap.Modal.getInstance(document.getElementById("modalEditar"));
            modal.hide();
            await cargarProductos();
        } else {
            alert("Error al actualizar el producto");
        }
    } catch (error) {
        console.error("Error al actualizar:", error);
        alert("No se pudo conectar con el servidor");
    }
});

document.getElementById("guardarProducto").addEventListener("click", async () => {
    const nombre = document.getElementById("nombreAgregar").value.trim();
    const precio = parseFloat(document.getElementById("precioAgregar").value);
    const categoria = document.getElementById("categoriaAgregar").value;
    
    const descripcion = document.getElementById("descripcionAgregar").value.trim();
    const tamano = document.getElementById("tamanoAgregar").value.trim();

    if (!nombre || isNaN(precio) || !categoria) {
        alert("Por favor, completa todos los campos obligatorios.");
        return;
    }

    const nuevoProducto = {
        nombre,
        precio,
        categoria,
        descripcion,
        tamano,
        stock: 0, 
        activo: 1 
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoProducto)
        });

        if (!response.ok) {
            throw new Error("Error al guardar el producto");
        }

        const productoCreado = await response.json();
        console.log("Producto agregado:", productoCreado);

        const modalAgregar = bootstrap.Modal.getInstance(document.getElementById("modalAgregar"));
        modalAgregar.hide();

        document.getElementById("formAgregar").reset();

        await cargarProductos();

    } catch (error) {
        console.error("Error al agregar producto:", error);
        alert("Hubo un problema al agregar el producto.");
    }
});

document.addEventListener("click", async (e) => {
    // --- EDITAR ---
    if (e.target.closest(".btn-editar")) {
        const btn = e.target.closest(".btn-editar");
        const id = btn.dataset.id;

        console.log("EDITAR producto ID:", id);

        try {
            const res = await fetch(`${API_URL}/${id}`);
            if (!res.ok) throw new Error(`Error al obtener producto ${id}`);
            const prod = await res.json();

            // Rellenar el formulario del modal
            document.getElementById("idEditar").value = prod.id;
            document.getElementById("nombreEditar").value = prod.nombre;
            document.getElementById("descripcionEditar").value = prod.descripcion || "";
            document.getElementById("tamanoEditar").value = prod.tamano || "";
            document.getElementById("precioEditar").value = prod.precio;
            document.getElementById("categoriaEditar").value = prod.categoria;

            // Mostrar el modal
            const modalEditar = new bootstrap.Modal(document.getElementById("modalEditar"));
            modalEditar.show();
        } catch (error) {
            console.error("Error al cargar producto:", error);
            alert("No se pudo cargar la información del producto.");
        }
    }

    // --- ELIMINAR ---
    if (e.target.closest(".btn-eliminar")) {
        const btn = e.target.closest(".btn-eliminar");
        const id = btn.dataset.id;

        if (confirm("¿Seguro que deseas eliminar este producto?")) {
            try {
                const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
                if (!res.ok) throw new Error("Error al eliminar");
                alert("Producto eliminado correctamente.");
                cargarProductos();
            } catch (error) {
                console.error("Error al eliminar producto:", error);
            }
        }
    }
});