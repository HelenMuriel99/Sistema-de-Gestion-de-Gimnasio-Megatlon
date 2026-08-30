package com.backend.megatlon.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/instructor")
@RequiredArgsConstructor
@PreAuthorize("hasRole('INSTRUCTOR')")
public class InstructorController {

    @GetMapping("/bienvenida")
    public ResponseEntity<Map<String, String>> bienvenidaInstructor(Authentication authentication) {
        return ResponseEntity.ok(Map.of(
                "mensaje", "¡Bienvenido al Panel de Instructor!",
                "usuario", authentication.getName(),
                "rol", "INSTRUCTOR"
        ));
    }
}