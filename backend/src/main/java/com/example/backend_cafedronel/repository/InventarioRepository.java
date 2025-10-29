package com.example.backend_cafedronel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend_cafedronel.model.Inventario;

public interface InventarioRepository extends JpaRepository<Inventario, Integer> {
}