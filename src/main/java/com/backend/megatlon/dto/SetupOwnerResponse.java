package com.backend.megatlon.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SetupOwnerResponse(
        Long id,
        String ci,
        String primerNombre,
        String primerApellido,
        String username,
        String rawPassword,
        String message
) {}