package com.example.backend_cafedronel.controller;

import com.example.backend_cafedronel.model.Inventario;
import com.example.backend_cafedronel.repository.InventarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/inventario")
@CrossOrigin(origins = "*")
public class InventarioController {

    @Autowired
    private InventarioRepository inventarioRepository;

    @GetMapping
    public List<Inventario> listarInventario() {
        return inventarioRepository.findAll();
    }

    @PutMapping("/{id}/restar/{cantidad}")
    public Inventario restarStock(@PathVariable Integer id, @PathVariable int cantidad) {
        Optional<Inventario> optionalInventario = inventarioRepository.findById(id);
        if (optionalInventario.isPresent()) {
            Inventario inventario = optionalInventario.get();
            int nuevoStock = inventario.getCantidad() - cantidad;
            inventario.setCantidad(Math.max(nuevoStock, 0));
            return inventarioRepository.save(inventario);
        } else {
            throw new RuntimeException("Producto con ID " + id + " no encontrado");
        }
    }
}
