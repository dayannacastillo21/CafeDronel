function mostrarTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector(`.tab-btn[onclick="mostrarTab('${tab}')"]`).classList.add('active');
  document.getElementById(`tab-${tab}`).classList.add('active');
}

function registrarVenta() {
  alert("Venta registrada");
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

function cerrarSesion() {
  window.location.href = "Admin.html";
}

document.addEventListener('DOMContentLoaded', listarUsuarios);
