package com.smartlogix.bff.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import java.util.List;

@Component
public class InventarioClient {
    private final RestTemplate restTemplate;
    
    @Value("${inventario.service.url}")
    private String inventarioUrl;

    public InventarioClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<ProductoDTO> listarProductos() {
        try {
            return List.of(restTemplate.getForObject(inventarioUrl + "/productos", ProductoDTO[].class));
        } catch (Exception e) {
            return List.of();
        }
    }

    public boolean verificarStock(Long productoId, int cantidad) {
        try {
            return restTemplate.getForObject(
                inventarioUrl + "/productos/stock/" + productoId + "/" + cantidad,
                Boolean.class
            );
        } catch (Exception e) {
            return false;
        }
    }
}