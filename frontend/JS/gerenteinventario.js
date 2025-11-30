const table = document.getElementById("inventoryTable");
const formAgregar = document.getElementById("formAgregar");
const formEditar = document.getElementById("formEditar");

const BASE_URL = "http://localhost:8080/api/inventario";

document.addEventListener("DOMContentLoaded", cargarProductos);

async function cargarProductos() {
  try {
    const res = await fetch(`${BASE_URL}/listar`);
    const result = await res.json();
    if (result.success) renderTable(result.data);
    else alert("Error al cargar: " + result.message);
  } catch (error) {
    console.error(error);
    alert("Error al conectar con el backend");
  }
}

function renderTable(productos) {
  table.innerHTML = "";
  productos.forEach(p => {
    table.innerHTML += `
      <tr data-id="${p.id}" data-nombre="${p.nombreInsumo}" data-cantidad="${p.cantidad}" data-unidad="${p.unidad}" data-minimo="${p.stockMinimo}" data-precio="${p.precioUnitario}" data-proveedor="${p.proveedor}">
        <td>${p.id}</td>
        <td>${p.nombreInsumo}</td>
        <td>${p.cantidad}</td>
        <td>${p.unidad}</td>
        <td>${p.stockMinimo}</td>
        <td>${p.precioUnitario}</td>
        <td>${p.proveedor}</td>
        <td>${p.fechaActualizacion ? new Date(p.fechaActualizacion).toLocaleString() : ""}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary me-2" onclick="editarProducto(${p.id})"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-outline-danger" onclick="eliminarProducto(${p.id})"><i class="bi bi-trash"></i></button>
        </td>
      </tr>`;
  });

  document.getElementById("totalProductos").textContent = productos.length;
  document.getElementById("stockBajo").textContent = productos.filter(p => p.cantidad < p.stockMinimo && p.cantidad > 0).length;
  document.getElementById("stockCritico").textContent = productos.filter(p => p.cantidad === 0).length;
}

// Agregar producto
formAgregar.addEventListener("submit", async e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(formAgregar).entries());
  data.cantidad = parseInt(data.cantidad);
  data.stockMinimo = parseInt(data.stockMinimo);
  data.precioUnitario = parseFloat(data.precioUnitario);

  try {
    const res = await fetch(`${BASE_URL}/agregar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.success) {
      cargarProductos();
      formAgregar.reset();
      bootstrap.Modal.getInstance(document.getElementById("modalAgregar")).hide();
    } else alert("Error: " + result.message);
  } catch (error) {
    console.error(error);
    alert("Error al agregar producto");
  }
});

// Editar producto
function editarProducto(id) {
  const row = [...document.querySelectorAll("#inventoryTable tr")].find(r => r.dataset.id == id);
  if (!row) return;

  document.getElementById("editId").value = row.dataset.id;
  document.getElementById("editNombre").value = row.dataset.nombre;
  document.getElementById("editCantidad").value = row.dataset.cantidad;
  document.getElementById("editUnidad").value = row.dataset.unidad;
  document.getElementById("editMinimo").value = row.dataset.minimo;
  document.getElementById("editPrecio").value = row.dataset.precio;
  document.getElementById("editProveedor").value = row.dataset.proveedor;

  new bootstrap.Modal(document.getElementById("modalEditar")).show();
}

// Guardar cambios de edición
formEditar.addEventListener("submit", async e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(formEditar).entries());
  data.cantidad = parseInt(data.cantidad);
  data.stockMinimo = parseInt(data.stockMinimo);
  data.precioUnitario = parseFloat(data.precioUnitario);

  try {
    const res = await fetch(`${BASE_URL}/editar/${data.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.success) {
      cargarProductos();
      bootstrap.Modal.getInstance(document.getElementById("modalEditar")).hide();
    } else alert("Error: " + result.message);
  } catch (error) {
    console.error(error);
    alert("Error al editar producto");
  }
});

// Eliminar producto
async function eliminarProducto(id) {
  if (!confirm("¿Eliminar producto?")) return;
  try {
    const res = await fetch(`${BASE_URL}/eliminar/${id}`, { method: "DELETE" });
    const result = await res.json();
    if (result.success) cargarProductos();
    else alert("Error: " + result.message);
  } catch (error) {
    console.error(error);
    alert("Error al eliminar producto");
  }
}

// Buscar
document.getElementById("searchInput").addEventListener("input", function() {
  const search = this.value.toLowerCase();
  const rows = document.querySelectorAll("#inventoryTable tr");
  rows.forEach(row => row.style.display = row.textContent.toLowerCase().includes(search) ? "" : "none");
});
