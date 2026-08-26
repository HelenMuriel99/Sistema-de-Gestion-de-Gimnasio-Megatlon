package com.backend.megatlon.dto;

import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SetupOwnerRequest(

        @NotBlank(message = "El CI es obligatorio")
        String ci,

        @NotBlank(message = "El primer nombre es obligatorio")
        String primerNombre,

        String segundoNombre,

        @NotBlank(message = "El primer apellido es obligatorio")
        String primerApellido,

        String segundoApellido,

        @NotNull(message = "La fecha de nacimiento es obligatoria")
        LocalDate fechaNacimiento,

        @NotBlank(message = "El género es obligatorio")
        String genero,
        String telefono,
        String direccion,
        Long sucursalBaseId // Opcional: ID de la sucursal inicial (ej. sucursal 1)
) {}