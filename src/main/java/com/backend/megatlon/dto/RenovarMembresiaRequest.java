package com.backend.megatlon.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RenovarMembresiaRequest {

    @NotNull(message = "El ID del plan es obligatorio")
    private Long planId;

    // Solo obligatorio si el plan seleccionado es ESPECIFICO
    private Long disciplinaId;
}