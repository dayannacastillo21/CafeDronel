// ==========================
//   Cargar Reportes al entrar
// ==========================
document.addEventListener("DOMContentLoaded", () => {
    cargarVentasPorMes();
    cargarVentasPorCategoria();
    cargarTopProductos();
});

// ==========================
//  1. VENTAS POR MES
// ==========================
function cargarVentasPorMes() {
    fetch("http://localhost:8080/api/reportes/ventas")
        .then(res => res.json())
        .then(data => {
            const meses = data.map(r => "Mes " + r.mes);
            const totales = data.map(r => r.total);

            new Chart(document.getElementById("ventasChart"), {
                type: "line",
                data: {
                    labels: meses,
                    datasets: [{
                        label: "Ventas por Mes",
                        data: totales,
                        borderWidth: 2
                    }]
                }
            });
        })
        .catch(error => console.error("Error cargando ventas:", error));
}


// ==========================
//  2. VENTAS POR CATEGORÍA
// ==========================
function cargarVentasPorCategoria() {
    fetch("http://localhost:8080/api/reportes/categorias")
        .then(res => res.json())
        .then(data => {

            const categorias = data.map(r => r.categoria);
            const totales = data.map(r => r.total);

            new Chart(document.getElementById("categoriasChart"), {
                type: "pie",
                data: {
                    labels: categorias,
                    datasets: [{
                        data: totales
                    }]
                }
            });
        })
        .catch(error => console.error("Error cargando categorías:", error));
}


// ==========================
//  3. TOP PRODUCTOS
// ==========================
function cargarTopProductos() {
    fetch("http://localhost:8080/api/reportes/top-productos")
        .then(res => res.json())
        .then(data => {

            const productos = data.map(r => r.producto);
            const cantidades = data.map(r => r.cantidad);

            new Chart(document.getElementById("topProductosChart"), {
                type: "bar",
                data: {
                    labels: productos,
                    datasets: [{
                        label: "Cantidad vendida",
                        data: cantidades,
                    }]
                }
            });
        })
        .catch(error => console.error("Error cargando top productos:", error));
}


// ==========================
//   EXPORTAR PDF (ya funciona)
// ==========================
function exportarPDF(idSeccion) {
    const elemento = document.getElementById(idSeccion);

    html2canvas(elemento).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jspdf.jsPDF("p", "mm", "a4");

        const imgWidth = 190;
        const imgHeight = canvas.height * imgWidth / canvas.width;

        pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        pdf.save("reporte-" + idSeccion + ".pdf");
    });
}
