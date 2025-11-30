package com.example.backend_cafedronel.model;

import jakarta.persistence.*;
import java.util.List;
import java.sql.Timestamp;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "pedido")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String cliente;
    private Double total;

    @Enumerated(EnumType.STRING)
    private EstadoPedido estado;

    private Timestamp fecha;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<DetallePedido> detalles;

    public enum EstadoPedido {
        pendiente, en_proceso, completado, cancelado
    }

    // Getters y setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getCliente() { return cliente; }
    public void setCliente(String cliente) { this.cliente = cliente; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public EstadoPedido getEstado() { return estado; }
    public void setEstado(EstadoPedido estado) { this.estado = estado; }

    public Timestamp getFecha() { return fecha; }
    public void setFecha(Timestamp fecha) { this.fecha = fecha; }

    public List<DetallePedido> getDetalles() { return detalles; }
    public void setDetalles(List<DetallePedido> detalles) { this.detalles = detalles; }
}
