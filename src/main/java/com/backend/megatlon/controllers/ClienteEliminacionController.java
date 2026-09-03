package com.backend.megatlon.controllers;

import com.backend.megatlon.dto.EliminacionUsuarioResponse;
import com.backend.megatlon.services.ClienteEliminacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/recepcionista/gestion/clientes")
@RequiredArgsConstructor
@PreAuthorize("hasRole('RECEPCIONISTA')")
public class ClienteEliminacionController {

    private final ClienteEliminacionService clienteEliminacionService;

    @DeleteMapping("/{ci}")
    public ResponseEntity<EliminacionUsuarioResponse> desactivarCliente(
            @PathVariable String ci,
            Authentication authentication
    ) {
        String ciRecepcionista = authentication.getName();
        EliminacionUsuarioResponse response = clienteEliminacionService.desactivarClientePorCi(ci, ciRecepcionista);
        return ResponseEntity.ok(response);
    }
}