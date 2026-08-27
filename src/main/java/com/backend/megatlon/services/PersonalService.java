package com.backend.megatlon.services;

import com.backend.megatlon.config.CredentialGenerator;
import com.backend.megatlon.dto.PersonalEliminarResponse;
import com.backend.megatlon.dto.PersonalListResponse;
import com.backend.megatlon.dto.PersonalRegistroRequest;
import com.backend.megatlon.dto.PersonalRegistroResponse;
import com.backend.megatlon.enums.EstadoAcceso;
import com.backend.megatlon.enums.RolNombre;
import com.backend.megatlon.models.EmpleadoDetalle;
import com.backend.megatlon.models.Rol;
import com.backend.megatlon.models.Sucursal;
import com.backend.megatlon.models.Usuario;
import com.backend.megatlon.repositories.EmpleadoDetalleRepository;
import com.backend.megatlon.repositories.RolRepository;
import com.backend.megatlon.repositories.SucursalRepository;
import com.backend.megatlon.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PersonalService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final SucursalRepository sucursalRepository;
    private final EmpleadoDetalleRepository empleadoDetalleRepository;
    private final PasswordEncoder passwordEncoder;
    private final CredentialGenerator credentialGenerator;

    @Transactional
    public PersonalRegistroResponse registrarPersonal(PersonalRegistroRequest request) {
        // Validar que el rol sea únicamente RECEPCIONISTA o INSTRUCTOR
        if (request.getRol() != RolNombre.RECEPCIONISTA && request.getRol() != RolNombre.INSTRUCTOR) {
            throw new IllegalArgumentException("Solo se permite registrar personal con rol RECEPCIONISTA o INSTRUCTOR.");
        }

        if (usuarioRepository.existsByCi(request.getCi())) {
            throw new IllegalArgumentException("Ya existe un usuario registrado con el CI: " + request.getCi());
        }

        Rol rol = rolRepository.findByNombreRol(request.getRol())
                .orElseThrow(() -> new IllegalArgumentException("El rol especificado no existe."));

        Sucursal sucursal = sucursalRepository.findById(request.getSucursalBaseId())
                .orElseThrow(() -> new IllegalArgumentException("La sucursal especificada no existe."));

        // Generar credenciales usando la función del Paso 1
        Usuario usuarioTemp = new Usuario();
        usuarioTemp.setPrimerNombre(request.getPrimerNombre());
        usuarioTemp.setSegundoNombre(request.getSegundoNombre());
        usuarioTemp.setPrimerApellido(request.getPrimerApellido());

        String passwordPlana = credentialGenerator.generarPasswordPlana(usuarioTemp);
        String passwordHasheada = passwordEncoder.encode(passwordPlana);

        // Crear y guardar el Usuario
        Usuario nuevoUsuario = Usuario.builder()
                .ci(request.getCi())
                .password(passwordHasheada)
                .primerNombre(request.getPrimerNombre())
                .segundoNombre(request.getSegundoNombre())
                .primerApellido(request.getPrimerApellido())
                .segundoApellido(request.getSegundoApellido())
                .fechaNacimiento(request.getFechaNacimiento())
                .genero(request.getGenero())
                .telefono(request.getTelefono())
                .direccion(request.getDireccion())
                .rol(rol)
                .sucursalBase(sucursal)
                .intentosFallidos(0)
                .estadoAcceso(EstadoAcceso.ACTIVO)
                .build();

        Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);

        // Crear y guardar el detalle de salario del empleado (EmpleadoDetalle)
        EmpleadoDetalle empleadoDetalle = EmpleadoDetalle.builder()
                .usuario(usuarioGuardado)
                .salarioFijo(request.getSalarioFijo())
                .build();

        empleadoDetalleRepository.save(empleadoDetalle);

        String nombreCompleto = usuarioGuardado.getPrimerNombre() + " " + usuarioGuardado.getPrimerApellido();

        return PersonalRegistroResponse.builder()
                .usuarioId(usuarioGuardado.getId())
                .ci(usuarioGuardado.getCi())
                .nombreCompleto(nombreCompleto)
                .rol(usuarioGuardado.getRol().getNombreRol().name())
                .sucursal(sucursal.getNombre())
                .salarioFijo(request.getSalarioFijo())
                .estadoAcceso(usuarioGuardado.getEstadoAcceso().name())
                .passwordGenerada(passwordPlana)
                .mensaje("Personal registrado correctamente.")
                .build();
    }

    @Transactional(readOnly = true)
    public List<PersonalListResponse> listarPersonalActivo() {
        List<RolNombre> rolesPersonal = List.of(RolNombre.RECEPCIONISTA, RolNombre.INSTRUCTOR);

        List<Usuario> usuariosActivos = usuarioRepository.findByRolNombreRolInAndEstadoAcceso(
                rolesPersonal,
                EstadoAcceso.ACTIVO
        );

        return usuariosActivos.stream().map(usuario -> {
            // Obtener detalle del salario si existe
            BigDecimal salario = empleadoDetalleRepository.findByUsuarioId(usuario.getId())
                    .map(EmpleadoDetalle::getSalarioFijo)
                    .orElse(null);

            String nombreCompleto = usuario.getPrimerNombre() + " " + usuario.getPrimerApellido();

            return PersonalListResponse.builder()
                    .usuarioId(usuario.getId())
                    .ci(usuario.getCi())
                    .primerNombre(usuario.getPrimerNombre())
                    .segundoNombre(usuario.getSegundoNombre())
                    .primerApellido(usuario.getPrimerApellido())
                    .segundoApellido(usuario.getSegundoApellido())
                    .nombreCompleto(nombreCompleto)
                    .fechaNacimiento(usuario.getFechaNacimiento())
                    .genero(usuario.getGenero())
                    .telefono(usuario.getTelefono())
                    .direccion(usuario.getDireccion())
                    .rol(usuario.getRol().getNombreRol().name())
                    .sucursal(usuario.getSucursalBase().getNombre())
                    .sucursalId(usuario.getSucursalBase().getId())
                    .salarioFijo(salario)
                    .estadoAcceso(usuario.getEstadoAcceso().name())
                    .build();
        }).toList();
    }

    @Transactional
    public PersonalEliminarResponse darDeBajaPersonal(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("El usuario con ID " + usuarioId + " no existe."));

        // Validar que el usuario a eliminar sea solo un RECEPCIONISTA o INSTRUCTOR
        RolNombre rolUsuario = usuario.getRol().getNombreRol();
        if (rolUsuario != RolNombre.RECEPCIONISTA && rolUsuario != RolNombre.INSTRUCTOR) {
            throw new IllegalArgumentException("Solo se permite dar de baja a personal con rol RECEPCIONISTA o INSTRUCTOR.");
        }

        // Aplicar la Baja Lógica (Soft Delete) cambiando su estado a INACTIVO
        usuario.setEstadoAcceso(EstadoAcceso.INACTIVO);
        Usuario usuarioActualizado = usuarioRepository.save(usuario);

        String nombreCompleto = usuarioActualizado.getPrimerNombre() + " " + usuarioActualizado.getPrimerApellido();

        return PersonalEliminarResponse.builder()
                .usuarioId(usuarioActualizado.getId())
                .ci(usuarioActualizado.getCi())
                .nombreCompleto(nombreCompleto)
                .estadoAcceso(usuarioActualizado.getEstadoAcceso().name())
                .mensaje("El usuario fue dado de baja exitosamente (Estado: INACTIVO).")
                .build();
    }
}