package com.backend.megatlon.services;

import com.backend.megatlon.dto.ClienteResponse;
import com.backend.megatlon.dto.RegistrarClienteRequest;
import com.backend.megatlon.enums.EstadoAcceso;
import com.backend.megatlon.enums.RolNombre;
import com.backend.megatlon.models.Rol;
import com.backend.megatlon.models.Sucursal;
import com.backend.megatlon.models.Usuario;
import com.backend.megatlon.repositories.RolRepository;
import com.backend.megatlon.repositories.SucursalRepository;
import com.backend.megatlon.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PropietarioClienteRegistroService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final SucursalRepository sucursalRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public ClienteResponse registrarCliente(RegistrarClienteRequest request, Long sucursalId) {

        // 1. Validar que el CI no esté registrado
        if (usuarioRepository.existsByCi(request.getCi())) {
            throw new IllegalArgumentException("Ya existe un usuario registrado con el CI: " + request.getCi());
        }

        // 2. Obtener el rol CLIENTE
        Rol rolCliente = rolRepository.findByNombreRol(RolNombre.CLIENTE)
                .orElseThrow(() -> new RuntimeException("El rol CLIENTE no está configurado en el sistema."));

        // 3. Obtener la sucursal especificada por el Propietario
        Sucursal sucursal = sucursalRepository.findById(sucursalId)
                .orElseThrow(() -> new IllegalArgumentException("No se encontró la sucursal con ID: " + sucursalId));

        // 4. Crear la entidad Usuario
        Usuario cliente = Usuario.builder()
                .ci(request.getCi())
                .password(passwordEncoder.encode(request.getCi()))
                .primerNombre(request.getPrimerNombre())
                .segundoNombre(request.getSegundoNombre())
                .primerApellido(request.getPrimerApellido())
                .segundoApellido(request.getSegundoApellido())
                .fechaNacimiento(request.getFechaNacimiento())
                .genero(request.getGenero())
                .telefono(request.getTelefono())
                .direccion(request.getDireccion())
                .rol(rolCliente)
                .sucursalBase(sucursal)
                .intentosFallidos(0)
                .estadoAcceso(EstadoAcceso.ACTIVO)
                .build();

        Usuario clienteGuardado = usuarioRepository.save(cliente);

        // 5. Mapear respuesta
        String nombreCompleto = (clienteGuardado.getPrimerNombre() + " " +
                (clienteGuardado.getSegundoNombre() != null ? clienteGuardado.getSegundoNombre() + " " : "") +
                clienteGuardado.getPrimerApellido() + " " +
                (clienteGuardado.getSegundoApellido() != null ? clienteGuardado.getSegundoApellido() : "")).trim();

        return ClienteResponse.builder()
                .id(clienteGuardado.getId())
                .ci(clienteGuardado.getCi())
                .primerNombre(clienteGuardado.getPrimerNombre())
                .segundoNombre(clienteGuardado.getSegundoNombre())
                .primerApellido(clienteGuardado.getPrimerApellido())
                .segundoApellido(clienteGuardado.getSegundoApellido())
                .nombreCompleto(nombreCompleto)
                .fechaNacimiento(clienteGuardado.getFechaNacimiento())
                .genero(clienteGuardado.getGenero())
                .telefono(clienteGuardado.getTelefono())
                .direccion(clienteGuardado.getDireccion())
                .rol(clienteGuardado.getRol().getNombreRol().name())
                .sucursalId(clienteGuardado.getSucursalBase().getId())
                .sucursalNombre(clienteGuardado.getSucursalBase().getNombre())
                .estadoAcceso(clienteGuardado.getEstadoAcceso().name())
                .build();
    }
}