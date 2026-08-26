package com.backend.megatlon.utils;

import com.backend.megatlon.dto.UserCredentials;
import java.util.concurrent.ThreadLocalRandom;

public class CredentialGenerator {

    private CredentialGenerator() {
        // Constructor privado para evitar instanciación
    }

    /**
     * Genera credenciales para un usuario basado en sus datos personales.
     *
     * @param ci CI del usuario (Username)
     * @param primerNombre Primer Nombre
     * @param segundoNombre Segundo Nombre (puede ser nulo o vacío)
     * @param primerApellido Primer Apellido
     * @return UserCredentials conteniendo username y la contraseña en texto plano.
     */
    public static UserCredentials generateCredentials(String ci, String primerNombre, String segundoNombre, String primerApellido) {
        // 1. Limpieza de strings
        String username = (ci != null) ? ci.trim() : "";
        String pNombre = (primerNombre != null) ? primerNombre.trim() : "";
        String sNombre = (segundoNombre != null) ? segundoNombre.trim() : "";
        String pApellido = (primerApellido != null) ? primerApellido.trim() : "";

        // 2. Generar número aleatorio de dos dígitos (10 a 99)
        int randomNumber = ThreadLocalRandom.current().nextInt(10, 100);

        // 3. Regla de negocio para construir el prefijo de la contraseña
        String basePassword;
        if (!sNombre.isEmpty()) {
            basePassword = pNombre + sNombre;
        } else {
            basePassword = pNombre + pApellido;
        }

        // 4. Formatear contraseña (eliminando espacios internos si existieran)
        String rawPassword = (basePassword + randomNumber).replaceAll("\\s+", "");

        return new UserCredentials(username, rawPassword);
    }
}