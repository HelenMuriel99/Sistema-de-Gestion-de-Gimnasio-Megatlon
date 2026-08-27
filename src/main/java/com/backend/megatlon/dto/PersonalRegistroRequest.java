package com.backend.megatlon.dto;

import com.backend.megatlon.enums.RolNombre;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PersonalRegistroRequest {
    private String ci;
    private String primerNombre;
    private String segundoNombre;
    private String primerApellido;
    private String segundoApellido;
    private LocalDate fechaNacimiento;
    private String genero;
    private String telefono;
    private String direccion;
    private Long sucursalBaseId;
    private RolNombre rol; // RECEPCIONISTA o INSTRUCTOR
    private BigDecimal salarioFijo;
}
