package com.backend.megatlon.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmpleadoResumenResponse {
    private Long id;
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
    private Long sucursalId;
    private String sucursalNombre;
    private Integer intentosFallidos;
    private String estadoAcceso;
    private BigDecimal salarioFijo;
}