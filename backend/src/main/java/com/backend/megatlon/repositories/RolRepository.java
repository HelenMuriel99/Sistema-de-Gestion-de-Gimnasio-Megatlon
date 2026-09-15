package com.backend.megatlon.repositories;

import com.backend.megatlon.enums.RolNombre;
import com.backend.megatlon.models.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RolRepository extends JpaRepository<Rol, Long> {

    // Buscar rol por su Enum (0 o 1 resultado)
    Optional<Rol> findByNombreRol(RolNombre nombreRol);

    // Verificar existencia para el DataInitializer
    boolean existsByNombreRol(RolNombre nombreRol);

    // Obtener todos los roles EXCEPTO el indicado (útil para ocultar PROPIETARIO a recepcionistas)
    List<Rol> findByNombreRolNot(RolNombre nombreRol);
}