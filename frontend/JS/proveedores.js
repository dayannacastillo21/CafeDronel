const API_URL = "http://localhost:8080/proveedores";
const tabla = document.getElementById("tabla-proveedores");
const modalNuevoProveedor = new bootstrap.Modal(document.getElementById('modalNuevoProveedor'));
const btnNuevo = document.getElementById("btnNuevoProveedor");
const formNuevoProveedor = document.getElementById("formNuevoProveedor");
let editandoId = null;

document.addEventListener("DOMContentLoaded", cargarProveedores);

btnNuevo.addEventListener("click", () => {
    formNuevoProveedor.reset();
    editandoId = null;
    modalNuevoProveedor.show();
});

formNuevoProveedor.addEventListener("submit", async (e) => {
    e.preventDefault();
    const proveedor = {
        nombre: document.getElementById("nombre").value.trim(),
        telefono: document.getElementById("telefono").value.trim(),
        email: document.getElementById("email").value.trim(),
        direccion: document.getElementById("direccion").value.trim(),
        activo: parseInt(document.getElementById("activo").value)
    };
    try {
        let response;
        if (editandoId) {
            response = await fetch(`${API_URL}/${editandoId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(proveedor)
            });
        } else {
            response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(proveedor)
            });
        }
        if (response.ok) {
            modalNuevoProveedor.hide();
            formNuevoProveedor.reset();
            editandoId = null;
            cargarProveedores();
        } else {
            const msg = await response.text();
            alert("Error: " + msg);
        }
    } catch (error) {
        console.error(error);
        alert("Error al comunicarse con el servidor");
    }
});

async function cargarProveedores() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        let filas = "";
        data.forEach(p => {
            const estadoBadge = p.activo ? `<span class="badge bg-success">Activo</span>` : `<span class="badge bg-danger">Inactivo</span>`;
            filas += `
                <tr data-id="${p.id}">
                    <td>${p.nombre}</td>
                    <td>${p.telefono}</td>
                    <td>${p.email}</td>
                    <td>${p.direccion}</td>
                    <td>${estadoBadge}</td>
                    <td>
                        <button class="btn btn-sm btn-warning btn-editar">Editar</button>
                        <button class="btn btn-sm btn-danger btn-eliminar">Eliminar</button>
                    </td>
                </tr>
            `;
        });
        tabla.innerHTML = filas;
    } catch (error) {
        console.error("Error al cargar proveedores:", error);
    }
}

tabla.addEventListener("click", (e) => {
    const fila = e.target.closest("tr");
    if (!fila) return;
    const id = fila.getAttribute("data-id");

    if (e.target.classList.contains("btn-editar")) {
        editandoId = id;
        document.getElementById("nombre").value = fila.children[0].textContent;
        document.getElementById("telefono").value = fila.children[1].textContent;
        document.getElementById("email").value = fila.children[2].textContent;
        document.getElementById("direccion").value = fila.children[3].textContent;
        document.getElementById("activo").value = fila.children[4].textContent.includes("Activo") ? 1 : 0;
        modalNuevoProveedor.show();
    }

    if (e.target.classList.contains("btn-eliminar")) {
        if (confirm("¿Deseas eliminar este proveedor?")) {
            fetch(`${API_URL}/${id}`, { method: "DELETE" })
                .then(res => { if (res.ok) cargarProveedores(); else alert("Error al eliminar proveedor"); })
                .catch(err => console.error(err));
        }
    }
});
