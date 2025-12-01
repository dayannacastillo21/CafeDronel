/* ============================
      FUNCIÓN EXPORTAR PDF
============================= */
async function exportarPDF(seccionId) {
    const elemento = document.getElementById(seccionId);

    const canvas = await html2canvas(elemento);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`Reporte-${seccionId}.pdf`);
}

/* ============================
      GRÁFICOS DEMO
============================= */
new Chart(document.getElementById("ventasChart"), {
    type: "line",
    data: {
        labels: ["Ene", "Feb", "Mar", "Abr", "May"],
        datasets: [{
            label: "Ventas",
            data: [1200, 1800, 1400, 2200, 2600],
            borderWidth: 2
        }]
    }
});

new Chart(document.getElementById("categoriasChart"), {
    type: "pie",
    data: {
        labels: ["Café", "Postres", "Snacks"],
        datasets: [{
            data: [55, 25, 20]
        }]
    }
});

new Chart(document.getElementById("topProductosChart"), {
    type: "bar",
    data: {
        labels: ["Capuchino", "Latte", "Mocha", "Brownie", "Empanada"],
        datasets: [{
            label: "Ventas",
            data: [100, 85, 75, 60, 55]
        }]
    }
});

new Chart(document.getElementById("comparativaChart"), {
    type: "line",
    data: {
        labels: ["Ene", "Feb", "Mar", "Abr", "May"],
        datasets: [
            {
                label: "Ventas",
                data: [1200, 1800, 1400, 2200, 2600]
            },
            {
                label: "Gastos",
                data: [800, 900, 950, 1100, 1200]
            }
        ]
    }
});
