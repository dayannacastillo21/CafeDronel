const suppliersData = [
      { id: 1, name: "Café Orgánico SL", contact: "Juan Pérez", phone: "+34 600 123 456", email: "juan@cafeorganico.com", products: "Café Colombia, Etiopía", status: "activo" },
      { id: 2, name: "Lácteos Frescos", contact: "María García", phone: "+34 600 234 567", email: "maria@lacteofrescos.com", products: "Leche, Crema", status: "activo" },
      { id: 3, name: "Endulza Tu Vida", contact: "Carlos Ruiz", phone: "+34 600 345 678", email: "carlos@endulza.com", products: "Azúcar, Miel", status: "activo" },
      { id: 4, name: "Accesorios Premium", contact: "Ana López", phone: "+34 600 456 789", email: "ana@accesorios.com", products: "Tazas, Filtros", status: "activo" },
    ];

    function renderSuppliers(data) {
      const tbody = document.getElementById("suppliersTable");
      tbody.innerHTML = "";

      data.forEach(supplier => {
        tbody.innerHTML += `
          <tr>
            <td class="fw-semibold">${supplier.name}</td>
            <td>${supplier.contact}</td>
            <td><i class="bi bi-telephone me-2 text-muted"></i>${supplier.phone}</td>
            <td><i class="bi bi-envelope me-2 text-muted"></i>${supplier.email}</td>
            <td class="text-muted">${supplier.products}</td>
            <td><span class="badge bg-success text-uppercase">${supplier.status}</span></td>
          </tr>
        `;
      });
    }

    
    document.getElementById("searchInput").addEventListener("input", function() {
      const searchTerm = this.value.toLowerCase();
      const filtered = suppliersData.filter(supplier =>
        supplier.name.toLowerCase().includes(searchTerm)
      );
      renderSuppliers(filtered);
    });

   
    renderSuppliers(suppliersData);