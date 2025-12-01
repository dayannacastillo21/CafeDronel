package com.example.backend_cafedronel.model;

import jakarta.persistence.*;

@Entity
@Table(name = "ventaregistradas")
public class VentaRegistrada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String producto;
    private int cantidad;
    private double precio;

    // GETTERS y SETTERS
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getProducto() { return producto; }
    public void setProducto(String producto) { this.producto = producto; }

    public int getCantidad() { return cantidad; }
    public void setCantidad(int cantidad) { this.cantidad = cantidad; }

    public double getPrecio() { return precio; }
    public void setPrecio(double precio) { this.precio = precio; }
}
