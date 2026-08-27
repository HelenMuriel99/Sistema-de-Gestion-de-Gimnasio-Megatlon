package com.backend.megatlon.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PropietarioSetupResponse {
    private Long id;
    private String ci;
    private String primerNombre;
    private String primerApellido;
    private String rol;
    private String estadoAcceso;
    private String passwordGenerada; // Contraseña plana mostrada solo al crear
    private String mensaje;
}