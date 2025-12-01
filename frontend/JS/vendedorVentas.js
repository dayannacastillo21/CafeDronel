document.addEventListener('DOMContentLoaded', function() {
  const btnOpen = document.getElementById('btn-open-modal-venta');
  const modalEl = document.getElementById('modalRegistrarVenta');
  const modal = new bootstrap.Modal(modalEl);
  const btnGuardar = document.getElementById('btn-guardar-venta-vendedor');
  const ventasBody = document.getElementById('ventas-body-vendedor');

  async function cargarVentas() {
    try {
      const res = await fetch('http://localhost:8080/ventas');
      const data = await res.json();
      const lista = Array.isArray(data) ? data : (data.value || []);
      renderVentas(lista);
    } catch (err) {
      console.error('Error cargando ventas:', err);
    }
  }

  function renderVentas(list) {
    if (!ventasBody) return;
    ventasBody.innerHTML = '';
    list.forEach(v => {
      const fecha = v.fechaVenta || v.fecha || '';
      const fechaStr = fecha ? new Date(fecha).toLocaleString() : '';
      const producto = v.producto || '-';
      const cantidad = v.cantidad != null ? v.cantidad : '-';
      const total = Number(v.total || (v.cantidad * v.precioUnitario) || 0).toFixed(2);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${fechaStr}</td>
        <td>${producto}</td>
        <td>${cantidad}</td>
        <td>S/ ${total}</td>
      `;
      ventasBody.appendChild(tr);
    });
  }

  if (btnOpen) btnOpen.addEventListener('click', () => modal.show());

  if (btnGuardar) {
    btnGuardar.addEventListener('click', async () => {
      const producto = document.getElementById('vproducto').value.trim();
      const cantidad = parseInt(document.getElementById('vcantidad').value, 10) || 1;
      const precioUnitario = parseFloat(document.getElementById('vprecio').value) || 0;
      const metodoPago = document.getElementById('vmetodo').value || 'efectivo';

      if (!producto || isNaN(precioUnitario)) {
        alert('Completa los campos correctamente');
        return;
      }

      const usuario = JSON.parse(sessionStorage.getItem('user')) || { user_id: 1 };
      const usuarioId = usuario.user_id || usuario.userId || usuario.id || 1;
      const total = Number(cantidad * precioUnitario);

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
        document.getElementById('formRegistrarVenta').reset();
        // Añadir la fila nueva a la tabla localmente (y recargar desde backend por si acaso)
        cargarVentas();
        alert('Venta registrada correctamente');
      } catch (err) {
        console.error('Error registrando venta:', err);
        alert('No se pudo registrar la venta. Revisa la consola.');
      }
    });
  }

  cargarVentas();
});
