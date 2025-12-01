package com.example.backend_cafedronel.controller;

import com.example.backend_cafedronel.model.VentaRegistrada;
import com.example.backend_cafedronel.repository.VentaRegistradaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ventaregistrada")
@CrossOrigin(origins = "*")
public class VentaRegistradaController {

    private final VentaRegistradaRepository repo;

    public VentaRegistradaController(VentaRegistradaRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<VentaRegistrada> listar() {
        return repo.findAll();
    }

    //registrar
    @PostMapping
    public VentaRegistrada registrar(@RequestBody VentaRegistrada venta) {
        return repo.save(venta);
    }

    // Actualizar
    @PutMapping("/{id}")
    public VentaRegistrada actualizar(@PathVariable Integer id, @RequestBody VentaRegistrada venta) {
        VentaRegistrada existente = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada"));

        existente.setProducto(venta.getProducto());
        existente.setCantidad(venta.getCantidad());
        existente.setPrecio(venta.getPrecio());

        return repo.save(existente);
    }

    // Eliminar
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        repo.deleteById(id);
    }

}

