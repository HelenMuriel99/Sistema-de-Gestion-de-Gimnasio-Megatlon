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
@RequestMapping("/api/v1/recepcionista")
@RequiredArgsConstructor
@PreAuthorize("hasRole('RECEPCIONISTA')")
public class RecepcionistaController {

    @GetMapping("/bienvenida")
    public ResponseEntity<Map<String, String>> bienvenidaRecepcionista(Authentication authentication) {
        return ResponseEntity.ok(Map.of(
                "mensaje", "¡Bienvenida al Panel de Recepción!",
                "usuario", authentication.getName(),
                "rol", "RECEPCIONISTA"
        ));
    }
}