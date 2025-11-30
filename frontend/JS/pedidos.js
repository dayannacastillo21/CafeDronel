const API_URL = "http://localhost:8080/pedidos";

const statusMap = {
  pendiente: { label: "Pendiente", class: "badge-pendiente" },
  completado: { label: "Completado", class: "badge-completado" },
  cancelado: { label: "Cancelado", class: "badge-cancelado" }
};

document.addEventListener("DOMContentLoaded", async () => {
  await cargarPedidos();
});

async function cargarPedidos() {
  try {
    const response = await fetch(API_URL);
    const pedidos = await response.json();
    renderOrders(pedidos);
  } catch (error) {
    console.error("Error al cargar pedidos:", error);
  }
}

function renderOrders(ordersData) {
  const tbody = document.getElementById("ordersTable");
  tbody.innerHTML = "";

  ordersData.forEach(order => {
    const statusInfo = statusMap[order.estado?.toLowerCase()] || statusMap.pendiente;

    tbody.innerHTML += `
      <tr>
        <td class="fw-semibold">#${order.id}</td>
        <td>${new Date(order.fecha).toLocaleDateString()}</td>
        <td>${order.cliente}</td>
        <td>${order.detalles?.length || 0}</td>
        <td class="fw-bold">S/ ${order.total?.toFixed(2) || 0}</td>
        <td><span class="badge ${statusInfo.class}">${statusInfo.label}</span></td>
        <td>
          <button class="btn-icon text-primary" title="Ver detalles" onclick="verDetalles(${order.id})">
            <i class="bi bi-eye"></i>
          </button>
          ${order.estado === "pendiente" ? `
            <button class="btn-icon text-success" title="Aprobar" onclick="actualizarEstado(${order.id}, 'completado')">
              <i class="bi bi-check-circle"></i>
            </button>
            <button class="btn-icon text-danger" title="Cancelar" onclick="actualizarEstado(${order.id}, 'cancelado')">
              <i class="bi bi-x-circle"></i>
            </button>
          ` : ""}
        </td>
      </tr>
    `;
  });

  // Actualizar totales
  document.getElementById("totalPedidos").textContent = ordersData.length;
  document.getElementById("totalPendientes").textContent = ordersData.filter(o => o.estado === "pendiente").length;
  document.getElementById("totalCompletados").textContent = ordersData.filter(o => o.estado === "completado").length;
  document.getElementById("totalCancelados").textContent = ordersData.filter(o => o.estado === "cancelado").length;
}

async function actualizarEstado(id, nuevoEstado) {
  try {
    await fetch(`${API_URL}/${id}/estado?estado=${encodeURIComponent(nuevoEstado)}`, {
      method: "PUT"
    });
    await cargarPedidos();
  } catch (error) {
    console.error("Error al actualizar estado:", error);
  }
}

async function verDetalles(id) {
  try {
    const response = await fetch(`http://localhost:8080/detalle-pedido/${id}`);
    const detalles = await response.json();

    const tbody = document.getElementById("detallePedidoBody");
    tbody.innerHTML = "";

    let total = 0;

    detalles.forEach(detalle => {
      const subtotal = detalle.precio * detalle.cantidad;
      total += subtotal;
      tbody.innerHTML += `
        <tr>
          <td>${detalle.producto.nombre}</td>
          <td>${detalle.cantidad}</td>
          <td>S/ ${detalle.precio.toFixed(2)}</td>
          <td>S/ ${subtotal.toFixed(2)}</td>
        </tr>
      `;
    });

    document.getElementById("detallePedidoTotal").textContent = `Total: S/ ${total.toFixed(2)}`;

    const modal = new bootstrap.Modal(document.getElementById('detallePedidoModal'));
    modal.show();

  } catch (error) {
    console.error("Error al obtener detalles:", error);
  }
}

