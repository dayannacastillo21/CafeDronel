document.addEventListener("DOMContentLoaded", () => {
  const tablaInsumos = document.querySelector("#tablaInsumos");
  const formInsumo = document.querySelector("#formInsumo");

  
  function cargarInsumos() {
    fetch("../php/getInsumos.php")
      .then(res => res.json())
      .then(data => {
        tablaInsumos.innerHTML = "";
        data.forEach(insumo => {
          const fila = `
            <tr>
              <td>${insumo.id}</td>
              <td>${insumo.nombre}</td>
              <td>${insumo.categoria}</td>
              <td>${insumo.cantidad}</td>
              <td>${insumo.proveedor}</td>
              <td>${insumo.fecha}</td>
              <td>
                <button class="btn btn-sm btn-outline-secondary"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
              </td>
            </tr>
          `;
          tablaInsumos.innerHTML += fila;
        });
      })
      .catch(err => console.error("Error cargando insumos:", err));
  }

 
  formInsumo.addEventListener("submit", e => {
    e.preventDefault();

    const formData = new FormData(formInsumo);

    fetch("../php/addInsumo.php", {
      method: "POST",
      body: formData
    })
      .then(res => res.text())
      .then(msg => {
        alert(msg);
        formInsumo.reset();
        cargarInsumos();
      })
      .catch(err => console.error("Error al añadir insumo:", err));
  });

  // Cargar al inicio
  cargarInsumos();
});
