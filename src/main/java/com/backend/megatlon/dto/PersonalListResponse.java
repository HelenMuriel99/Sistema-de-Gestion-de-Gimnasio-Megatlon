package com.backend.megatlon.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class PersonalListResponse {
    private Long usuarioId;
    private String ci;
    private String primerNombre;
    private String segundoNombre;
    private String primerApellido;
    private String segundoApellido;
    private String nombreCompleto;
    private LocalDate fechaNacimiento;
    private String genero;
    private String telefono;
    private String direccion;
    private String rol;
    private String sucursal;
    private Long sucursalId;
    private BigDecimal salarioFijo;
    private String estadoAcceso;
}