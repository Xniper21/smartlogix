package com.smartlogix.pedidos.model;

public class EnvioNormal implements Envio {
    @Override
    public String procesarEnvio() {
        return "Envío normal en 3 días";
    }
}