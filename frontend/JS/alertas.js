// Datos de alertas
const alertsData = [
    { id: 1, type: "critical", title: "Stock Crítico", message: "Café Colombia Premium tiene solo 5 unidades en stock", date: "2024-01-16 10:30" },
    { id: 2, type: "warning", title: "Pedido Pendiente", message: "Pedido #1001 lleva 2 días sin procesar", date: "2024-01-16 09:15" },
    { id: 3, type: "info", title: "Nuevo Proveedor", message: "Se ha agregado un nuevo proveedor: Café Premium SA", date: "2024-01-15 16:45" },
    { id: 4, type: "critical", title: "Stock Agotado", message: "Tazas cerámicas: Stock agotado", date: "2024-01-15 14:20" },
    { id: 5, type: "success", title: "Pedido Completado", message: "Pedido #1003 entregado exitosamente", date: "2024-01-15 11:00" },
];

// Iconos según tipo
const getIcon = (type) => {
    switch (type) {
        case "critical": return '<i class="bi bi-x-circle text-danger fs-4"></i>';
        case "warning": return '<i class="bi bi-exclamation-triangle text-warning fs-4"></i>';
        case "success": return '<i class="bi bi-check-circle text-success fs-4"></i>';
        default: return '<i class="bi bi-info-circle text-info fs-4"></i>';
    }
};


const getBadgeClass = (type) => {
    switch (type) {
        case "critical": return "badge-critical";
        case "warning": return "badge-warning";
        case "success": return "badge-success";
        default: return "badge-info";
    }
};


const renderAlertas = () => {
    const container = document.getElementById("alertasList");
    container.innerHTML = "";
    alertsData.forEach(alert => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
        <div class="card-body d-flex gap-3">
            <div>${getIcon(alert.type)}</div>
            <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h5 class="mb-0">${alert.title}</h5>
                    <span class="badge ${getBadgeClass(alert.type)} text-uppercase">${alert.type}</span>
                </div>
                <p class="mb-1 text-muted">${alert.message}</p>
                <small class="text-muted">${alert.date}</small>
            </div>
        </div>
    `;
    container.appendChild(card);
});


document.getElementById("criticasCount").textContent = alertsData.filter(a => a.type === "critical").length;
document.getElementById("warningsCount").textContent = alertsData.filter(a => a.type === "warning").length;
document.getElementById("infoCount").textContent = alertsData.filter(a => a.type === "info").length;
};
renderAlertas();