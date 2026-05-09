package com.smartlogix.pedidos.model;

public class EnvioExpress implements Envio {
    @Override
    public String procesarEnvio() {
        return "Envío express en 24 horas";
    }
}