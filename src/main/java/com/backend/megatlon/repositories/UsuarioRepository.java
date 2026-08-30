package com.backend.megatlon.repositories;

import com.backend.megatlon.enums.RolNombre;
import com.backend.megatlon.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Consulta optimizada para cargar usuario + rol + sucursal base de una sola vez
    @Query("SELECT u FROM Usuario u JOIN FETCH u.rol JOIN FETCH u.sucursalBase WHERE u.ci = :ci")
    Optional<Usuario> findByCiWithRelations(@Param("ci") String ci);

    // Búsqueda simple
    Optional<Usuario> findByCi(String ci);

    // Validación rápida antes de registrar
    boolean existsByCi(String ci);

    // Listar por sucursal
    List<Usuario> findBySucursalBaseId(Long sucursalId);

    // Listar por rol
    List<Usuario> findByRolNombreRol(RolNombre nombreRol);
}