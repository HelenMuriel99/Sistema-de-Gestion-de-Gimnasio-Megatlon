package com.backend.megatlon.controllers;

import com.backend.megatlon.dto.EliminacionUsuarioResponse;
import com.backend.megatlon.services.PropietarioEliminacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/propietario/gestion")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PROPIETARIO')")
public class PropietarioEliminacionController {

    private final PropietarioEliminacionService propietarioEliminacionService;

    @DeleteMapping("/usuarios/{ci}")
    public ResponseEntity<EliminacionUsuarioResponse> desactivarUsuario(
            @PathVariable String ci,
            Authentication authentication
    ) {
        // Extrae el CI del propietario desde el token JWT autenticado
        String ciPropietarioAutenticado = authentication.getName();

        EliminacionUsuarioResponse response = propietarioEliminacionService
                .desactivarUsuarioPorCi(ci, ciPropietarioAutenticado);

        return ResponseEntity.ok(response);
    }
}