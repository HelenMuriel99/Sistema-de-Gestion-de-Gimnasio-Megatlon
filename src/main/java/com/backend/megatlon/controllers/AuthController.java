package com.backend.megatlon.controllers;

import com.backend.megatlon.dto.*;
import com.backend.megatlon.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // Endpoint 1: Registro del Propietario inicial
    @PostMapping("/admin/setup")
    public ResponseEntity<PropietarioSetupResponse> setupPropietario(@RequestBody PropietarioSetupRequest request) {
        return ResponseEntity.ok(authService.registrarPropietario(request));
    }

    // Endpoint 2: Login de credenciales
    @PostMapping("/admin/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}