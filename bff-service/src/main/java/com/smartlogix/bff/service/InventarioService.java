package com.smartlogix.bff.service;

import com.smartlogix.bff.client.InventarioClient;
import com.smartlogix.bff.client.ProductoDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventarioService {
    private final InventarioClient inventarioClient;

    public List<ProductoDTO> obtenerProductos() {
        return inventarioClient.listarProductos();
    }

    public boolean verificarDisponibilidad(Long productoId, int cantidad) {
        return inventarioClient.verificarStock(productoId, cantidad);
    }
}