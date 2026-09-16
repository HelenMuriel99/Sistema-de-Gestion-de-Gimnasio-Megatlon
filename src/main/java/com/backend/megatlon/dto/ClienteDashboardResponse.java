package com.backend.megatlon.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ClienteDashboardResponse {
    private String mensaje;
    private String ci;
    private String nombreCliente;
    private String sucursalNombre;
    private String estadoAcceso;

    // Información de Membresía
    private String planNombre;
    private String tipoPlan;
    private String disciplinaNombre;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private long diasRestantes;
}