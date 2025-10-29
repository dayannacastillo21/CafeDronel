package com.example.backend_cafedronel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend_cafedronel.model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Integer> {
}
