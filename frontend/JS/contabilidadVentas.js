document.addEventListener('DOMContentLoaded', function() {
  const ventasBody = document.getElementById('ventas-body');
  const modalEl = document.getElementById('modalNuevaVenta');
  const modal = new bootstrap.Modal(modalEl);
  const btnNueva = document.getElementById('btnNuevaVenta');
  const btnGuardar = document.getElementById('btnGuardarVenta');

  btnNueva.addEventListener('click', () => modal.show());

  async function cargarVentas() {
    try {
      const res = await fetch('http://localhost:8080/ventas');
      const data = await res.json();
      const lista = data || (data.value || []);
      renderVentas(Array.isArray(lista) ? lista : (lista.value || lista));
    } catch (err) {
      console.error('Error cargando ventas:', err);
    }
  }

  function renderVentas(list) {
    ventasBody.innerHTML = '';
    list.forEach(v => {
      const fecha = v.fechaVenta || v.fecha || '';
      const fechaStr = fecha ? new Date(fecha).toLocaleString() : '';
      const producto = v.producto || '-';
      const cantidad = v.cantidad != null ? v.cantidad : '-';
      const precio = (v.precioUnitario || v.precio || 0).toFixed ? (v.precioUnitario || v.precio || 0).toFixed(2) : (v.precioUnitario || v.precio || 0);
      const total = Number(v.total || (v.cantidad * v.precioUnitario) || 0).toFixed(2);
      const metodo = v.metodoPago || v.metodo || '-';
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${v.id || ''}</td>
        <td>${fechaStr}</td>
        <td>${producto}</td>
        <td>${cantidad}</td>
        <td class="fw-bold text-primary">S/ ${total}</td>
        <td>${metodo}</td>
        <td><button class="btn btn-sm btn-outline-secondary">Ver detalles</button></td>
      `;
      ventasBody.appendChild(fila);
    });
  }

  btnGuardar.addEventListener('click', async () => {
    const producto = document.getElementById('producto').value.trim();
    const cantidad = parseInt(document.getElementById('cantidad').value, 10);
    const precioUnitario = parseFloat(document.getElementById('precioUnitario').value);
    const metodoPago = document.getElementById('metodoPago').value;

    if (!producto || !cantidad || isNaN(precioUnitario)) {
      alert('Completa los campos correctamente');
      return;
    }

    const total = Number(cantidad * precioUnitario);
    const usuario = JSON.parse(sessionStorage.getItem('user')) || { user_id: 1 };
    const usuarioId = usuario.user_id || usuario.userId || usuario.id || 1;

    const body = {
      usuarioId: usuarioId,
      fechaVenta: new Date().toISOString(),
      total: total,
      estado: 'completado',
      metodoPago: metodoPago,
      producto: producto,
      cantidad: cantidad,
      precioUnitario: precioUnitario
    };

    try {
      const res = await fetch('http://localhost:8080/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Error al guardar venta');
      const data = await res.json();
      modal.hide();
      // limpiar formulario
      document.getElementById('formNuevaVenta').reset();
      // redirigir a contabilidad principal para ver el resumen, o recargar lista
      window.location.href = 'contabilidad.html';
    } catch (err) {
      console.error('Error guardando venta:', err);
      alert('No se pudo guardar la venta. Revisa la consola.');
    }
  });

  // carga inicial
  cargarVentas();
});
