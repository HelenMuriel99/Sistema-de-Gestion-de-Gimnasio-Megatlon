package com.backend.megatlon.repositories;

import com.backend.megatlon.models.Disciplina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisciplinaRepository extends JpaRepository<Disciplina, Long> {
    boolean existsByNombreIgnoreCase(String nombre);
    List<Disciplina> findByActivaTrue();
}