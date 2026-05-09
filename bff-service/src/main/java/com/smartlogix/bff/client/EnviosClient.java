package com.smartlogix.bff.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;

@Component
public class EnviosClient {
    private final RestTemplate restTemplate;

    @Value("${envios.service.url:http://localhost:8083}")
    private String enviosUrl;

    public EnviosClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<EnvioDTO> listarEnvios() {
        try {
            EnvioDTO[] envios = restTemplate.getForObject(enviosUrl + "/envios", EnvioDTO[].class);
            return envios != null ? List.of(envios) : Collections.emptyList();
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public void eliminarPorPedidoId(Long pedidoId) {
        restTemplate.delete(enviosUrl + "/envios/pedido/" + pedidoId);
    }
}
