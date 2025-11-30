package com.example.backend_cafedronel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend_cafedronel.model.Proveedor;

public interface ProveedorRepository extends JpaRepository<Proveedor, Integer> {
}
