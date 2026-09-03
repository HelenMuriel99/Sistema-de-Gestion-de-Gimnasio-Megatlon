package com.backend.megatlon.services;

import com.backend.megatlon.dto.ActualizarClienteRequest;
import com.backend.megatlon.dto.ClienteResponse;
import com.backend.megatlon.enums.RolNombre;
import com.backend.megatlon.models.Usuario;
import com.backend.megatlon.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ClienteEdicionService {

    private final UsuarioRepository usuarioRepository;

    @Transactional
    public ClienteResponse actualizarCliente(String ciCliente, ActualizarClienteRequest request, String ciRecepcionista) {

        // 1. Obtener recepcionista autenticada
        Usuario recepcionista = usuarioRepository.findByCiWithRelations(ciRecepcionista)
                .orElseThrow(() -> new IllegalArgumentException("Recepcionista no encontrada."));

        // 2. Buscar al cliente
        Usuario cliente = usuarioRepository.findByCiWithRelations(ciCliente)
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado con CI: " + ciCliente));

        // 3. Validar que el usuario a modificar sea rol CLIENTE
        if (cliente.getRol().getNombreRol() != RolNombre.CLIENTE) {
            throw new IllegalArgumentException("Acción denegada: Solo se pueden editar usuarios con rol CLIENTE.");
        }

        // 4. Validar pertenencia a la misma sucursal
        if (!cliente.getSucursalBase().getId().equals(recepcionista.getSucursalBase().getId())) {
            throw new IllegalArgumentException("Acción denegada: El cliente pertenece a otra sucursal.");
        }

        // 5. Modificar campos opcionales si se envían
        if (request.getPrimerNombre() != null) cliente.setPrimerNombre(request.getPrimerNombre());
        if (request.getSegundoNombre() != null) cliente.setSegundoNombre(request.getSegundoNombre());
        if (request.getPrimerApellido() != null) cliente.setPrimerApellido(request.getPrimerApellido());
        if (request.getSegundoApellido() != null) cliente.setSegundoApellido(request.getSegundoApellido());
        if (request.getFechaNacimiento() != null) cliente.setFechaNacimiento(request.getFechaNacimiento());
        if (request.getGenero() != null) cliente.setGenero(request.getGenero());
        if (request.getTelefono() != null) cliente.setTelefono(request.getTelefono());
        if (request.getDireccion() != null) cliente.setDireccion(request.getDireccion());

        Usuario guardado = usuarioRepository.save(cliente);

        // 6. Mapear y retornar respuesta
        String nombreCompleto = (guardado.getPrimerNombre() + " " +
                (guardado.getSegundoNombre() != null ? guardado.getSegundoNombre() + " " : "") +
                guardado.getPrimerApellido() + " " +
                (guardado.getSegundoApellido() != null ? guardado.getSegundoApellido() : "")).trim();

        return ClienteResponse.builder()
                .id(guardado.getId())
                .ci(guardado.getCi())
                .primerNombre(guardado.getPrimerNombre())
                .segundoNombre(guardado.getSegundoNombre())
                .primerApellido(guardado.getPrimerApellido())
                .segundoApellido(guardado.getSegundoApellido())
                .nombreCompleto(nombreCompleto)
                .fechaNacimiento(guardado.getFechaNacimiento())
                .genero(guardado.getGenero())
                .telefono(guardado.getTelefono())
                .direccion(guardado.getDireccion())
                .rol(guardado.getRol().getNombreRol().name())
                .sucursalId(guardado.getSucursalBase().getId())
                .sucursalNombre(guardado.getSucursalBase().getNombre())
                .estadoAcceso(guardado.getEstadoAcceso().name())
                .build();
    }
}