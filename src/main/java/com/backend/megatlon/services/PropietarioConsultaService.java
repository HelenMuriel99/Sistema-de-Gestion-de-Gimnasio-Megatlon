package com.backend.megatlon.services;

import com.backend.megatlon.dto.EmpleadoResumenResponse;
import com.backend.megatlon.enums.EstadoAcceso;
import com.backend.megatlon.enums.RolNombre;
import com.backend.megatlon.models.EmpleadoDetalle;
import com.backend.megatlon.models.Usuario;
import com.backend.megatlon.repositories.EmpleadoDetalleRepository;
import com.backend.megatlon.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PropietarioConsultaService {

    private final UsuarioRepository usuarioRepository;
    private final EmpleadoDetalleRepository empleadoDetalleRepository;

    @Transactional(readOnly = true)
    public List<EmpleadoResumenResponse> listarUsuarios(Long sucursalId, RolNombre rol, EstadoAcceso estadoAcceso) {
        List<Usuario> usuarios = usuarioRepository.findAll();

        return usuarios.stream()
                .filter(u -> sucursalId == null || u.getSucursalBase().getId().equals(sucursalId))
                .filter(u -> rol == null || u.getRol().getNombreRol() == rol)
                .filter(u -> estadoAcceso == null || u.getEstadoAcceso() == estadoAcceso)
                .map(this::mapearAEmpleadoResumen)
                .toList();
    }

    @Transactional(readOnly = true)
    public EmpleadoResumenResponse obtenerPorCi(String ci) {
        Usuario usuario = usuarioRepository.findByCiWithRelations(ci)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con CI: " + ci));

        return mapearAEmpleadoResumen(usuario);
    }

    private EmpleadoResumenResponse mapearAEmpleadoResumen(Usuario u) {
        String nombreCompleto = (u.getPrimerNombre() + " " +
                (u.getSegundoNombre() != null ? u.getSegundoNombre() + " " : "") +
                u.getPrimerApellido() + " " +
                (u.getSegundoApellido() != null ? u.getSegundoApellido() : "")).trim();

        Optional<EmpleadoDetalle> detalle = empleadoDetalleRepository.findByUsuarioId(u.getId());

        return EmpleadoResumenResponse.builder()
                .id(u.getId())
                .ci(u.getCi())
                .primerNombre(u.getPrimerNombre())
                .segundoNombre(u.getSegundoNombre())
                .primerApellido(u.getPrimerApellido())
                .segundoApellido(u.getSegundoApellido())
                .nombreCompleto(nombreCompleto)
                .fechaNacimiento(u.getFechaNacimiento())
                .genero(u.getGenero())
                .telefono(u.getTelefono())
                .direccion(u.getDireccion())
                .rol(u.getRol().getNombreRol().name())
                .sucursalId(u.getSucursalBase().getId())
                .sucursalNombre(u.getSucursalBase().getNombre())
                .intentosFallidos(u.getIntentosFallidos())
                .estadoAcceso(u.getEstadoAcceso().name())
                .salarioFijo(detalle.map(EmpleadoDetalle::getSalarioFijo).orElse(null))
                .build();
    }
}