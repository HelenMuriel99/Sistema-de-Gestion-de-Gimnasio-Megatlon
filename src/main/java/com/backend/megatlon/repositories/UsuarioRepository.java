package com.backend.megatlon.repositories;

import com.backend.megatlon.enums.RolNombre;
import com.backend.megatlon.models.Rol;
import com.backend.megatlon.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Búsqueda por CI para Login y consultas específicas (0 o 1 resultado)
    Optional<Usuario> findByCi(String ci);

    // Validación rápida antes de registrar para evitar CIs duplicados
    boolean existsByCi(String ci);

    // Listar usuarios filtrados por Sucursal
    List<Usuario> findBySucursalBaseId(Long sucursalId);

    // Listar usuarios filtrados por Rol (ej: todos los CLIENTE)
    List<Usuario> findByRolNombreRol(RolNombre nombreRol);

    //Verifica de forma eficiente si existe al menos un usuario PROPIETARIO
    boolean existsByRolNombreRol(RolNombre nombreRol);

    boolean existsByRol(Rol rolAdmin);
}