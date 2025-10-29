package com.example.backend_cafedronel.model;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String nombre;
    private double precio;
    private String categoria;
    private String descripcion;
    private String tamaño;
    private String imagen;
    private int destacado;
    private int activo;
    private Timestamp fecha_creacion;
    private Timestamp fecha_actualizacion;

    // Getters y setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public double getPrecio() { return precio; }
    public void setPrecio(double precio) { this.precio = precio; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getTamaño() { return tamaño; }
    public void setTamaño(String tamaño) { this.tamaño = tamaño; }

    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }

    public int getDestacado() { return destacado; }
    public void setDestacado(int destacado) { this.destacado = destacado; }

    public int getActivo() { return activo; }
    public void setActivo(int activo) { this.activo = activo; }

    public Timestamp getFecha_creacion() { return fecha_creacion; }
    public void setFecha_creacion(Timestamp fecha_creacion) { this.fecha_creacion = fecha_creacion; }

    public Timestamp getFecha_actualizacion() { return fecha_actualizacion; }
    public void setFecha_actualizacion(Timestamp fecha_actualizacion) { this.fecha_actualizacion = fecha_actualizacion; }
}
