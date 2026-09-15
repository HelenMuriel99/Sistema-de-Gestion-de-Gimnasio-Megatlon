package com.backend.megatlon.config;

import com.backend.megatlon.models.Usuario;
import org.springframework.stereotype.Component;

import java.util.concurrent.ThreadLocalRandom;

@Component
public class CredentialGenerator {

    /**
     * Genera la contraseña plana bajo las reglas:
     * - Con 2do nombre: primerNombre + segundoNombre + XX
     * - Sin 2do nombre y con 1er apellido: primerNombre + primerApellido + XX
     * - Sin 2do nombre, sin 1er apellido pero con 2do apellido: primerNombre + segundoApellido + XX
     */
    public String generarPasswordPlana(Usuario usuario) {
        String pNombre = sanitizar(usuario.getPrimerNombre());
        String sNombre = sanitizar(usuario.getSegundoNombre());
        String pApellido = sanitizar(usuario.getPrimerApellido());
        String sApellido = sanitizar(usuario.getSegundoApellido());

        // Genera un número aleatorio entre 10 y 99 inclusive
        int numeroAleatorio = ThreadLocalRandom.current().nextInt(10, 100);

        if (!sNombre.isEmpty()) {
            return pNombre + sNombre + numeroAleatorio;
        } else if (!pApellido.isEmpty()) {
            return pNombre + pApellido + numeroAleatorio;
        } else if (!sApellido.isEmpty()) {
            return pNombre + sApellido + numeroAleatorio;
        } else {
            return pNombre + numeroAleatorio;
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