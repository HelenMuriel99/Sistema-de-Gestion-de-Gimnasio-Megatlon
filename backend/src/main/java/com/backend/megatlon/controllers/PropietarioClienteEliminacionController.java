package com.backend.megatlon.controllers;

import com.backend.megatlon.dto.EliminacionUsuarioResponse;
import com.backend.megatlon.services.ClienteEliminacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/propietario/gestion/clientes")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PROPIETARIO')")
public class PropietarioClienteEliminacionController {

    private final ClienteEliminacionService clienteEliminacionService;

    @DeleteMapping("/{ci}")
    public ResponseEntity<EliminacionUsuarioResponse> desactivarCliente(
            @PathVariable String ci,
            Authentication authentication
    ) {
        String ciPropietario = authentication.getName();
        EliminacionUsuarioResponse response = clienteEliminacionService.desactivarClientePorCi(ci, ciPropietario);
        return ResponseEntity.ok(response);
    }
}