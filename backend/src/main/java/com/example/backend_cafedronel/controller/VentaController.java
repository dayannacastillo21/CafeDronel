package com.example.backend_cafedronel.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.backend_cafedronel.model.Venta;
import com.example.backend_cafedronel.repository.VentaRepository;

@RestController
@RequestMapping("/ventas")
@CrossOrigin(origins = "*")
public class VentaController {
    private final VentaRepository ventaRepository;

    public VentaController(VentaRepository ventaRepository) {
        this.ventaRepository = ventaRepository;
    }

    @GetMapping
    public List<Venta> getAll() {
        return ventaRepository.findAll();
    }

    @PostMapping
    public Venta create(@RequestBody Venta venta) {
        return ventaRepository.save(venta);
    }
}
