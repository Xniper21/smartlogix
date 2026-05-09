package com.smartlogix.pedidos.client;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
public class InventarioClient {
    private final RestTemplate restTemplate;

    @Value("${inventario.service.url:http://localhost:8081}")
    private String inventarioServiceUrl;

    public boolean verificarStock(Long productoId, int cantidad) {
        try {
            String url = inventarioServiceUrl + "/productos/stock/" + productoId + "/" + cantidad;
            return restTemplate.getForObject(url, Boolean.class);
        } catch (Exception e) {
            return false;
        }
    }
}