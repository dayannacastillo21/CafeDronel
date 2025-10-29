package com.example.backend_cafedronel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend_cafedronel.model.Producto;
import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Integer> {
    List<Producto> findByCategoria(String categoria);
}
