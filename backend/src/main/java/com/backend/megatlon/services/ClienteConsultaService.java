package com.backend.megatlon.services;

import com.backend.megatlon.dto.ClienteResponse;
import com.backend.megatlon.enums.EstadoAcceso;
import com.backend.megatlon.enums.RolNombre;
import com.backend.megatlon.models.Usuario;
import com.backend.megatlon.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClienteConsultaService {

    private final UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public List<ClienteResponse> listarClientesPorSucursal(String ciRecepcionista, EstadoAcceso estadoAcceso) {
        // 1. Obtener la recepcionista para conocer su sucursal base
        Usuario recepcionista = usuarioRepository.findByCiWithRelations(ciRecepcionista)
                .orElseThrow(() -> new IllegalArgumentException("Recepcionista no encontrada."));

        Long sucursalIdRecepcionista = recepcionista.getSucursalBase().getId();

        // 2. Obtener usuarios y filtrar por Sucursal, Rol CLIENTE y Estado de Acceso opcional
        return usuarioRepository.findAll().stream()
                .filter(u -> u.getRol().getNombreRol() == RolNombre.CLIENTE)
                .filter(u -> u.getSucursalBase().getId().equals(sucursalIdRecepcionista))
                .filter(u -> estadoAcceso == null || u.getEstadoAcceso() == estadoAcceso)
                .map(this::mapearAClienteResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ClienteResponse obtenerClientePorCi(String ciCliente, String ciRecepcionista) {
        // 1. Obtener la recepcionista para validar sucursal
        Usuario recepcionista = usuarioRepository.findByCiWithRelations(ciRecepcionista)
                .orElseThrow(() -> new IllegalArgumentException("Recepcionista no encontrada."));

        // 2. Buscar al cliente por su CI
        Usuario cliente = usuarioRepository.findByCiWithRelations(ciCliente)
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado con CI: " + ciCliente));

        // 3. Validar que el usuario buscado sea realmente un CLIENTE
        if (cliente.getRol().getNombreRol() != RolNombre.CLIENTE) {
            throw new IllegalArgumentException("El usuario consultado no tiene el rol de CLIENTE.");
        }

        // 4. Validar que pertenezca a la misma sucursal de la recepcionista
        if (!cliente.getSucursalBase().getId().equals(recepcionista.getSucursalBase().getId())) {
            throw new IllegalArgumentException("Acceso denegado: El cliente pertenece a otra sucursal.");
        }

        return mapearAClienteResponse(cliente);
    }

    private ClienteResponse mapearAClienteResponse(Usuario u) {
        String nombreCompleto = (u.getPrimerNombre() + " " +
                (u.getSegundoNombre() != null ? u.getSegundoNombre() + " " : "") +
                u.getPrimerApellido() + " " +
                (u.getSegundoApellido() != null ? u.getSegundoApellido() : "")).trim();

        return ClienteResponse.builder()
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
                .estadoAcceso(u.getEstadoAcceso().name())
                .build();
    }
}