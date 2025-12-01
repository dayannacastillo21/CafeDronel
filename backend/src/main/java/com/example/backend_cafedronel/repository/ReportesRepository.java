package com.example.backend_cafedronel.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.example.backend_cafedronel.model.Venta;

@Repository
public interface ReportesRepository extends JpaRepository<Venta, Long> {

    // Ventas por mes (OK)
    @Query("SELECT FUNCTION('MONTH', v.fechaVenta), SUM(v.total) " +
           "FROM Venta v GROUP BY FUNCTION('MONTH', v.fechaVenta) ORDER BY FUNCTION('MONTH', v.fechaVenta)")
    List<Object[]> ventasPorMes();

    // Ventas por categoría (TU BD NO TIENE CATEGORÍA, ASÍ QUE USAREMOS EL NOMBRE DEL PRODUCTO)
    @Query("SELECT v.producto, SUM(v.cantidad) " +
           "FROM Venta v GROUP BY v.producto")
    List<Object[]> ventasPorCategoria();

    // Top productos (OK usando texto)
    @Query("SELECT v.producto, SUM(v.cantidad) " +
           "FROM Venta v GROUP BY v.producto ORDER BY SUM(v.cantidad) DESC")
    List<Object[]> topProductos();
}
