package com.example.backend_cafedronel.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.sql.Timestamp;

import com.example.backend_cafedronel.model.Pedido;
import com.example.backend_cafedronel.repository.PedidoRepository;

@RestController
@RequestMapping("/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    private final PedidoRepository pedidoRepository;

    public PedidoController(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    @GetMapping
    public List<Pedido> getAllPedidos() {
        return pedidoRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Pedido> getPedidoById(@PathVariable Integer id) {
        return pedidoRepository.findById(id);
    }


    @PostMapping
    public Pedido crearPedido(@RequestBody Pedido pedido) {
    if (pedido.getDetalles() == null || pedido.getDetalles().isEmpty()) {
        throw new RuntimeException("El pedido no tiene detalles");
    }

    pedido.setEstado(Pedido.EstadoPedido.pendiente);
    pedido.setFecha(new Timestamp(System.currentTimeMillis()));

    pedido.getDetalles().forEach(detalle -> detalle.setPedido(pedido));

    return pedidoRepository.save(pedido);
    }

    @PutMapping("/{id}/estado")
    public Pedido actualizarEstado(@PathVariable Integer id, @RequestParam String estado) {
    Pedido pedido = pedidoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

    // Validar y actualizar solo los estados permitidos
    switch (estado.toLowerCase()) {
        case "en_proceso":
            pedido.setEstado(Pedido.EstadoPedido.en_proceso);
            break;
        case "completado":
            pedido.setEstado(Pedido.EstadoPedido.completado);
            break;
        case "cancelado":
            pedido.setEstado(Pedido.EstadoPedido.cancelado);
            break;
        default:
            throw new RuntimeException("Estado no válido");
    }

    return pedidoRepository.save(pedido);
}

    @DeleteMapping("/{id}")
    public void eliminarPedido(@PathVariable Integer id) {
        pedidoRepository.deleteById(id);
    }
}
