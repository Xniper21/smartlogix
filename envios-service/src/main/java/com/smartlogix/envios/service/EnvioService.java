package com.smartlogix.envios.service;

import com.smartlogix.envios.model.Envio;
import com.smartlogix.envios.repository.EnvioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EnvioService {
    private final EnvioRepository envioRepository;

    public Envio crearEnvio(Envio envio) {
        return envioRepository.save(envio);
    }

    public List<Envio> listarEnvios() {
        return envioRepository.findAll();
    }

    public Envio obtenerEnvio(Long id) {
        return envioRepository.findById(id).orElse(null);
    }

    public Envio actualizarEstado(Long id, String nuevoEstado) {
        Envio envio = envioRepository.findById(id).orElse(null);
        if (envio != null) {
            envio.setEstado(nuevoEstado);
            envioRepository.save(envio);
        }
        return envio;
    }

    public void eliminarPorPedidoId(Long pedidoId) {
        envioRepository.deleteByPedidoId(pedidoId);
    }
}