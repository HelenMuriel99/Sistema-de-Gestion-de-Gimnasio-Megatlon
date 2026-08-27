package com.backend.megatlon.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PersonalRegistroResponse {
    private Long usuarioId;
    private String ci;
    private String nombreCompleto;
    private String rol;
    private String sucursal;
    private BigDecimal salarioFijo;
    private String estadoAcceso;
    private String passwordGenerada; // Para mostrar al propietario
    private String mensaje;
}