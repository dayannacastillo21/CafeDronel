// Datos
    const salesByMonth = [
      { month: "Ene", ventas: 4200, gastos: 2800 },
      { month: "Feb", ventas: 3800, gastos: 2500 },
      { month: "Mar", ventas: 5100, gastos: 3200 },
      { month: "Abr", ventas: 4700, gastos: 2900 },
      { month: "May", ventas: 6200, gastos: 3800 },
      { month: "Jun", ventas: 5800, gastos: 3500 },
    ];

    const productCategories = [
      { name: "Bebidas", value: 45 },
      { name: "Granos", value: 30 },
      { name: "Accesorios", value: 15 },
      { name: "Otros", value: 10 },
    ];

    const topProducts = [
      { producto: "Cappuccino", unidades: 320 },
      { producto: "Espresso", unidades: 280 },
      { producto: "Latte", unidades: 250 },
      { producto: "Americano", unidades: 210 },
      { producto: "Mocha", unidades: 180 },
    ];

    // Gráficas
    new Chart(document.getElementById("ventasChart"), {
      type: "line",
      data: {
        labels: salesByMonth.map(d => d.month),
        datasets: [{
          label: "Ventas",
          data: salesByMonth.map(d => d.ventas),
          borderColor: "#5b3924",
          backgroundColor: "rgba(91,57,36,0.2)",
          tension: 0.3
        }]
      }
    });

    new Chart(document.getElementById("categoriasChart"), {
      type: "pie",
      data: {
        labels: productCategories.map(c => c.name),
        datasets: [{
          data: productCategories.map(c => c.value),
          backgroundColor: ["#5b3924", "#c27d45", "#d4a373", "#ccc"]
        }]
      }
    });

    new Chart(document.getElementById("topProductosChart"), {
      type: "bar",
      data: {
        labels: topProducts.map(p => p.producto),
        datasets: [{
          label: "Unidades Vendidas",
          data: topProducts.map(p => p.unidades),
          backgroundColor: "#c27d45"
        }]
      },
      options: {
        indexAxis: "y"
      }
    });

    new Chart(document.getElementById("comparativaChart"), {
      type: "bar",
      data: {
        labels: salesByMonth.map(d => d.month),
        datasets: [
          {
            label: "Ventas",
            data: salesByMonth.map(d => d.ventas),
            backgroundColor: "#5b3924"
          },
          {
            label: "Gastos",
            data: salesByMonth.map(d => d.gastos),
            backgroundColor: "#c27d45"
          }
        ]
      }
    });