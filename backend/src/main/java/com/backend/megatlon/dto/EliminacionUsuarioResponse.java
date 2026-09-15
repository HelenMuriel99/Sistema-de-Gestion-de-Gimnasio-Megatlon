package com.backend.megatlon.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EliminacionUsuarioResponse {
    private String ci;
    private String nombreCompleto;
    private String estadoAccesoPrevio;
    private String estadoAccesoNuevo;
    private String mensaje;
}