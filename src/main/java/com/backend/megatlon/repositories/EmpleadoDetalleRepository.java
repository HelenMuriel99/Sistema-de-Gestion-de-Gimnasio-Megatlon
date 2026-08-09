package com.backend.megatlon.repositories;

import com.backend.megatlon.models.EmpleadoDetalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmpleadoDetalleRepository extends JpaRepository<EmpleadoDetalle, Long> {

    // Obtener el detalle de salario a partir del ID del usuario (0 o 1 resultado)
    Optional<EmpleadoDetalle> findByUsuarioId(Long usuarioId);

    // Verificar si un usuario ya tiene registro de empleado
    boolean existsByUsuarioId(Long usuarioId);
}