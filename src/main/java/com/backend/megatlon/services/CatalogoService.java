package com.backend.megatlon.services;

import com.backend.megatlon.dto.DisciplinaRequest;
import com.backend.megatlon.dto.PlanRequest;
import com.backend.megatlon.models.Disciplina;
import com.backend.megatlon.models.Plan;
import com.backend.megatlon.repositories.DisciplinaRepository;
import com.backend.megatlon.repositories.PlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CatalogoService {

    private final DisciplinaRepository disciplinaRepository;
    private final PlanRepository planRepository;

    // --- DISCIPLINAS ---
    @Transactional
    public Disciplina crearDisciplina(DisciplinaRequest request) {
        if (disciplinaRepository.existsByNombreIgnoreCase(request.getNombre())) {
            throw new IllegalArgumentException("Ya existe una disciplina con el nombre: " + request.getNombre());
        }
        Disciplina disciplina = Disciplina.builder()
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .activa(true)
                .build();
        return disciplinaRepository.save(disciplina);
    }

    @Transactional(readOnly = true)
    public List<Disciplina> listarDisciplinas() {
        return disciplinaRepository.findAll();
    }

    // --- PLANES ---
    @Transactional
    public Plan crearPlan(PlanRequest request) {
        Plan plan = Plan.builder()
                .nombre(request.getNombre())
                .tipoPlan(request.getTipoPlan())
                .precio(request.getPrecio())
                .duracionDias(request.getDuracionDias())
                .activo(true)
                .build();
        return planRepository.save(plan);
    }

    @Transactional
    public Plan actualizarPrecioPlan(Long planId, BigDecimal nuevoPrecio) {
        Plan plan = planRepository.findById(planId)
                .orElseThrow(() -> new IllegalArgumentException("Plan no encontrado con ID: " + planId));
        plan.setPrecio(nuevoPrecio);
        return planRepository.save(plan);
    }

    @Transactional(readOnly = true)
    public List<Plan> listarPlanes() {
        return planRepository.findAll();
    }
}