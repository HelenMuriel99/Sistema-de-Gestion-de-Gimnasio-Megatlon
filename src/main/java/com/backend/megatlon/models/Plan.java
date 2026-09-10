package com.backend.megatlon.models;

import com.backend.megatlon.enums.TipoPlan;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "planes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Plan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoPlan tipoPlan;

    @Column(nullable = false)
    private BigDecimal precio;

    // Duración en días (ejemplo: 30 para FULL/ESPECÍFICO, 1 para SESIÓN)
    @Column(nullable = false)
    private Integer duracionDias;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;
}