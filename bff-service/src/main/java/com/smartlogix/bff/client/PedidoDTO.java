package com.smartlogix.bff.client;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PedidoDTO {
    private Long id;
    private Long productoId;
    private int cantidad;
    private String tipoEnvio;
    private String estado;
    private LocalDateTime fechaCreacion;
    private String direccion;
    private String region;
    private String comuna;
}