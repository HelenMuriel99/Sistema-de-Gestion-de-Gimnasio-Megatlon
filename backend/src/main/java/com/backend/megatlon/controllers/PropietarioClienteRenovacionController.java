package com.backend.megatlon.controllers;

import com.backend.megatlon.dto.ClienteResponse;
import com.backend.megatlon.dto.RenovarMembresiaRequest;
import com.backend.megatlon.services.MembresiaRenovacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/propietario/clientes")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PROPIETARIO')")
public class PropietarioClienteRenovacionController {

    private final MembresiaRenovacionService membresiaRenovacionService;

    @PutMapping("/{ci}/renovar-plan")
    public ResponseEntity<ClienteResponse> renovarPlan(
            @PathVariable String ci,
            @Valid @RequestBody RenovarMembresiaRequest request,
            Authentication authentication
    ) {
        String ciPropietario = authentication.getName();
        return ResponseEntity.ok(membresiaRenovacionService.renovarPlanCliente(ci, request, ciPropietario));
    }
}