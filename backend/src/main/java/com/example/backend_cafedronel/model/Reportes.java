package com.example.backend_cafedronel.model;

import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.backend_cafedronel.repository.ReportesRepository;

@Service
public class Reportes {

    @Autowired
    private ReportesRepository reportesRepository;

    // Ventas por mes
    public List<Map<String,Object>> getVentasPorMes() {
        List<Object[]> results = reportesRepository.ventasPorMes();
        List<Map<String,Object>> data = new ArrayList<>();
        for(Object[] row : results){
            Map<String,Object> map = new HashMap<>();
            map.put("mes", row[0]);
            map.put("total", row[1]);
            data.add(map);
        }
        return data;
    }

    // Ventas por categoría (usando el nombre del producto porque tu BD no tiene categoría)
    public List<Map<String,Object>> getVentasPorCategoria() {
        List<Object[]> results = reportesRepository.ventasPorCategoria();
        List<Map<String,Object>> data = new ArrayList<>();
        for(Object[] row : results){
            Map<String,Object> map = new HashMap<>();
            map.put("categoria", row[0]);  // nombre del producto
            map.put("total", row[1]);
            data.add(map);
        }
        return data;
    }

    // Top productos
    public List<Map<String,Object>> getTopProductos() {
        List<Object[]> results = reportesRepository.topProductos();
        List<Map<String,Object>> data = new ArrayList<>();
        for(Object[] row : results){
            Map<String,Object> map = new HashMap<>();
            map.put("producto", row[0]);
            map.put("cantidad", row[1]);
            data.add(map);
        }
        return data;
    }
}
