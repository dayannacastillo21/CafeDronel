function mostrarTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector(`.tab-btn[onclick="mostrarTab('${tab}')"]`).classList.add('active');
  document.getElementById(`tab-${tab}`).classList.add('active');
}

function registrarVenta() {
  const producto = (document.getElementById('producto') || {}).value;
  const monto = parseFloat((document.getElementById('monto') || {}).value);
  const cantidad = parseInt((document.getElementById('cantidad') || {}).value, 10) || 1;

  if (!producto || isNaN(monto) || isNaN(cantidad) || cantidad <= 0) {
    alert('Por favor completa producto, monto y cantidad con valores válidos.');
    return;
  }

  const usuario = JSON.parse(sessionStorage.getItem('user')) || {};
  const usuarioId = usuario.user_id || usuario.userId || usuario.id || 1;
  const total = Number(monto * cantidad);

  const body = {
    usuarioId: usuarioId,
    fechaVenta: new Date().toISOString(),
    total: total,
    estado: 'completado',
    metodoPago: 'efectivo',
    producto: producto,
    cantidad: cantidad,
    precioUnitario: monto
  };

  fetch('http://localhost:8080/ventas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(data => {
      alert('Venta registrada correctamente.');
      // limpiar campos
      if (document.getElementById('producto')) document.getElementById('producto').value = '';
      if (document.getElementById('monto')) document.getElementById('monto').value = '';
      if (document.getElementById('cantidad')) document.getElementById('cantidad').value = 1;
      // actualizar vistas
      listarVentas();
      actualizarResumenGerente();
    })
    .catch(err => {
      console.error('Error al registrar venta:', err);
      alert('Ocurrió un error al registrar la venta. Revisa la consola.');
    });
}

function registrarUsuario() {
  const nombre = document.getElementById('usuario').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const rol = document.getElementById('rol').value;

  if (!nombre || !email || !password) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  fetch('http://localhost:8080/api/usuarios/registrar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: nombre,
      email: email,
      password: password,
      rol: rol
    })
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message);
    if (data.success) listarUsuarios();
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error al registrar el usuario.');
  });
}

function listarUsuarios() {
  fetch('http://localhost:8080/api/usuarios/listar')
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('tabla-usuarios');
      tbody.innerHTML = '';
      data.forEach(u => {
        const fila = `
          <tr>
            <td>${u.id}</td>
            <td>${u.nombre}</td>
            <td>${u.email}</td>
            <td>${u.rol}</td>
            <td>${u.activo ? 'Activo' : 'Inactivo'}</td>
          </tr>`;
        tbody.innerHTML += fila;
      });
    })
    .catch(err => console.error('Error al listar usuarios:', err));
}

function listarVentas() {
  fetch('http://localhost:8080/ventas')
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('tabla-ventas');
      if (!tbody) return;
      tbody.innerHTML = '';
      data.forEach(v => {
        const fecha = v.fechaVenta || v.fecha || '';
        const fechaStr = fecha ? new Date(fecha).toLocaleString() : '';
        const fila = `
          <tr>
            <td>${fechaStr}</td>
            <td>${v.producto ? (v.producto.nombre || v.producto) : 'Venta #' + (v.id||'')}</td>
            <td>${v.cantidad || '-'}</td>
            <td>S/ ${Number(v.total || v.precio || 0).toFixed(2)}</td>
            <td>S/ ${Number(v.total || 0).toFixed(2)}</td>
          </tr>`;
        tbody.innerHTML += fila;
      });
    })
    .catch(err => console.error('Error al listar ventas:', err));
}

// Calcula y muestra el monto de ventas de hoy y el total de productos
function actualizarResumenGerente() {
  // Ventas hoy
  fetch('http://localhost:8080/ventas')
    .then(res => res.json())
    .then(data => {
      const ventas = Array.isArray(data) ? data : (data.value || []);
      const hoyISO = new Date().toISOString().split('T')[0];
      const sumaHoy = ventas.reduce((sum, v) => {
        const fecha = v.fechaVenta || v.fecha || '';
        if (!fecha) return sum;
        const fechaISO = new Date(fecha).toISOString().split('T')[0];
        if (fechaISO === hoyISO) return sum + (Number(v.total || 0));
        return sum;
      }, 0);
      const ventasHoyElem = document.getElementById('ventas-hoy');
      if (ventasHoyElem) ventasHoyElem.textContent = `S/ ${sumaHoy.toFixed(2)}`;
    })
    .catch(err => console.error('Error al calcular ventas hoy:', err));

  // Total productos
  fetch('http://localhost:8080/productos')
    .then(res => res.json())
    .then(list => {
      const totalProductosElem = document.getElementById('total-productos');
      if (totalProductosElem) totalProductosElem.textContent = Array.isArray(list) ? list.length : (list.value ? list.value.length : 0);
    })
    .catch(err => console.error('Error al obtener productos:', err));
}

function cerrarSesion() {
  window.location.href = "Admin.html";
}

document.addEventListener('DOMContentLoaded', function() {
  listarUsuarios();
  listarVentas();
  actualizarResumenGerente();
});
