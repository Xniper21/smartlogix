package com.smartlogix.bff.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;

import java.util.List;

@Component
public class PedidosClient {

    private final RestTemplate restTemplate;

    @Value("${pedidos.service.url:http://localhost:8082}")
    private String pedidosUrl;

    public PedidosClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String crearPedido(PedidoDTO pedido) {
        return restTemplate.postForObject(pedidosUrl + "/pedidos", pedido, String.class);
    }

    public List<PedidoDTO> listarPedidos() {
        PedidoDTO[] pedidos = restTemplate.getForObject(pedidosUrl + "/pedidos", PedidoDTO[].class);
        return pedidos != null ? List.of(pedidos) : List.of();
    }

    public PedidoDTO obtenerPedido(Long id) {
        return restTemplate.getForObject(pedidosUrl + "/pedidos/" + id, PedidoDTO.class);
    }

    public PedidoDTO actualizarPedido(Long id, PedidoDTO pedido) {
        return restTemplate.exchange(pedidosUrl + "/pedidos/" + id, HttpMethod.PUT, new HttpEntity<>(pedido), PedidoDTO.class).getBody();
    }

    public void eliminarPedido(Long id) {
        restTemplate.exchange(pedidosUrl + "/pedidos/" + id, HttpMethod.DELETE, null, Void.class);
    }
}