package com.example.backend_cafedronel.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.*;
import com.example.backend_cafedronel.model.Inventario;
import com.example.backend_cafedronel.repository.InventarioRepository;

@RestController
@RequestMapping("/api/inventario")
@CrossOrigin(origins = "*")
public class InventarioController {

    @Autowired
    private InventarioRepository inventarioRepository;

    // ✅ Tu endpoint antiguo (para validar_stock.html)
    @GetMapping
    public List<Inventario> listarInventarioSimple() {
        return inventarioRepository.findAll();
    }

    // ✅ El de tu compañera
    @GetMapping("/listar")
    public Map<String, Object> listarInventario() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Inventario> lista = inventarioRepository.findAll();
            response.put("success", true);
            response.put("data", lista);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al obtener los datos: " + e.getMessage());
        }
        return response;
    }

    @PostMapping("/agregar")
    public Map<String, Object> agregarProducto(@RequestBody Inventario inventario) {
        Map<String, Object> response = new HashMap<>();
        try {
            inventarioRepository.save(inventario);
            response.put("success", true);
            response.put("message", "Producto agregado correctamente.");
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al agregar producto: " + e.getMessage());
        }
        return response;
    }

    @PutMapping("/editar/{id}")
    public Map<String, Object> editarProducto(@PathVariable Integer id, @RequestBody Inventario actualizado) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<Inventario> optionalInventario = inventarioRepository.findById(id);
            if (optionalInventario.isPresent()) {
                Inventario inventario = optionalInventario.get();
                inventario.setNombreInsumo(actualizado.getNombreInsumo());
                inventario.setCantidad(actualizado.getCantidad());
                inventario.setUnidad(actualizado.getUnidad());
                inventario.setStockMinimo(actualizado.getStockMinimo());
                inventario.setPrecioUnitario(actualizado.getPrecioUnitario());
                inventario.setProveedor(actualizado.getProveedor());
                inventarioRepository.save(inventario);
                response.put("success", true);
                response.put("message", "Producto actualizado correctamente.");
            } else {
                response.put("success", false);
                response.put("message", "Producto no encontrado.");
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al editar producto: " + e.getMessage());
        }
        return response;
    }

    @DeleteMapping("/eliminar/{id}")
    public Map<String, Object> eliminarProducto(@PathVariable Integer id) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (inventarioRepository.existsById(id)) {
                inventarioRepository.deleteById(id);
                response.put("success", true);
                response.put("message", "Producto eliminado correctamente.");
            } else {
                response.put("success", false);
                response.put("message", "Producto no encontrado.");
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al eliminar producto: " + e.getMessage());
        }
        return response;
    }

    // ✅ Restar stock (tu método)
    @PutMapping("/{id}/restar/{cantidad}")
    public Map<String, Object> restarStock(@PathVariable Integer id, @PathVariable int cantidad) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<Inventario> optionalInventario = inventarioRepository.findById(id);
            if (optionalInventario.isPresent()) {
                Inventario inventario = optionalInventario.get();
                int nuevoStock = inventario.getCantidad() - cantidad;
                inventario.setCantidad(Math.max(nuevoStock, 0));
                inventarioRepository.save(inventario);
                response.put("success", true);
                response.put("message", "Stock actualizado correctamente.");
                response.put("data", inventario);
            } else {
                response.put("success", false);
                response.put("message", "Producto con ID " + id + " no encontrado.");
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al restar stock: " + e.getMessage());
        }
        return response;
    }
}
