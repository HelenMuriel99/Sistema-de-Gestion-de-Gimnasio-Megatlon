package com.backend.megatlon.dto;

import com.backend.megatlon.enums.RolNombre;
import jakarta.validation.constraints.Pattern;
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

    @Pattern(regexp = "^[A-Za-z]{0,2}$", message = "El complemento debe tener máximo 2 letras")
    private String complementoCi;
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