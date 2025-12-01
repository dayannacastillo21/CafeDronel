document.addEventListener('DOMContentLoaded', async function() {
  async function cargarInventario() {
    try {
      // Intentamos endpoint simple primero
      let res = await fetch('http://localhost:8080/api/inventario');
      if (!res.ok) {
        // fallback a /listar
        res = await fetch('http://localhost:8080/api/inventario/listar');
      }
      const data = await res.json();
      let lista = [];
      if (Array.isArray(data)) lista = data;
      else if (data && data.data) lista = data.data;
      renderInventario(lista);
    } catch (err) {
      console.error('Error cargando inventario:', err);
    }
  }

  function renderInventario(lista) {
    const tbody = document.getElementById('inventario-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    lista.forEach(item => {
      const estado = (item.cantidad != null && item.stockMinimo != null && item.cantidad <= item.stockMinimo) ?
        '<span class="text-danger fw-bold">Stock Bajo</span>' : '<span class="text-success fw-bold">En Stock</span>';
      // Mostrar unidades en abreviatura si es necesario
      const unidadRaw = item.unidad || '';
      const unidadMap = { 'Kilogramos': 'kg', 'Litros': 'lt', 'Unidades': 'uds', 'Paquetes': 'paq', 'kg': 'kg', 'lt':'lt', 'uds':'uds', 'paq':'paq' };
      const unidadDisplay = unidadMap[unidadRaw] || unidadRaw;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.nombreInsumo || item.nombre || ''}</td>
        <td>${item.cantidad != null ? item.cantidad : '-'}</td>
        <td>${unidadDisplay || '-'}</td>
        <td>${item.stockMinimo != null ? item.stockMinimo : '-'}</td>
        <td>${estado}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  async function cargarProveedores() {
    try {
      const res = await fetch('http://localhost:8080/proveedores');
      if (!res.ok) throw new Error('No se pudo obtener proveedores');
      const proveedores = await res.json();
      renderProveedores(proveedores);
    } catch (err) {
      console.error('Error cargando proveedores:', err);
    }
  }

  function renderProveedores(list) {
    const ul = document.getElementById('proveedores-list');
    if (!ul) return;
    ul.innerHTML = '';
    list.forEach(p => {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      const telefono = p.telefono || p.telefonoContacto || '';
      const email = p.email || p.correo || p.contacto || '';
      li.textContent = `${p.nombre || p.empresa || 'Proveedor'} ${telefono ? ' - ' + telefono : ''} ${email ? ' - ' + email : ''}`;
      ul.appendChild(li);
    });
  }

  // Carga inicial
  cargarInventario();
  cargarProveedores();
  // Manejar guardado de insumo
  const btnGuardar = document.getElementById('btn-guardar-insumo');
  if (btnGuardar) {
    btnGuardar.addEventListener('click', async () => {
      const nombre = (document.getElementById('input-nombre-insumo') || {}).value;
      const cantidad = parseInt((document.getElementById('input-cantidad') || {}).value, 10) || 0;
      const stockMinimo = parseInt((document.getElementById('input-stock-minimo') || {}).value, 10) || 0;
      const unidad = (document.getElementById('select-unidad') || {}).value || '';
      const precioUnitario = parseFloat((document.getElementById('input-precio-unitario') || {}).value) || 0;
      const proveedor = (document.getElementById('proveedores-list') && document.getElementById('proveedores-list').firstChild) ? document.getElementById('proveedores-list').firstChild.textContent : '';

      if (!nombre) {
        alert('Ingresa el nombre del insumo');
        return;
      }

      // Mapear unidad a abreviatura antes de enviar
      const unidadMapEnviar = { 'Kilogramos': 'kg', 'Litros': 'lt', 'Unidades': 'uds', 'Paquetes': 'paq' };
      const unidadEnviar = unidadMapEnviar[unidad] || unidad;

      // Primero comprobamos si ya existe un insumo con ese nombre (case-insensitive)
      try {
        const resList = await fetch('http://localhost:8080/api/inventario');
        let listaResp = [];
        if (resList.ok) listaResp = await resList.json();
        else {
          const resList2 = await fetch('http://localhost:8080/api/inventario/listar');
          const dataAlt = await resList2.json();
          listaResp = dataAlt && dataAlt.data ? dataAlt.data : [];
        }

        const existente = (listaResp || []).find(it => (it.nombreInsumo || it.nombre || '').toLowerCase() === nombre.toLowerCase());
        const body = {
          nombreInsumo: nombre,
          cantidad: cantidad,
          unidad: unidadEnviar,
          stockMinimo: stockMinimo,
          precioUnitario: precioUnitario,
          proveedor: proveedor
        };

        if (existente && existente.id) {
          // Actualizar via PUT
          const resPut = await fetch(`http://localhost:8080/api/inventario/editar/${existente.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });
          const data = await resPut.json();
          if (data && data.success === false) {
            alert('Error actualizando insumo: ' + (data.message || ''));
            return;
          }
          alert('Insumo actualizado correctamente');
        } else {
          // Crear nuevo
          const res = await fetch('http://localhost:8080/api/inventario/agregar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });
          const data = await res.json();
          if (data && data.success === false) {
            alert('Error guardando insumo: ' + (data.message || ''));
            return;
          }
          alert('Insumo agregado correctamente');
        }

        // limpiar campos
        document.getElementById('input-nombre-insumo').value = '';
        document.getElementById('input-cantidad').value = '';
        document.getElementById('input-stock-minimo').value = '';
        document.getElementById('input-precio-unitario').value = '';
        // recargar tabla
        cargarInventario();
      } catch (err) {
        console.error('Error guardando/actualizando insumo:', err);
        alert('No se pudo guardar/actualizar el insumo. Revisa la consola.');
      }
    });
  }
});
