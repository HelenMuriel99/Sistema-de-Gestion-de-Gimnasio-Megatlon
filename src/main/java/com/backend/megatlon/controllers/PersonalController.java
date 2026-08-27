package com.backend.megatlon.controllers;

import com.backend.megatlon.dto.PersonalEliminarResponse;
import com.backend.megatlon.dto.PersonalListResponse;
import com.backend.megatlon.dto.PersonalRegistroRequest;
import com.backend.megatlon.dto.PersonalRegistroResponse;
import com.backend.megatlon.services.PersonalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/personal")
@RequiredArgsConstructor
public class PersonalController {

    private final PersonalService personalService;

    @PostMapping
    public ResponseEntity<PersonalRegistroResponse> registrarPersonal(@RequestBody PersonalRegistroRequest request) {
        return ResponseEntity.ok(personalService.registrarPersonal(request));
    }

    @GetMapping
    public ResponseEntity<List<PersonalListResponse>> listarPersonalActivo() {
        return ResponseEntity.ok(personalService.listarPersonalActivo());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<PersonalEliminarResponse> darDeBajaPersonal(@PathVariable Long id) {
        return ResponseEntity.ok(personalService.darDeBajaPersonal(id));
    }
}