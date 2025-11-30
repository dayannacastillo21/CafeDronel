const table = document.getElementById("inventoryTable");
    const formAgregar = document.getElementById("formAgregar");
    const formEditar = document.getElementById("formEditar");

    document.addEventListener("DOMContentLoaded", cargarProductos);

    async function cargarProductos() {
      const res = await fetch("listar_insumo.php");
      const result = await res.json();
      if (result.success) {
        renderTable(result.data);
      } else {
        alert("Error al cargar: " + result.message);
      }
    }

    function renderTable(productos) {
      table.innerHTML = "";
      productos.forEach(p => {
        let estado = "";
        if (p.cantidad == 0) estado = '<span class="badge badge-critico">Crítico</span>';
        else if (p.cantidad < p.stock_minimo) estado = '<span class="badge badge-bajo">Bajo</span>';
        else estado = '<span class="badge badge-ok">OK</span>';

        table.innerHTML += `
          <tr data-id="${p.id}" 
              data-nombre="${p.nombre_insumo}" 
              data-cantidad="${p.cantidad}" 
              data-unidad="${p.unidad}" 
              data-minimo="${p.stock_minimo}" 
              data-precio="${p.precio_unitario}" 
              data-proveedor="${p.proveedor}">
            <td>${p.id}</td>
            <td>${p.nombre_insumo}</td>
            <td>${p.cantidad}</td>
            <td>${p.unidad}</td>
            <td>${p.stock_minimo}</td>
            <td>${p.precio_unitario}</td>
            <td>${p.proveedor}</td>
            <td>${estado}</td>
            <td>${p.fecha_actualizacion}</td>
            <td>
              <button class="btn btn-sm btn-outline-primary me-2" onclick="editarProducto(${p.id})"><i class="bi bi-pencil"></i></button>
              <button class="btn btn-sm btn-outline-danger" onclick="eliminarProducto(${p.id})"><i class="bi bi-trash"></i></button>
            </td>
          </tr>`;
      });

      document.getElementById("totalProductos").textContent = productos.length;
      document.getElementById("stockBajo").textContent = productos.filter(p => p.cantidad < p.stock_minimo && p.cantidad > 0).length;
      document.getElementById("stockCritico").textContent = productos.filter(p => p.cantidad == 0).length;
    }

    // Guardar nuevo producto
    formAgregar.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(formAgregar).entries());
      const res = await fetch("insertar_insumo.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.success) {
        cargarProductos();
        formAgregar.reset();
        bootstrap.Modal.getInstance(document.getElementById("modalAgregar")).hide();
      } else {
        alert("Error: " + result.message);
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
    formEditar.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(formEditar).entries());
      const res = await fetch("editar_insumo.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.success) {
        cargarProductos();
        bootstrap.Modal.getInstance(document.getElementById("modalEditar")).hide();
      } else {
        alert("Error: " + result.message);
      }
    });

    // Eliminar producto
    async function eliminarProducto(id) {
      if (confirm("¿Eliminar producto?")) {
        const res = await fetch("eliminar_insumo.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id })
        });
        const result = await res.json();
        if (result.success) cargarProductos();
        else alert("Error: " + result.message);
      }
    }

    // Buscar productos
    document.getElementById("searchInput").addEventListener("input", function() {
      const search = this.value.toLowerCase();
      const rows = document.querySelectorAll("#inventoryTable tr");
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(search) ? "" : "none";
      });
    });