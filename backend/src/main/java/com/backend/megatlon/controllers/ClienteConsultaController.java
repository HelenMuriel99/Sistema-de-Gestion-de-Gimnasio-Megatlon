package com.backend.megatlon.controllers;

import com.backend.megatlon.dto.ClienteResponse;
import com.backend.megatlon.enums.EstadoAcceso;
import com.backend.megatlon.services.ClienteConsultaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recepcionista/consultas/clientes")
@RequiredArgsConstructor
@PreAuthorize("hasRole('RECEPCIONISTA')")
public class ClienteConsultaController {

    private final ClienteConsultaService clienteConsultaService;

    // Listar todos los clientes pertenecientes a la sucursal de la recepcionista
    @GetMapping
    public ResponseEntity<List<ClienteResponse>> listarClientes(
            @RequestParam(required = false) EstadoAcceso estadoAcceso,
            Authentication authentication
    ) {
        String ciRecepcionista = authentication.getName();
        return ResponseEntity.ok(clienteConsultaService.listarClientesPorSucursal(ciRecepcionista, estadoAcceso));
    }

    // Buscar un cliente específico por su CI
    @GetMapping("/{ci}")
    public ResponseEntity<ClienteResponse> obtenerClientePorCi(
            @PathVariable String ci,
            Authentication authentication
    ) {
        String ciRecepcionista = authentication.getName();
        return ResponseEntity.ok(clienteConsultaService.obtenerClientePorCi(ci, ciRecepcionista));
    }
}