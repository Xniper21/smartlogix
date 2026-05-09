package com.smartlogix.bff.controller;

import com.smartlogix.bff.client.EnvioDTO;
import com.smartlogix.bff.dto.DashboardStats;
import com.smartlogix.bff.service.EnviosService;
import com.smartlogix.bff.service.InventarioService;
import com.smartlogix.bff.service.PedidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class DashboardController {

    private final PedidoService pedidoService;
    private final InventarioService inventarioService;
    private final EnviosService enviosService;

    @GetMapping("/dashboard")
    public DashboardStats obtenerDashboard() {
        List<com.smartlogix.bff.client.PedidoDTO> pedidos = pedidoService.listarPedidos();
        List<com.smartlogix.bff.client.ProductoDTO> productos = inventarioService.obtenerProductos();
        List<EnvioDTO> envios = enviosService.listarEnvios();

        DashboardStats stats = new DashboardStats();
        long totalPedidos = pedidos.size();
        long totalEntregados = pedidos.stream()
                .filter(p -> p.getEstado() != null && p.getEstado().equalsIgnoreCase("ENTREGADO"))
                .count();
        long pedidosExpress = pedidos.stream()
                .filter(p -> p.getTipoEnvio() != null && p.getTipoEnvio().equalsIgnoreCase("express"))
                .count();
        long pedidosNormal = pedidos.stream()
                .filter(p -> p.getTipoEnvio() != null && p.getTipoEnvio().equalsIgnoreCase("normal"))
                .count();

        long gananciaEstimacion = pedidos.stream().mapToLong(p -> {
            if (p.getCantidad() <= 0) {
                return 0L;
            }
            if (p.getTipoEnvio() != null && p.getTipoEnvio().equalsIgnoreCase("express")) {
                return p.getCantidad() * 15000L;
            }
            return p.getCantidad() * 9000L;
        }).sum();

        long productosAgotados = productos.stream()
                .filter(p -> p.getStock() <= 0)
                .count();

        long enviosTotales = envios.size();
        long enviosEntregados = envios.stream()
                .filter(e -> e.getEstado() != null && e.getEstado().equalsIgnoreCase("ENTREGADO"))
                .count();
        long enviosPendientes = enviosTotales - enviosEntregados;

        stats.setTotalPedidos(totalPedidos);
        stats.setTotalEntregados(totalEntregados);
        stats.setTotalPendientes(totalPedidos - totalEntregados);
        stats.setPedidosExpress(pedidosExpress);
        stats.setPedidosNormal(pedidosNormal);
        stats.setTotalProductos(productos.size());
        stats.setProductosAgotados(productosAgotados);
        stats.setEnviosTotales(enviosTotales);
        stats.setEnviosEntregados(enviosEntregados);
        stats.setEnviosPendientes(enviosPendientes);
        stats.setGananciaEstimacion(gananciaEstimacion);

        return stats;
    }
}
