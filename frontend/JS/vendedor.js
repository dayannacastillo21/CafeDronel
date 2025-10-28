const formVenta = document.getElementById("formVenta");
    const tablaVentas = document.getElementById("tablaVentas");

    formVenta.addEventListener("submit", function(e) {
      e.preventDefault();

      const producto = document.getElementById("producto").value;
      const cantidad = document.getElementById("cantidad").value;
      const monto = document.getElementById("monto").value;

      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${tablaVentas.rows.length + 1}</td>
        <td>${producto}</td>
        <td>${cantidad}</td>
        <td>S/ ${monto}</td>
        <td>${new Date().toLocaleDateString()}</td>
      `;
      tablaVentas.appendChild(fila);

      formVenta.reset();
    });

    function cerrarSesion() {
      window.location.href = "Admin.html";
    }