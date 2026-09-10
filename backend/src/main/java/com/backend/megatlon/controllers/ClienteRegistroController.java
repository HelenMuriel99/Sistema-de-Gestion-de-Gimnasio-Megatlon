package com.backend.megatlon.controllers;

import com.backend.megatlon.dto.ClienteResponse;
import com.backend.megatlon.dto.RegistrarClienteRequest;
import com.backend.megatlon.services.ClienteRegistroService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/recepcionista/clientes")
@RequiredArgsConstructor
@PreAuthorize("hasRole('RECEPCIONISTA')")
public class ClienteRegistroController {

    private final ClienteRegistroService clienteRegistroService;

    @PostMapping
    public ResponseEntity<ClienteResponse> registrarCliente(
            @Valid @RequestBody RegistrarClienteRequest request,
            Authentication authentication
    ) {
        String ciRecepcionista = authentication.getName();
        ClienteResponse response = clienteRegistroService.registrarCliente(request, ciRecepcionista);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}