package com.smartlogix.bff.service;

import com.smartlogix.bff.client.EnvioDTO;
import com.smartlogix.bff.client.EnviosClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EnviosService {

    private final EnviosClient enviosClient;

    public List<EnvioDTO> listarEnvios() {
        return enviosClient.listarEnvios();
    }

    public void eliminarPorPedidoId(Long pedidoId) {
        enviosClient.eliminarPorPedidoId(pedidoId);
    }
}
