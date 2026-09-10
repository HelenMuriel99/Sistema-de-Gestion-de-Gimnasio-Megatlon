package com.backend.megatlon.controllers;

import com.backend.megatlon.dto.EmpleadoCreadoResponse;
import com.backend.megatlon.dto.RegistrarEmpleadoRequest;
import com.backend.megatlon.services.PropietarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/propietario")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PROPIETARIO')")
public class PropietarioController {

    private final PropietarioService propietarioService;

    @PostMapping("/empleados")
    public ResponseEntity<EmpleadoCreadoResponse> registrarEmpleado(@RequestBody RegistrarEmpleadoRequest request) {
        EmpleadoCreadoResponse response = propietarioService.registrarEmpleado(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}