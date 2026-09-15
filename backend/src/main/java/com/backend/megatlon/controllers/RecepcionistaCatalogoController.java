package com.backend.megatlon.controllers;

import com.backend.megatlon.models.Disciplina;
import com.backend.megatlon.models.Plan;
import com.backend.megatlon.services.CatalogoConsultaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recepcionista/catalogo")
@RequiredArgsConstructor
public class RecepcionistaCatalogoController {

    private final CatalogoConsultaService catalogoConsultaService;

    @GetMapping("/disciplinas")
    public ResponseEntity<List<Disciplina>> listarDisciplinas() {
        return ResponseEntity.ok(catalogoConsultaService.listarDisciplinas());
    }

    @GetMapping("/planes")
    public ResponseEntity<List<Plan>> listarPlanes() {
        return ResponseEntity.ok(catalogoConsultaService.listarPlanes());
    }
}