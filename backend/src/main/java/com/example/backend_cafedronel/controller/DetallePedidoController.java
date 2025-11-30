package com.example.backend_cafedronel.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.backend_cafedronel.model.DetallePedido;
import com.example.backend_cafedronel.repository.DetallePedidoRepository;

@RestController
@RequestMapping("/detalle-pedido")
@CrossOrigin(origins = "*")
public class DetallePedidoController {

    private final DetallePedidoRepository detallePedidoRepository;

    public DetallePedidoController(DetallePedidoRepository detallePedidoRepository) {
        this.detallePedidoRepository = detallePedidoRepository;
    }

    @GetMapping("/{pedidoId}")
    public List<DetallePedido> obtenerDetallesPorPedido(@PathVariable Integer pedidoId) {
        return detallePedidoRepository.findByPedidoId(pedidoId);
    }
}
