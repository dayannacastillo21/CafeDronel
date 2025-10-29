package com.example.backend_cafedronel.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.backend_cafedronel.model.Producto;
import com.example.backend_cafedronel.repository.ProductoRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/productos")
@CrossOrigin(origins = "*")
public class ProductoController {

    private final ProductoRepository repo;

    public ProductoController(ProductoRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Producto> listar() {
        return repo.findAll();
    }

    @GetMapping("/categoria/{categoria}")
    public List<Producto> porCategoria(@PathVariable String categoria) {
        return repo.findByCategoria(categoria);
    }

    @PostMapping
    public Producto crear(@RequestBody Producto producto) {
        producto.setImagen(null);
        producto.setDestacado(false);
        producto.setActivo(true);
        return repo.save(producto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerPorId(@PathVariable Integer id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public Producto actualizar(@PathVariable Integer id, @RequestBody Producto productoActualizado) {
        Optional<Producto> productoExistente = repo.findById(id);

        if (productoExistente.isPresent()) {
            Producto p = productoExistente.get();
            p.setNombre(productoActualizado.getNombre());
            p.setDescripcion(productoActualizado.getDescripcion());
            p.setTamano(productoActualizado.getTamano());
            p.setPrecio(productoActualizado.getPrecio());
            p.setCategoria(productoActualizado.getCategoria());
            return repo.save(p);
        } else {
            return null;
        }
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        repo.deleteById(id);
    }
}
