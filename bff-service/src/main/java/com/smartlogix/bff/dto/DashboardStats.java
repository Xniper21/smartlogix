package com.smartlogix.bff.dto;

import lombok.Data;

@Data
public class DashboardStats {
    private long totalPedidos;
    private long totalEntregados;
    private long totalPendientes;
    private long pedidosExpress;
    private long pedidosNormal;
    private long totalProductos;
    private long productosAgotados;
    private long enviosTotales;
    private long enviosPendientes;
    private long enviosEntregados;
    private long gananciaEstimacion;
}
