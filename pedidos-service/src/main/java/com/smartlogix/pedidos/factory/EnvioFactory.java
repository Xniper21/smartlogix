package com.smartlogix.pedidos.factory;

import com.smartlogix.pedidos.model.Envio;
import com.smartlogix.pedidos.model.EnvioExpress;
import com.smartlogix.pedidos.model.EnvioNormal;

public class EnvioFactory {
    public static Envio crearEnvio(String tipoEnvio) {
        if ("express".equalsIgnoreCase(tipoEnvio)) {
            return new EnvioExpress();
        } else {
            return new EnvioNormal();
        }
    }
}