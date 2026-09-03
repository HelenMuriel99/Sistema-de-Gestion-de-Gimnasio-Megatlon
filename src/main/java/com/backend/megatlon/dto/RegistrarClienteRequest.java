package com.backend.megatlon.dto;

import jakarta.validation.constraints.NotBlank;
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

    //@NotBlank(message = "El CI es obligatorio")
    private String ci;

    //@NotBlank(message = "El primer nombre es obligatorio")
    private String primerNombre;

    private String segundoNombre;

    //@NotBlank(message = "El primer apellido es obligatorio")
    private String primerApellido;

    private String segundoApellido;

    //@NotNull(message = "La fecha de nacimiento es obligatoria")
    private LocalDate fechaNacimiento;

    //@NotBlank(message = "El género es obligatorio")
    private String genero;

    private String telefono;
    private String direccion;
}