
fetch("http://localhost:8080/ventas/por-mes")
    .then(res => res.json())
    .then(data => {

        const labels = data.map(x => "Mes " + x[0]);
        const totales = data.map(x => x[1]);

        new Chart(document.getElementById("ventasChart"), {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Ventas por mes ($)",
                    data: totales,
                    backgroundColor: "#704830"
                }]
            },
            options: {
                scales: { y: { beginAtZero: true } }
            }
        });

    })
    .catch(err => console.error("Error cargando ventas por mes:", err));

fetch("http://localhost:8080/ventas/metodo-pago")
    .then(res => res.json())
    .then(data => {

        const labels = data.map(x => x[0]);
        const cantidades = data.map(x => x[1]);

        new Chart(document.getElementById("metodosChart"), {
            type: "doughnut",
            data: {
                labels: labels,
                datasets: [{
                    data: cantidades
                }]
            }
        });

    })
    .catch(err => console.error("Error cargando métodos pago:", err));

fetch("http://localhost:8080/ventas/top-categorias")
    .then(res => res.json())
    .then(data => {

        const labels = data.map(x => x[0]);
        const cantidades = data.map(x => x[1]);

        new Chart(document.getElementById("categoriasChart"), {
            type: "pie",
            data: {
                labels: labels,
                datasets: [{
                    data: cantidades
                }]
            }
        });

    })
    .catch(err => console.error("Error cargando categorias:", err));
