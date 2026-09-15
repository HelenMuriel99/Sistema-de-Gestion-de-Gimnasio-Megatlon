package com.backend.megatlon.security;

import com.backend.megatlon.models.Usuario;
import com.backend.megatlon.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String ci) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByCiWithRelations(ci)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con CI: " + ci));

        return new User(
                usuario.getCi(),
                usuario.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + usuario.getRol().getNombreRol().name()))
        );
    }
}