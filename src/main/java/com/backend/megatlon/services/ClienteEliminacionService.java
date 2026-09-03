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
public class ClienteEliminacionService {

    private final UsuarioRepository usuarioRepository;

    @Transactional
    public EliminacionUsuarioResponse desactivarClientePorCi(String ciCliente, String ciRecepcionista) {

        // 1. Obtener recepcionista autenticada
        Usuario recepcionista = usuarioRepository.findByCiWithRelations(ciRecepcionista)
                .orElseThrow(() -> new IllegalArgumentException("Recepcionista no encontrada."));

        // 2. Buscar al cliente
        Usuario cliente = usuarioRepository.findByCiWithRelations(ciCliente)
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado con CI: " + ciCliente));

        // 3. Validar que el usuario objetivo sea de rol CLIENTE
        if (cliente.getRol().getNombreRol() != RolNombre.CLIENTE) {
            throw new IllegalArgumentException("Acción denegada: Solo se pueden desactivar usuarios con rol CLIENTE.");
        }

        // 4. Validar pertenencia a la misma sucursal
        if (!cliente.getSucursalBase().getId().equals(recepcionista.getSucursalBase().getId())) {
            throw new IllegalArgumentException("Acción denegada: El cliente pertenece a otra sucursal.");
        }

        // 5. Validar estado previo
        if (cliente.getEstadoAcceso() == EstadoAcceso.INACTIVO) {
            throw new IllegalStateException("El cliente con CI: " + ciCliente + " ya se encuentra INACTIVO.");
        }

        String estadoPrevio = cliente.getEstadoAcceso().name();

        // 6. Aplicar Soft Delete
        cliente.setEstadoAcceso(EstadoAcceso.INACTIVO);
        usuarioRepository.save(cliente);

        String nombreCompleto = (cliente.getPrimerNombre() + " " +
                (cliente.getSegundoNombre() != null ? cliente.getSegundoNombre() + " " : "") +
                cliente.getPrimerApellido() + " " +
                (cliente.getSegundoApellido() != null ? cliente.getSegundoApellido() : "")).trim();

        return EliminacionUsuarioResponse.builder()
                .ci(cliente.getCi())
                .nombreCompleto(nombreCompleto)
                .estadoAccesoPrevio(estadoPrevio)
                .estadoAccesoNuevo(EstadoAcceso.INACTIVO.name())
                .mensaje("Cliente desactivado correctamente mediante Soft Delete.")
                .build();
    }
}