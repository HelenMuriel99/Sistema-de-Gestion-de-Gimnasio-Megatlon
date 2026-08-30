package com.backend.megatlon.services;

import com.backend.megatlon.dto.EliminacionUsuarioResponse;
import com.backend.megatlon.enums.EstadoAcceso;
import com.backend.megatlon.enums.RolNombre;
import com.backend.megatlon.models.Usuario;
import com.backend.megatlon.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PropietarioEliminacionService {

    private final UsuarioRepository usuarioRepository;

    @Transactional
    public EliminacionUsuarioResponse desactivarUsuarioPorCi(String ciUsuarioAEliminar, String ciPropietarioAutenticado) {

        // 1. Validar que el propietario no intente desactivarse a sí mismo
        if (ciUsuarioAEliminar.equals(ciPropietarioAutenticado)) {
            throw new IllegalArgumentException("Acción denegada: El Propietario no puede desactivar su propia cuenta.");
        }

        // 2. Buscar usuario a eliminar con sus relaciones
        Usuario usuario = usuarioRepository.findByCiWithRelations(ciUsuarioAEliminar)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con CI: " + ciUsuarioAEliminar));

        // 3. Proteger a otros Propietarios si los hubiera
        if (usuario.getRol().getNombreRol() == RolNombre.PROPIETARIO) {
            throw new IllegalArgumentException("Acción denegada: No se puede desactivar a un usuario con rol PROPIETARIO.");
        }

        // 4. Validar si ya estaba INACTIVO
        if (usuario.getEstadoAcceso() == EstadoAcceso.INACTIVO) {
            throw new IllegalStateException("El usuario con CI: " + ciUsuarioAEliminar + " ya se encuentra INACTIVO.");
        }

        String estadoPrevio = usuario.getEstadoAcceso().name();

        // 5. Aplicar Soft Delete
        usuario.setEstadoAcceso(EstadoAcceso.INACTIVO);
        usuarioRepository.save(usuario);

        String nombreCompleto = (usuario.getPrimerNombre() + " " +
                (usuario.getSegundoNombre() != null ? usuario.getSegundoNombre() + " " : "") +
                usuario.getPrimerApellido() + " " +
                (usuario.getSegundoApellido() != null ? usuario.getSegundoApellido() : "")).trim();

        return EliminacionUsuarioResponse.builder()
                .ci(usuario.getCi())
                .nombreCompleto(nombreCompleto)
                .estadoAccesoPrevio(estadoPrevio)
                .estadoAccesoNuevo(EstadoAcceso.INACTIVO.name())
                .mensaje("Usuario desactivado correctamente mediante Soft Delete.")
                .build();
    }
}