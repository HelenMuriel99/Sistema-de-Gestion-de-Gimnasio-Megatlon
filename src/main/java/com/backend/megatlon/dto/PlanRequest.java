package com.backend.megatlon.dto;

import com.backend.megatlon.enums.TipoPlan;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PlanRequest {
    @NotNull(message = "El nombre del plan es obligatorio")
    private String nombre;

    @NotNull(message = "El tipo de plan es obligatorio (FULL, ESPECIFICO, SESION)")
    private TipoPlan tipoPlan;

    @NotNull(message = "El precio es obligatorio")
    @Positive(message = "El precio debe ser un monto positivo")
    private BigDecimal precio;

    @NotNull(message = "La duración en días es obligatoria")
    @Positive(message = "La duración debe ser al menos 1 día")
    private Integer duracionDias;
}