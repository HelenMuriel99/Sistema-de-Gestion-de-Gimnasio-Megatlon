package com.backend.megatlon.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PersonalEliminarResponse {
    private Long usuarioId;
    private String ci;
    private String nombreCompleto;
    private String estadoAcceso;
    private String mensaje;
}