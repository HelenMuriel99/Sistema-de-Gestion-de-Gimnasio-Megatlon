package com.backend.megatlon.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sucursal")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sucursal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 255)
    private String direccion;

    @Column(length = 20)
    private String telefono;

    @Builder.Default
    @Column(name = "activo", nullable = false)
    private Boolean activo = true;
}