package com.smartlogix.envios.listener;

import com.smartlogix.envios.dto.PedidoDTO;
import com.smartlogix.envios.model.Envio;
import com.smartlogix.envios.service.EnvioService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PedidoMessageListener {

    private final EnvioService envioService;

    @RabbitListener(queues = "${smartlogix.queue.pedidos}")
    public void procesarPedido(PedidoDTO pedidoDTO) {
        // Crear envío basado en el pedido recibido
        Envio envio = new Envio();
        envio.setPedidoId(pedidoDTO.getId());
        envio.setTipo(pedidoDTO.getTipoEnvio());
        envio.setEstado("PENDIENTE");

        envioService.crearEnvio(envio);
        System.out.println("Envío creado para pedido: " + pedidoDTO.getId());
    }
}