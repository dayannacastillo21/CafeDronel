package com.example.backend_cafedronel.controller;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.backend_cafedronel.model.Reportes;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin("*")
public class ReportesController {

    @Autowired
    private Reportes reportes;

    @GetMapping("/ventas")
    public List<Map<String,Object>> ventas() {
        return reportes.getVentasPorMes();
    }

    @GetMapping("/categorias")
    public List<Map<String,Object>> categorias() {
        return reportes.getVentasPorCategoria();
    }

    @GetMapping("/top-productos")
    public List<Map<String,Object>> topProductos() {
        return reportes.getTopProductos();
    }
}
