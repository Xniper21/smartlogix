package com.smartlogix.bff.client;

import lombok.Data;

@Data
public class ProductoDTO {
    private Long id;
    private String nombre;
    private int stock;
}