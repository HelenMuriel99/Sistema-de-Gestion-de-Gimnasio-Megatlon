package com.backend.megatlon.services;

import com.backend.megatlon.dto.ActualizarEmpleadoRequest;
import com.backend.megatlon.dto.EmpleadoResumenResponse;
import com.backend.megatlon.enums.RolNombre;
import com.backend.megatlon.models.EmpleadoDetalle;
import com.backend.megatlon.models.Sucursal;
import com.backend.megatlon.models.Usuario;
import com.backend.megatlon.repositories.EmpleadoDetalleRepository;
import com.backend.megatlon.repositories.SucursalRepository;
import com.backend.megatlon.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PropietarioEdicionService {

    private final UsuarioRepository usuarioRepository;
    private final SucursalRepository sucursalRepository;
    private final EmpleadoDetalleRepository empleadoDetalleRepository;

    @Transactional
    public EmpleadoResumenResponse actualizarUsuario(String ci, ActualizarEmpleadoRequest request) {

        // 1. Buscar usuario objetivo
        Usuario usuario = usuarioRepository.findByCiWithRelations(ci)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con CI: " + ci));

        // 2. Proteger la edición si es un Propietario
        if (usuario.getRol().getNombreRol() == RolNombre.PROPIETARIO) {
            throw new IllegalArgumentException("No se pueden modificar los datos del Propietario desde este módulo.");
        }

        // 3. Modificar datos personales opcionales
        if (request.getPrimerNombre() != null) usuario.setPrimerNombre(request.getPrimerNombre());
        if (request.getSegundoNombre() != null) usuario.setSegundoNombre(request.getSegundoNombre());
        if (request.getPrimerApellido() != null) usuario.setPrimerApellido(request.getPrimerApellido());
        if (request.getSegundoApellido() != null) usuario.setSegundoApellido(request.getSegundoApellido());
        if (request.getFechaNacimiento() != null) usuario.setFechaNacimiento(request.getFechaNacimiento());
        if (request.getGenero() != null) usuario.setGenero(request.getGenero());
        if (request.getTelefono() != null) usuario.setTelefono(request.getTelefono());
        if (request.getDireccion() != null) usuario.setDireccion(request.getDireccion());

        // 4. Cambiar de Sucursal Base (si se envía)
        if (request.getSucursalBaseId() != null) {
            Sucursal nuevaSucursal = sucursalRepository.findById(request.getSucursalBaseId())
                    .orElseThrow(() -> new IllegalArgumentException("Sucursal no encontrada con ID: " + request.getSucursalBaseId()));

            if (!nuevaSucursal.getActivo()) {
                throw new IllegalArgumentException("No se puede reubicar a un usuario a una sucursal inactiva.");
            }
            usuario.setSucursalBase(nuevaSucursal);
        }

        Usuario guardado = usuarioRepository.save(usuario);

        // 5. Actualizar Salario Fijo en EmpleadoDetalle (si aplica)
        Optional<EmpleadoDetalle> detalleOpt = empleadoDetalleRepository.findByUsuarioId(guardado.getId());
        if (detalleOpt.isPresent() && request.getSalarioFijo() != null) {
            EmpleadoDetalle detalle = detalleOpt.get();
            detalle.setSalarioFijo(request.getSalarioFijo());
            empleadoDetalleRepository.save(detalle);
        }

        // 6. Mapear y retornar respuesta
        String nombreCompleto = (guardado.getPrimerNombre() + " " +
                (guardado.getSegundoNombre() != null ? guardado.getSegundoNombre() + " " : "") +
                guardado.getPrimerApellido() + " " +
                (guardado.getSegundoApellido() != null ? guardado.getSegundoApellido() : "")).trim();

        return EmpleadoResumenResponse.builder()
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
                .intentosFallidos(guardado.getIntentosFallidos())
                .estadoAcceso(guardado.getEstadoAcceso().name())
                .salarioFijo(detalleOpt.map(EmpleadoDetalle::getSalarioFijo).orElse(null))
                .build();
    }
}