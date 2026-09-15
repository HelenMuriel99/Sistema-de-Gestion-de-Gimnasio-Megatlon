package com.backend.megatlon.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DisciplinaRequest {
    @NotBlank(message = "El nombre de la disciplina es obligatorio")
    private String nombre;
    private String descripcion;
}