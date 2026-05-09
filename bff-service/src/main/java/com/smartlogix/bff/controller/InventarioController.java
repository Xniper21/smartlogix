package com.smartlogix.bff.controller;

import com.smartlogix.bff.client.ProductoDTO;
import com.smartlogix.bff.service.InventarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/inventario")
@RequiredArgsConstructor
public class InventarioController {
    private final InventarioService inventarioService;

    @GetMapping("/productos")
    public List<ProductoDTO> listarProductos() {
        return inventarioService.obtenerProductos();
    }

    @GetMapping("/disponible/{productoId}/{cantidad}")
    public boolean verificarDisponibilidad(
            @PathVariable Long productoId,
            @PathVariable int cantidad) {
        return inventarioService.verificarDisponibilidad(productoId, cantidad);
    }
}