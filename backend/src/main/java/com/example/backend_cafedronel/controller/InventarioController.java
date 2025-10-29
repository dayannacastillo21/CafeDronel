package com.example.backend_cafedronel.controller;

import com.example.backend_cafedronel.model.Inventario;
import com.example.backend_cafedronel.repository.InventarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
