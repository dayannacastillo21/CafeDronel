const API_URL = "http://localhost:8080/productos";

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
                <td>${prod.stock || 0}</td>
                <td><span class="badge ${prod.activo === 1 ? "badge-brown" : "badge-secondary"}">${prod.activo === 1 ? "Activo" : "Inactivo"}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-secondary"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `;
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
