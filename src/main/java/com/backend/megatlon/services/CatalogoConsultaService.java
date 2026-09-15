package com.backend.megatlon.services;

import com.backend.megatlon.models.Disciplina;
import com.backend.megatlon.models.Plan;
import com.backend.megatlon.repositories.DisciplinaRepository;
import com.backend.megatlon.repositories.PlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CatalogoConsultaService {

    private final DisciplinaRepository disciplinaRepository;
    private final PlanRepository planRepository;

    @Transactional(readOnly = true)
    public List<Disciplina> listarDisciplinas() {
        return disciplinaRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Plan> listarPlanes() {
        return planRepository.findAll();
    }
}