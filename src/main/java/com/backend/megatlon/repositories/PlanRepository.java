package com.backend.megatlon.repositories;

import com.backend.megatlon.models.Disciplina;
import com.backend.megatlon.models.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Long> {
    List<Disciplina> findByActivoTrue();
}