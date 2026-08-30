package com.backend.megatlon.controllers;

import com.backend.megatlon.dto.ActualizarEmpleadoRequest;
import com.backend.megatlon.dto.EmpleadoResumenResponse;
import com.backend.megatlon.services.PropietarioEdicionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/propietario/gestion")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PROPIETARIO')")
public class PropietarioEdicionController {

    private final PropietarioEdicionService propietarioEdicionService;

    @PutMapping("/usuarios/{ci}")
    public ResponseEntity<EmpleadoResumenResponse> actualizarUsuario(
            @PathVariable String ci,
            @RequestBody ActualizarEmpleadoRequest request
    ) {
        return ResponseEntity.ok(propietarioEdicionService.actualizarUsuario(ci, request));
    }
}