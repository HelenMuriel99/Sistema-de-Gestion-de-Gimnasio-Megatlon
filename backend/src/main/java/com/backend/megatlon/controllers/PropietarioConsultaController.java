package com.backend.megatlon.controllers;

import com.backend.megatlon.dto.EmpleadoResumenResponse;
import com.backend.megatlon.enums.EstadoAcceso;
import com.backend.megatlon.enums.RolNombre;
import com.backend.megatlon.services.PropietarioConsultaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/propietario/consultas")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PROPIETARIO')")
public class PropietarioConsultaController {

    private final PropietarioConsultaService propietarioConsultaService;

    // Listar todos los usuarios con filtros opcionales (QueryParams)
    @GetMapping("/usuarios")
    public ResponseEntity<List<EmpleadoResumenResponse>> listarUsuarios(
            @RequestParam(required = false) Long sucursalId,
            @RequestParam(required = false) RolNombre rol,
            @RequestParam(required = false) EstadoAcceso estadoAcceso
    ) {
        return ResponseEntity.ok(propietarioConsultaService.listarUsuarios(sucursalId, rol, estadoAcceso));
    }

    // Buscar a un usuario específico por su CI
    @GetMapping("/usuarios/{ci}")
    public ResponseEntity<EmpleadoResumenResponse> obtenerUsuarioPorCi(@PathVariable String ci) {
        return ResponseEntity.ok(propietarioConsultaService.obtenerPorCi(ci));
    }
}