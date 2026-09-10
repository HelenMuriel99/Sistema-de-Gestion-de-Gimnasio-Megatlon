package com.backend.megatlon.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegistrarClienteRequest {

    private String ci;
    private String primerNombre;
    private String segundoNombre;
    private String primerApellido;
    private String segundoApellido;
    private LocalDate fechaNacimiento;
    private String genero;
    private String telefono;
    private String direccion;

    // --- DATOS DE MEMBRESÍA ---
    @NotNull(message = "El ID del plan es obligatorio")
    private Long planId;

    // Solo obligatorio si el plan seleccionado es ESPECIFICO
    private Long disciplinaId;
}