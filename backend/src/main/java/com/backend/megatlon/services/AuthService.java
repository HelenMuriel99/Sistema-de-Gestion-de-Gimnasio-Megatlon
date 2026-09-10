package com.backend.megatlon.services;

import com.backend.megatlon.dto.AuthRequest;
import com.backend.megatlon.dto.AuthResponse;
import com.backend.megatlon.enums.EstadoAcceso;
import com.backend.megatlon.models.Usuario;
import com.backend.megatlon.repositories.UsuarioRepository;
import com.backend.megatlon.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getCi(), request.getPassword())
        );

        Usuario usuario = usuarioRepository.findByCiWithRelations(request.getCi())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));

        if (usuario.getEstadoAcceso() != EstadoAcceso.ACTIVO) {
            throw new RuntimeException("El acceso para esta cuenta se encuentra: " + usuario.getEstadoAcceso());
        }

        usuario.setIntentosFallidos(0);
        usuarioRepository.save(usuario);

        String jwtToken = jwtService.generateToken(usuario);

        return AuthResponse.builder()
                .token(jwtToken)
                .ci(usuario.getCi())
                .nombreCompleto(usuario.getPrimerNombre() + " " + usuario.getPrimerApellido())
                .rol(usuario.getRol().getNombreRol().name())
                .sucursalId(usuario.getSucursalBase().getId())
                .sucursalNombre(usuario.getSucursalBase().getNombre())
                .build();
    }
}