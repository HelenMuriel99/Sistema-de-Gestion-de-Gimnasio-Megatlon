package com.backend.megatlon.services;

import com.backend.megatlon.config.CredentialGenerator;
import com.backend.megatlon.dto.EmpleadoCreadoResponse;
import com.backend.megatlon.dto.RegistrarEmpleadoRequest;
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

@Service
@RequiredArgsConstructor
public class PropietarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final SucursalRepository sucursalRepository;
    private final EmpleadoDetalleRepository empleadoDetalleRepository;
    private final PasswordEncoder passwordEncoder;
    private final CredentialGenerator credentialGenerator;

    @Transactional
    public EmpleadoCreadoResponse registrarEmpleado(RegistrarEmpleadoRequest request) {

        // 1. Validar que no exista un usuario con el mismo CI
        if (usuarioRepository.existsByCi(request.getCi())) {
            throw new IllegalArgumentException("Ya existe un usuario registrado con el CI: " + request.getCi());
        }

        // 2. Restringir el registro únicamente a RECEPCIONISTA o INSTRUCTOR
        if (request.getRolNombre() != RolNombre.RECEPCIONISTA && request.getRolNombre() != RolNombre.INSTRUCTOR) {
            throw new IllegalArgumentException("El Propietario solo puede registrar usuarios con rol RECEPCIONISTA o INSTRUCTOR.");
        }

        // 3. Obtener Rol
        Rol rol = rolRepository.findByNombreRol(request.getRolNombre())
                .orElseThrow(() -> new IllegalArgumentException("Rol no encontrado: " + request.getRolNombre()));

        // 4. Obtener Sucursal Base
        Sucursal sucursal = sucursalRepository.findById(request.getSucursalBaseId())
                .orElseThrow(() -> new IllegalArgumentException("Sucursal no encontrada con ID: " + request.getSucursalBaseId()));

        if (!sucursal.getActivo()) {
            throw new IllegalArgumentException("No se puede asignar un empleado a una sucursal inactiva.");
        }

        // 5. Construir objeto Usuario sin contraseña aún
        Usuario nuevoUsuario = Usuario.builder()
                .ci(request.getCi())
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

        // 6. Generar contraseña plana utilizando CredentialGenerator
        String passwordPlana = credentialGenerator.generarPasswordPlana(nuevoUsuario);

        // 7. Encriptar contraseña y guardar Usuario
        nuevoUsuario.setPassword(passwordEncoder.encode(passwordPlana));
        Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);

        // 8. Crear y guardar detalle de empleado (salario)
        BigDecimal salario = (request.getSalarioFijo() != null) ? request.getSalarioFijo() : new BigDecimal("3350.00");
        EmpleadoDetalle detalle = EmpleadoDetalle.builder()
                .usuario(usuarioGuardado)
                .salarioFijo(salario)
                .build();
        empleadoDetalleRepository.save(detalle);

        // 9. Armar respuesta
        String nombreCompleto = usuarioGuardado.getPrimerNombre() +
                (usuarioGuardado.getSegundoNombre() != null ? " " + usuarioGuardado.getSegundoNombre() : "") + " " +
                usuarioGuardado.getPrimerApellido() +
                (usuarioGuardado.getSegundoApellido() != null ? " " + usuarioGuardado.getSegundoApellido() : "");

        return EmpleadoCreadoResponse.builder()
                .id(usuarioGuardado.getId())
                .ci(usuarioGuardado.getCi())
                .nombreCompleto(nombreCompleto.trim())
                .rol(usuarioGuardado.getRol().getNombreRol().name())
                .sucursal(usuarioGuardado.getSucursalBase().getNombre())
                .passwordGeneradaPlana(passwordPlana)
                .estadoAcceso(usuarioGuardado.getEstadoAcceso().name())
                .salarioFijo(salario)
                .build();
    }

}