package com.backend.megatlon.controllers;

import com.backend.megatlon.dto.DisciplinaRequest;
import com.backend.megatlon.dto.PlanRequest;
import com.backend.megatlon.models.Disciplina;
import com.backend.megatlon.models.Plan;
import com.backend.megatlon.services.CatalogoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/propietario/catalogo")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PROPIETARIO')")
public class PropietarioCatalogoController {

    private final CatalogoService catalogoService;

    // --- DISCIPLINAS ---
    @PostMapping("/disciplinas")
    public ResponseEntity<Disciplina> crearDisciplina(@Valid @RequestBody DisciplinaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(catalogoService.crearDisciplina(request));
    }

    @GetMapping("/disciplinas")
    public ResponseEntity<List<Disciplina>> listarDisciplinas() {
        return ResponseEntity.ok(catalogoService.listarDisciplinas());
    }

    // --- PLANES ---
    @PostMapping("/planes")
    public ResponseEntity<Plan> crearPlan(@Valid @RequestBody PlanRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(catalogoService.crearPlan(request));
    }

    @GetMapping("/planes")
    public ResponseEntity<List<Plan>> listarPlanes() {
        return ResponseEntity.ok(catalogoService.listarPlanes());
    }

    @PatchMapping("/planes/{id}/precio")
    public ResponseEntity<Plan> actualizarPrecioPlan(@PathVariable Long id, @RequestParam BigDecimal nuevoPrecio) {
        return ResponseEntity.ok(catalogoService.actualizarPrecioPlan(id, nuevoPrecio));
    }
}