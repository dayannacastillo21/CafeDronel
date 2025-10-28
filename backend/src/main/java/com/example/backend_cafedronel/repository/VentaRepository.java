package com.example.backend_cafedronel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend_cafedronel.model.Venta;

public interface VentaRepository extends JpaRepository<Venta, Integer> {
}
