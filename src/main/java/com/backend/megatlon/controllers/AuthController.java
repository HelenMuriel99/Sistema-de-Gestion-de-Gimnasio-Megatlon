package com.backend.megatlon.controllers;

import com.backend.megatlon.dto.SetupStatusResponse;
import com.backend.megatlon.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.backend.megatlon.dto.SetupOwnerRequest;
import com.backend.megatlon.dto.SetupOwnerResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @GetMapping("/setup-status")
    public ResponseEntity<SetupStatusResponse> getSetupStatus() {
        SetupStatusResponse response = authService.checkSetupStatus();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/setup")
    public ResponseEntity<SetupOwnerResponse> registerInitialOwner(@Valid @RequestBody SetupOwnerRequest request) {
        SetupOwnerResponse response = authService.registerInitialOwner(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}