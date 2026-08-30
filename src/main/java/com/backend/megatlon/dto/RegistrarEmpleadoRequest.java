package com.backend.megatlon.dto;

import com.backend.megatlon.enums.RolNombre;
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
public class RegistrarEmpleadoRequest {
    private String ci;
    private String primerNombre;
    private String segundoNombre;
    private String primerApellido;
    private String segundoApellido;
    private LocalDate fechaNacimiento;
    private String genero;
    private String telefono;
    private String direccion;
    private RolNombre rolNombre; // RECEPCIONISTA o INSTRUCTOR
    private Long sucursalBaseId;
    private BigDecimal salarioFijo; // Opcional (si no viene, toma el valor por defecto 3350.00)
}