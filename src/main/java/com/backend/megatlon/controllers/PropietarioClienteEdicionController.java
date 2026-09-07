package com.backend.megatlon.controllers;

import com.backend.megatlon.dto.ActualizarClienteRequest;
import com.backend.megatlon.dto.ClienteResponse;
import com.backend.megatlon.services.ClienteEdicionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/propietario/gestion/clientes")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PROPIETARIO')")
public class PropietarioClienteEdicionController {

    private final ClienteEdicionService clienteEdicionService;

    @PutMapping("/{ci}")
    public ResponseEntity<ClienteResponse> actualizarCliente(
            @PathVariable String ci,
            @RequestBody ActualizarClienteRequest request,
            Authentication authentication
    ) {
        String ciPropietario = authentication.getName();
        return ResponseEntity.ok(clienteEdicionService.actualizarCliente(ci, request, ciPropietario));
    }
}