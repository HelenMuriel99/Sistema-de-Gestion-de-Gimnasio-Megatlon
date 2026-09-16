package com.backend.megatlon.controllers;

import com.backend.megatlon.dto.ClienteDashboardResponse;
import com.backend.megatlon.services.ClienteDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/cliente")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CLIENTE')")
public class ClienteDashboardController {

    private final ClienteDashboardService clienteDashboardService;

    @GetMapping("/bienvenida")
    public ResponseEntity<ClienteDashboardResponse> bienvenidaCliente(Authentication authentication) {
        String ciCliente = authentication.getName();
        return ResponseEntity.ok(clienteDashboardService.obtenerDashboardCliente(ciCliente));
    }
}