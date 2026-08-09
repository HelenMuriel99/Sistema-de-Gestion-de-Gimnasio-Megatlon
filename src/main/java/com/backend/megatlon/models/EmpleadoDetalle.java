package com.backend.megatlon.models;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

//Se va a definir el nombre de la tabla
@Entity
@Table(name = "empleado_detalle")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmpleadoDetalle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    @Builder.Default
    @Column(name = "salario_fijo", nullable = false, precision = 10, scale = 2)
    private BigDecimal salarioFijo = new BigDecimal("3350.00");
}