package com.backend.megatlon.controllers;

import com.backend.megatlon.dto.ClienteResponse;
import com.backend.megatlon.dto.RegistrarClienteRequest;
import com.backend.megatlon.services.PropietarioClienteRegistroService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/propietario/clientes")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PROPIETARIO')")
public class PropietarioClienteRegistroController {

    private final PropietarioClienteRegistroService propietarioClienteRegistroService;

    @PostMapping
    public ResponseEntity<ClienteResponse> registrarCliente(
            @Valid @RequestBody RegistrarClienteRequest request,
            @RequestParam Long sucursalId
    ) {
        ClienteResponse response = propietarioClienteRegistroService.registrarCliente(request, sucursalId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}