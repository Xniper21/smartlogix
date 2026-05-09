package com.smartlogix.bff.controller;

import com.smartlogix.bff.client.PedidoDTO;
import com.smartlogix.bff.service.PedidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/pedidos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;

    @PostMapping
    public String crearPedido(@RequestBody PedidoDTO pedido) {
        return pedidoService.crearPedido(pedido);
    }

    @GetMapping
    public List<PedidoDTO> listarPedidos() {
        return pedidoService.listarPedidos();
    }

    @GetMapping("/{id}")
    public PedidoDTO obtenerPedido(@PathVariable Long id) {
        return pedidoService.obtenerPedido(id);
    }

    @PutMapping("/{id}")
    public PedidoDTO actualizarPedido(@PathVariable Long id, @RequestBody PedidoDTO pedido) {
        return pedidoService.actualizarPedido(id, pedido);
    }

    @DeleteMapping("/{id}")
    public void eliminarPedido(@PathVariable Long id) {
        pedidoService.eliminarPedido(id);
    }
}
