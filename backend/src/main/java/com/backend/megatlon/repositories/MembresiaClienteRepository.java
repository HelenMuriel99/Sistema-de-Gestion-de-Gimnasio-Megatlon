package com.backend.megatlon.repositories;

import com.backend.megatlon.models.MembresiaCliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MembresiaClienteRepository extends JpaRepository<MembresiaCliente, Long> {

    @Query("SELECT m FROM MembresiaCliente m " +
            "JOIN FETCH m.plan " +
            "LEFT JOIN FETCH m.disciplina " +
            "WHERE m.cliente.id = :clienteId")
    Optional<MembresiaCliente> findByClienteIdWithRelations(@Param("clienteId") Long clienteId);
}