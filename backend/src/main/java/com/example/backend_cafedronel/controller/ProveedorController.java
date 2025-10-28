package com.example.backend_cafedronel.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.backend_cafedronel.model.Proveedor;
import com.example.backend_cafedronel.repository.ProveedorRepository;

@RestController
@RequestMapping("/proveedores")
@CrossOrigin(origins = "*")
public class ProveedorController {
    private final ProveedorRepository proveedorRepository;

    public ProveedorController(ProveedorRepository proveedorRepository) {
        this.proveedorRepository = proveedorRepository;
    }

    @GetMapping
    public List<Proveedor> getAll() {
        return proveedorRepository.findAll();
    }

    @PostMapping
    public Proveedor create(@RequestBody Proveedor proveedor) {
        return proveedorRepository.save(proveedor);
    }
}
