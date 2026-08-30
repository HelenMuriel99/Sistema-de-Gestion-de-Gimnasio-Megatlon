package com.backend.megatlon.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmpleadoCreadoResponse {
    private Long id;
    private String ci;
    private String nombreCompleto;
    private String rol;
    private String sucursal;
    private String passwordGeneradaPlana; // Se devuelve al Propietario para ser entregada al empleado
    private String estadoAcceso;
    private BigDecimal salarioFijo;
}