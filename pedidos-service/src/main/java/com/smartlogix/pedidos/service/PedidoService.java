package com.smartlogix.pedidos.service;

import com.smartlogix.pedidos.client.InventarioClient;
import com.smartlogix.pedidos.dto.PedidoDTO;
import com.smartlogix.pedidos.model.Pedido;
import com.smartlogix.pedidos.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PedidoService {
    private final InventarioClient inventarioClient;
    private final PedidoRepository pedidoRepository;
    private final RabbitTemplate rabbitTemplate;

    @Value("${smartlogix.queue.pedidos}")
    private String pedidosQueue;

    public String crearPedido(Pedido pedido) {
        boolean hayStock = inventarioClient.verificarStock(pedido.getProductoId(), pedido.getCantidad());
        if (!hayStock) {
            pedido.setEstado("RECHAZADO");
            pedidoRepository.save(pedido);
            return "No hay stock disponible";
        }

        pedido.setEstado("CONFIRMADO");
        Pedido pedidoGuardado = pedidoRepository.save(pedido);

        // Enviar mensaje a RabbitMQ para procesamiento de envío
        try {
            PedidoDTO pedidoDTO = new PedidoDTO(
                pedidoGuardado.getId(),
                pedidoGuardado.getProductoId(),
                pedidoGuardado.getCantidad(),
                pedidoGuardado.getTipoEnvio(),
                pedidoGuardado.getEstado(),
                pedidoGuardado.getFechaCreacion(),
                pedidoGuardado.getDireccion(),
                pedidoGuardado.getRegion(),
                pedidoGuardado.getComuna()
            );
            rabbitTemplate.convertAndSend(pedidosQueue, pedidoDTO);
        } catch (Exception e) {
            // Log the error but don't fail the pedido creation
            System.err.println("Error sending message to RabbitMQ: " + e.getMessage());
        }

        return "Pedido #" + pedidoGuardado.getId() + " creado y enviado para procesamiento de envío";
    }

    public List<Pedido> listarPedidos() {
        return pedidoRepository.findAll();
    }

    public Pedido obtenerPedido(Long id) {
        return pedidoRepository.findById(id).orElse(null);
    }

    public Pedido actualizarPedido(Long id, Pedido pedido) {
        Pedido existingPedido = pedidoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        
        existingPedido.setProductoId(pedido.getProductoId());
        existingPedido.setCantidad(pedido.getCantidad());
        existingPedido.setTipoEnvio(pedido.getTipoEnvio());
        existingPedido.setEstado(pedido.getEstado());
        existingPedido.setDireccion(pedido.getDireccion());
        existingPedido.setRegion(pedido.getRegion());
        existingPedido.setComuna(pedido.getComuna());
        
        return pedidoRepository.save(existingPedido);
    }

    public void eliminarPedido(Long id) {
        System.out.println("Eliminando pedido con id: " + id);
        pedidoRepository.deleteById(id);
        System.out.println("Pedido eliminado");
    }
}