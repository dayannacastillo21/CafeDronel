// Espera a que el HTML se cargue completamente
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("login-form");

  if (!form) {
    console.error("No se encontró el formulario con id='login-form'");
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Evita recargar la página

    // Obtiene los valores del formulario
    const email = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;

    // Validar que los campos no estén vacíos
    if (!email || !password) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    // Llamada al backend
    fetch("http://localhost:8080/api/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al conectar con el servidor.");
        }
        return response.json();
      })
      .then(data => {
        console.log("Respuesta del servidor:", data);

        const role = data.role?.toUpperCase(); // convierte el rol a mayúsculas

        switch (role) {
          case "GERENTE":
            window.location.href = "../Html/gerente.html";
            break;
          case "LOGISTICA":
            window.location.href = "../Html/logistica.html";
            break;
          case "CONTABILIDAD":
            window.location.href = "../Html/contabilidad.html";
            break;
          case "VENDEDOR":
            window.location.href = "../Html/vendedor.html";
            break;
          case "ADMIN":
            window.location.href = "../Html/Admin.html";
            break;
          default:
            alert("Rol no reconocido: " + data.role);
        }

      })
      .catch(error => {
        console.error("Error:", error);
        alert("No se pudo conectar con el servidor.");
      });
  });
});
