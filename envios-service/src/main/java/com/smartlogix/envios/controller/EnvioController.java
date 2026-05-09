package com.smartlogix.envios.controller;

import com.smartlogix.envios.model.Envio;
import com.smartlogix.envios.service.EnvioService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/envios")
@RequiredArgsConstructor
public class EnvioController {
    private final EnvioService envioService;

    @PostMapping
    public Envio crearEnvio(@RequestBody Envio envio) {
        return envioService.crearEnvio(envio);
    }

    @GetMapping
    public List<Envio> listarEnvios() {
        return envioService.listarEnvios();
    }

    @GetMapping("/{id}")
    public Envio obtenerEnvio(@PathVariable Long id) {
        return envioService.obtenerEnvio(id);
    }

    @PutMapping("/{id}/estado/{estado}")
    public Envio actualizarEstado(@PathVariable Long id, @PathVariable String estado) {
        return envioService.actualizarEstado(id, estado);
    }

    @DeleteMapping("/pedido/{pedidoId}")
    public void eliminarPorPedidoId(@PathVariable Long pedidoId) {
        envioService.eliminarPorPedidoId(pedidoId);
    }
}