package com.backend.megatlon.services;

import com.backend.megatlon.dto.SetupStatusResponse;
import com.backend.megatlon.enums.RolNombre;
import com.backend.megatlon.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public SetupStatusResponse checkSetupStatus() {
        boolean existePropietario = usuarioRepository.existsByRolNombreRol(RolNombre.PROPIETARIO);

        if (!existePropietario) {
            return new SetupStatusResponse(
                    true,
                    "El sistema requiere la configuración inicial del usuario PROPIETARIO."
            );
        }

        return new SetupStatusResponse(
                false,
                "El sistema ya se encuentra configurado."
        );
    }
}