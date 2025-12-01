package com.example.backend_cafedronel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend_cafedronel.model.Venta;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface VentaRepository extends JpaRepository<Venta, Integer> {

    @Query(value = "SELECT MONTH(fecha_venta) AS mes, SUM(total) AS total " +
            "FROM ventas " +
            "GROUP BY MONTH(fecha_venta) " +
            "ORDER BY mes", nativeQuery = true)
    List<Object[]> obtenerVentasPorMes();

    @Query(value = "SELECT metodo_pago, COUNT(*) AS cantidad " +
            "FROM ventas " +
            "GROUP BY metodo_pago", nativeQuery = true)
    List<Object[]> obtenerVentasPorMetodoPago();
    @Query("""
    SELECT d.producto.categoria AS categoria, SUM(d.cantidad) AS cantidad
    FROM DetalleVenta d
    GROUP BY d.producto.categoria
""")
    List<Object[]> obtenerTopCategorias();
}
