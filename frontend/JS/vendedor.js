document.addEventListener('DOMContentLoaded', async function() {
  async function cargarVentas() {
    try {
      const res = await fetch('http://localhost:8080/ventas');
      if (!res.ok) throw new Error('Error al obtener ventas');
      const ventas = await res.json();
      renderVentas(ventas);
    } catch (err) {
      console.error('Error cargando ventas:', err);
      // dejar la tabla vacía si hay fallo
    }
  }

  function renderVentas(ventas) {
    const tbody = document.getElementById('tablaVentas');
    if (!tbody) return;
    tbody.innerHTML = '';
    ventas.forEach(v => {
      const fecha = v.fechaVenta || v.fecha || null;
      const fechaStr = fecha ? new Date(fecha).toLocaleString() : '';
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${v.id || ''}</td>
        <td>${v.producto ? (v.producto.nombre || v.producto) : 'Venta #' + (v.id||'')}</td>
        <td>${v.cantidad || '-'}</td>
        <td>S/ ${Number(v.total || v.precio || 0).toFixed(2)}</td>
        <td>${fechaStr}</td>
      `;
      tbody.appendChild(fila);
    });
  }

  window.cerrarSesion = function() { window.location.href = 'Admin.html'; }

  cargarVentas();
});