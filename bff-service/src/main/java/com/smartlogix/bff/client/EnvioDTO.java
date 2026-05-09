package com.smartlogix.bff.client;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class EnvioDTO {
    private Long id;
    private Long pedidoId;
    private String tipo;
    private String estado;
    private String transportista;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaEntrega;
}
