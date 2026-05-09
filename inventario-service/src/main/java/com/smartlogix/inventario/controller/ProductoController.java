package com.smartlogix.inventario.controller;

import com.smartlogix.inventario.model.Producto;
import com.smartlogix.inventario.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/productos")
@RequiredArgsConstructor
public class ProductoController {
    private final ProductoService productoService;

    @GetMapping
    public List<Producto> listarProductos() {
        return productoService.listarProductos();
    }

    @PostMapping
    public Producto crearProducto(@RequestBody Producto producto) {
        return productoService.guardarProducto(producto);
    }

    @PutMapping("/{id}")
    public Producto actualizarProducto(@PathVariable Long id, @RequestBody Producto producto) {
        producto.setId(id);
        return productoService.guardarProducto(producto);
    }

    @GetMapping("/stock/{id}/{cantidad}")
    public boolean verificarStock(@PathVariable Long id, @PathVariable int cantidad) {
        return productoService.verificarStock(id, cantidad);
    }
}