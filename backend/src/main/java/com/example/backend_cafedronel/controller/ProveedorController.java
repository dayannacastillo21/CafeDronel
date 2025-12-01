package com.example.backend_cafedronel.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.backend_cafedronel.model.Proveedor;
import com.example.backend_cafedronel.repository.ProveedorRepository;

@RestController
@RequestMapping("/proveedores")
@CrossOrigin(origins = "*") // Permite que cualquier frontend acceda
public class ProveedorController {

    private final ProveedorRepository proveedorRepository;

    public ProveedorController(ProveedorRepository proveedorRepository) {
        this.proveedorRepository = proveedorRepository;
    }

    // Obtener todos los proveedores
    @GetMapping
    public List<Proveedor> getAll() {
        return proveedorRepository.findAll();
    }

    // Crear un proveedor
    @PostMapping
    public Proveedor create(@RequestBody Proveedor proveedor) {
        return proveedorRepository.save(proveedor);
    }

    // Actualizar un proveedor
    @PutMapping("/{id}")
    public Proveedor update(@PathVariable Integer id, @RequestBody Proveedor proveedor) {
        Proveedor existente = proveedorRepository.findById(id).orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
        existente.setNombre(proveedor.getNombre());
        existente.setTelefono(proveedor.getTelefono());
        existente.setDireccion(proveedor.getDireccion());
        existente.setEmail(proveedor.getEmail());
        existente.setActivo(proveedor.isActivo());
        return proveedorRepository.save(existente);
    }

    // Eliminar un proveedor
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        if (!proveedorRepository.existsById(id)) {
            throw new RuntimeException("Proveedor no encontrado");
        }
        proveedorRepository.deleteById(id);
    }
}
