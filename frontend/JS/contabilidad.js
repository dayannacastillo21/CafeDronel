document.addEventListener('DOMContentLoaded', async function() {
 
    const user = JSON.parse(sessionStorage.getItem("user")) || { nombre: "Admin", rol: "contabilidad" };
    if (user.rol !== "contabilidad") {
        alert("No tienes permisos");
        window.location.href = "admin.html";
        return;
    }
    document.getElementById('user-name').textContent = user.nombre;
    
    let ventas = JSON.parse(localStorage.getItem('ventas')) || [];
    mostrarVentas(ventas);
    cargarResumenFinanciero();
    function mostrarVentas(ventasFiltradas) {
        const tabla = document.querySelector('#tabla-ventas tbody');
        tabla.innerHTML = '';
        let totalGeneral = 0;
        ventasFiltradas.forEach(v => {
            const total = v.total || (v.cantidad * v.precio) || 0;
            totalGeneral += total;
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${new Date(v.fecha).toLocaleDateString()}</td>
                <td>${v.producto}</td>
                <td>${v.cantidad || 1}</td>
                <td>S/ ${(v.precio || 0).toFixed(2)}</td>
                <td>S/ ${total.toFixed(2)}</td>
                <td>${v.vendedor || 'Sistema'}</td>
            `;
            tabla.appendChild(fila);
        });
        document.getElementById('total-general').textContent = totalGeneral.toFixed(2);
    }
    function cargarResumenFinanciero() {
        const hoy = new Date().toISOString().split('T')[0];
        const ventasHoy = ventas.filter(v => v.fecha.split('T')[0] === hoy);
        const totalIngresos = ventas.reduce((sum, v) => sum + (v.total || 0), 0);
        document.getElementById('total-ingresos').textContent = `S/ ${totalIngresos.toFixed(2)}`;
        document.getElementById('total-ventas').textContent = ventas.length;
        document.getElementById('ventas-hoy').textContent = ventasHoy.length;
    }
    window.aplicarFiltros = function() {
        const inicio = document.getElementById('fecha-inicio').value;
        const fin = document.getElementById('fecha-fin').value;
        let filtradas = ventas;
        if (inicio) filtradas = filtradas.filter(v => v.fecha >= inicio);
        if (fin) filtradas = filtradas.filter(v => v.fecha <= fin + 'T23:59:59');
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
});