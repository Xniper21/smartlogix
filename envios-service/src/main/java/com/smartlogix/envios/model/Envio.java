package com.smartlogix.envios.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Envio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long pedidoId;
    private String tipo;
    private String estado;
    private String transportista;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaEntrega;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        estado = "PENDIENTE";
    }
}