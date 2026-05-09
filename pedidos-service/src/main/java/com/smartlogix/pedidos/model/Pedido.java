package com.smartlogix.pedidos.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long productoId;
    private int cantidad;
    private String tipoEnvio;
    private String estado;
    private LocalDateTime fechaCreacion;
    private String direccion;
    private String region;
    private String comuna;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        estado = "PENDIENTE";
    }
}