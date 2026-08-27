package com.backend.megatlon.config;

import com.backend.megatlon.models.Usuario;
import org.springframework.stereotype.Component;

import java.util.concurrent.ThreadLocalRandom;

@Component
public class CredentialGenerator {

    /**
     * Genera la contraseña plana bajo la regla:
     * - Con 2do nombre: primerNombre + segundoNombre + XX
     * - Sin 2do nombre: primerNombre + primerApellido + XX
     */
    public String generarPasswordPlana(Usuario usuario) {
        String pNombre = sanitizar(usuario.getPrimerNombre());
        String sNombre = sanitizar(usuario.getSegundoNombre());
        String pApellido = sanitizar(usuario.getPrimerApellido());

        // Genera un número aleatorio entre 10 y 99 inclusive
        int numeroAleatorio = ThreadLocalRandom.current().nextInt(10, 100);

        if (!sNombre.isEmpty()) {
            return pNombre + sNombre + numeroAleatorio;
        } else {
            return pNombre + pApellido + numeroAleatorio;
        }
    }

    /**
     * Normaliza el texto removiendo espacios y convirtiendo a minúsculas.
     */
    private String sanitizar(String texto) {
        if (texto == null) {
            return "";
        }
        return texto.trim().toLowerCase().replaceAll("\\s+", "");
    }
}