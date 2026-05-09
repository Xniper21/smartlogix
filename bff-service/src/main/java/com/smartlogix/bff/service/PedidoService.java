package com.smartlogix.bff.service;

import com.smartlogix.bff.client.PedidosClient;
import com.smartlogix.bff.client.PedidoDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidosClient pedidosClient;
    private final EnviosService enviosService;

    public String crearPedido(PedidoDTO pedido) {
        return pedidosClient.crearPedido(pedido);
    }

    public List<PedidoDTO> listarPedidos() {
        return pedidosClient.listarPedidos();
    }

    public PedidoDTO obtenerPedido(Long id) {
        return pedidosClient.obtenerPedido(id);
    }

    public PedidoDTO actualizarPedido(Long id, PedidoDTO pedido) {
        return pedidosClient.actualizarPedido(id, pedido);
    }

    public void eliminarPedido(Long id) {
        // First delete associated shipments
        enviosService.eliminarPorPedidoId(id);
        // Then delete the order
        pedidosClient.eliminarPedido(id);
    }
}
