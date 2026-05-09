package com.smartlogix.inventario.service;

import com.smartlogix.inventario.model.Producto;
import com.smartlogix.inventario.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoService {
    private final ProductoRepository productoRepository;

    public List<Producto> listarProductos() {
        return productoRepository.findAll();
    }

    public Producto guardarProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    public boolean verificarStock(Long productoId, int cantidad) {
        Producto producto = productoRepository.findById(productoId).orElse(null);
        return producto != null && producto.getStock() >= cantidad;
    }
}