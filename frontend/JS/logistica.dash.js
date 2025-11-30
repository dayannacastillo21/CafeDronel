// Ventas Mensuales
    const ctx1 = document.getElementById('ventasChart').getContext('2d');
    new Chart(ctx1, {
      type: 'line',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
        datasets: [{
          label: 'Ventas',
          data: [4200, 3000, 5000, 4600, 6100, 5900, 5400],
          borderColor: '#5b3924',
          backgroundColor: 'rgba(91, 57, 36, 0.2)',
          tension: 0.3,
          fill: true,
          pointBackgroundColor: '#5b3924'
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });

    // Productos más vendidos
    const ctx2 = document.getElementById('productosChart').getContext('2d');
    new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: ['Café Latte', 'Capuccino', 'Expresso', 'Moka', 'Americano'],
        datasets: [{
          data: [150, 230, 200, 170, 130],
          backgroundColor: '#a5662b'
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });