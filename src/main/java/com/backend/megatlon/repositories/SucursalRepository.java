package com.backend.megatlon.repositories;

import com.backend.megatlon.models.Sucursal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SucursalRepository extends JpaRepository<Sucursal, Long> {
    // Hereda findAll(), findById(), save(), deleteById() directamente de JpaRepository
}