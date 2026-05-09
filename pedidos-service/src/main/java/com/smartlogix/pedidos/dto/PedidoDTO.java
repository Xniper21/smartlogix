package com.smartlogix.pedidos.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PedidoDTO {
    private Long id;
    private Long productoId;
    private Integer cantidad;
    private String tipoEnvio;
    private String estado;
    private LocalDateTime fechaCreacion;
    private String direccion;
    private String region;
    private String comuna;
}