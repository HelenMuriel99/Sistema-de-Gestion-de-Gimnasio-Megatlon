package com.backend.megatlon.dto;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ActualizarClienteRequest {
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
    // Campos opcionales para corregir/actualizar el plan
    private Long planId;
    private Long disciplinaId;
}