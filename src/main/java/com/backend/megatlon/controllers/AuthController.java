package com.backend.megatlon.controllers;

import com.backend.megatlon.dto.SetupStatusResponse;
import com.backend.megatlon.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}