document.addEventListener('DOMContentLoaded', async function() {
    const user = JSON.parse(sessionStorage.getItem("user")) || { nombre: "Admin", rol: "contabilidad" };
    if (user.rol !== "contabilidad") {
        // Si no es contabilidad dejamos que la página muestre, pero avisamos
        console.warn("Usuario sin rol contabilidad (mostrar datos si están disponibles)");
    }
    document.getElementById('user-name').textContent = user.nombre || 'Usuario';

    let ventas = [];

    async function cargarVentas() {
        try {
            const res = await fetch('http://localhost:8080/ventas');
            if (!res.ok) throw new Error('Error al obtener ventas');
            ventas = await res.json();
        } catch (err) {
            console.error('No se pudo cargar ventas desde API, usando localStorage si existe', err);
            ventas = JSON.parse(localStorage.getItem('ventas')) || [];
        }
        mostrarVentas(ventas);
        cargarResumenFinanciero();
    }

    function mostrarVentas(ventasFiltradas) {
        const tabla = document.querySelector('#tabla-ventas tbody') || document.querySelector('#tabla-ventas');
        if (!tabla) return;
        tabla.innerHTML = '';
        let totalGeneral = 0;
        ventasFiltradas.forEach(v => {
            const fecha = v.fechaVenta || v.fecha || v.fecha_venta || v.fechaVentaTimestamp || null;
            const total = (v.total != null) ? Number(v.total) : (v.subtotal || 0);
            totalGeneral += total;
            const fila = document.createElement('tr');
            const fechaStr = fecha ? new Date(fecha).toLocaleString() : (v.fechaVenta ? new Date(v.fechaVenta).toLocaleString() : '');
            fila.innerHTML = `
                <td>${fechaStr}</td>
                <td>${v.producto || 'Venta #' + (v.id || '')}</td>
                <td>${v.cantidad || 1}</td>
                <td>S/ ${(Number(v.precioUnitario || v.precio || 0)).toFixed(2)}</td>
                <td>S/ ${total.toFixed(2)}</td>
                <td>${v.usuarioId || v.vendedor || 'Sistema'}</td>
            `;
            tabla.appendChild(fila);
        });
        const totalGeneralElem = document.getElementById('total-general');
        if (totalGeneralElem) totalGeneralElem.textContent = totalGeneral.toFixed(2);
    }

    function cargarResumenFinanciero() {
        const hoyISO = new Date().toISOString().split('T')[0];
        const ventasHoy = ventas.filter(v => {
            const fecha = v.fechaVenta || v.fecha;
            if (!fecha) return false;
            return (new Date(fecha).toISOString().split('T')[0]) === hoyISO;
        });
        const totalIngresos = ventas.reduce((sum, v) => sum + (Number(v.total || 0)), 0);
        const totalIngresosElem = document.getElementById('total-ingresos');
        if (totalIngresosElem) totalIngresosElem.textContent = `S/ ${totalIngresos.toFixed(2)}`;
        const totalVentasElem = document.getElementById('total-ventas');
        if (totalVentasElem) totalVentasElem.textContent = ventas.length;
        const ventasHoyElem = document.getElementById('ventas-hoy');
        if (ventasHoyElem) ventasHoyElem.textContent = ventasHoy.length;
    }

    window.aplicarFiltros = function() {
        const inicio = document.getElementById('fecha-inicio').value;
        const fin = document.getElementById('fecha-fin').value;
        let filtradas = ventas;
        if (inicio) filtradas = filtradas.filter(v => (v.fechaVenta || v.fecha || '').startsWith(inicio));
        if (fin) filtradas = filtradas.filter(v => (v.fechaVenta || v.fecha || '').startsWith(fin));
        mostrarVentas(filtradas);
    }
    window.limpiarFiltros = function() {
        document.getElementById('fecha-inicio').value = '';
        document.getElementById('fecha-fin').value = '';
        mostrarVentas(ventas);
    }
    window.exportarReporte = function() {
        alert("Funcionalidad de exportación en desarrollo");
    }
    window.cerrarSesion = function() {
        sessionStorage.clear();
        window.location.href = "admin.html";
    }

    // Carga inicial
    cargarVentas();
});