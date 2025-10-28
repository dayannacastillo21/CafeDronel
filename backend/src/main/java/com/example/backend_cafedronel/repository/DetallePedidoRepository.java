package com.example.backend_cafedronel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.example.backend_cafedronel.model.DetallePedido;

public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Integer> {
    List<DetallePedido> findByPedidoId(Integer pedidoId);
}
