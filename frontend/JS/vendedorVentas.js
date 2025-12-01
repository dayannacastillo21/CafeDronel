
 //  registrar venta

      document.getElementById("formVenta").addEventListener("submit", async function(e) {
          e.preventDefault();

          const producto = document.getElementById("producto").value.trim();
          const cantidad = Number(document.getElementById("cantidad").value);
          const precio = Number(document.getElementById("precio").value);


          if (producto === "") {
              alert("Por favor, ingresa el nombre del producto");
              return; // detiene el envío
          }

          const nuevaVenta = { producto, cantidad, precio };

          try {
              const respuesta = await fetch("http://localhost:8080/ventaregistrada", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(nuevaVenta)
              });

              if (respuesta.ok) {
                  alert("Venta guardada correctamente");
                  document.getElementById("formVenta").reset(); // limpiar formulario
              } else {
                  alert("Error al guardar la venta");
                  console.log(await respuesta.text());
              }
          } catch (error) {
              console.log("Error en fetch:", error);
              alert("Error al conectar con la API");
          }
      });

           let ventaSeleccionada = null; // Se guarda la venta que el usuario seleccione

           // Cargar todas las ventas
           function cargarVentas() {
               fetch("http://localhost:8080/ventaregistrada")
                   .then(response => response.json())
                   .then(data => {
                       const tabla = document.getElementById("tablaVentas");
                       tabla.innerHTML = "";

                       data.forEach(venta => {
                           const fila = document.createElement("tr");

                           fila.innerHTML = `
                               <td>${venta.producto}</td>
                               <td>${venta.cantidad}</td>
                               <td>${venta.precio}</td>
                           `;

                           // Seleccionar fila
                           fila.addEventListener("click", () => {
                               ventaSeleccionada = venta;

                               document.getElementById("inputProducto").value = venta.producto;
                               document.getElementById("inputCantidad").value = venta.cantidad;
                               document.getElementById("inputPrecio").value = venta.precio;

                               // Resaltar fila seleccionada
                               document.querySelectorAll("#tablaVentas tr").forEach(f => f.classList.remove("selected"));
                               fila.classList.add("selected");
                           });

                           tabla.appendChild(fila);
                       });
                   });
           }

           cargarVentas();

           // ------------------------
           // Actualizar venta
           document.querySelector(".btn-actualizar").addEventListener("click", async () => {
               if (!ventaSeleccionada) {
                   alert("Selecciona una venta para actualizar");
                   return;
               }

               const producto = document.getElementById("inputProducto").value.trim();
               const cantidad = Number(document.getElementById("inputCantidad").value);
               const precio = Number(document.getElementById("inputPrecio").value);

               if (producto === "") {
                   alert("El producto no puede estar vacío");
                   return;
               }

               try {
                   const respuesta = await fetch(`http://localhost:8080/ventaregistrada/${ventaSeleccionada.id}`, {
                       method: "PUT",
                       headers: { "Content-Type": "application/json" },
                       body: JSON.stringify({ producto, cantidad, precio })
                   });


                   if (respuesta.ok) {
                       alert("Venta actualizada correctamente");
                       cargarVentas();
                   } else {
                       alert("Error al actualizar la venta");
                       console.log(await respuesta.text());
                   }
               } catch (error) {
                   console.error("Error en fetch:", error);
                   alert("Error al conectar con la API");
               }
           });

           // ------------------------
           // Eliminar venta
           document.querySelector(".btn-eliminar").addEventListener("click", async () => {
               if (!ventaSeleccionada) {
                   alert("Selecciona una venta para eliminar");
                   return;
               }

               if (!confirm(`¿Deseas eliminar la venta de "${ventaSeleccionada.producto}"?`)) return;

               try {
                   const respuesta = await fetch(`http://localhost:8080/ventaregistrada/${ventaSeleccionada.id}`, {
                       method: "DELETE"
                   });

                   if (respuesta.ok) {
                       alert("Venta eliminada correctamente");
                       ventaSeleccionada = null;
                       document.getElementById("inputProducto").value = "";
                       document.getElementById("inputCantidad").value = "";
                       document.getElementById("inputPrecio").value = "";
                       cargarVentas();
                   } else {
                       alert("Error al eliminar la venta");
                       console.log(await respuesta.text());
                   }
               } catch (error) {
                   console.error("Error en fetch:", error);
                   alert("Error al conectar con la API");
               }
           });
