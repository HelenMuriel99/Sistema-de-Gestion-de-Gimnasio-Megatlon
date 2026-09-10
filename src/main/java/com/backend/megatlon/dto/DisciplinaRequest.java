package com.backend.megatlon.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DisciplinaRequest {

    private String nombre;
    private String descripcion;
}