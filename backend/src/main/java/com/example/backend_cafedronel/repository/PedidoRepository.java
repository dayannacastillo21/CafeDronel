package com.example.backend_cafedronel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend_cafedronel.model.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, Integer> {
}
