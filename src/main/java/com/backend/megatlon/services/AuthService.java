package com.backend.megatlon.services;
// POR SI ACASO
/* import com.backend.megatlon.config.CredentialGenerator;
import com.backend.megatlon.dto.*;
import com.backend.megatlon.enums.EstadoAcceso;
import com.backend.megatlon.enums.RolNombre;
import com.backend.megatlon.models.*;
import com.backend.megatlon.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final SucursalRepository sucursalRepository;
    private final PasswordEncoder passwordEncoder;
    private final CredentialGenerator credentialGenerator;
    /*
    @Transactional
    public PropietarioSetupResponse registrarPropietario(PropietarioSetupRequest request) {
        if (usuarioRepository.existsByCi(request.getCi())) {
            throw new RuntimeException("Ya existe un usuario registrado con el CI: " + request.getCi());
        }

        Rol rolPropietario = rolRepository.findByNombreRol(RolNombre.PROPIETARIO)
                .orElseThrow(() -> new RuntimeException("El rol PROPIETARIO no se encuentra cargado en el sistema."));

        Sucursal sucursal = sucursalRepository.findById(request.getSucursalBaseId())
                .orElseThrow(() -> new RuntimeException("La sucursal seleccionada no existe."));

        // Instanciar usuario temporal para generar contraseña según el requerimiento del Paso 1
        Usuario usuarioTemp = new Usuario();
        usuarioTemp.setPrimerNombre(request.getPrimerNombre());
        usuarioTemp.setSegundoNombre(request.getSegundoNombre());
        usuarioTemp.setPrimerApellido(request.getPrimerApellido());

        String passwordPlana = credentialGenerator.generarPasswordPlana(usuarioTemp);
        String passwordHasheada = passwordEncoder.encode(passwordPlana);

        // Crear la entidad Usuario
        Usuario nuevoPropietario = Usuario.builder()
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
                .rol(rolPropietario)
                .sucursalBase(sucursal)
                .intentosFallidos(0)
                .estadoAcceso(EstadoAcceso.ACTIVO)
                .build();

        Usuario guardado = usuarioRepository.save(nuevoPropietario);

        return PropietarioSetupResponse.builder()
                .id(guardado.getId())
                .ci(guardado.getCi())
                .primerNombre(guardado.getPrimerNombre())
                .primerApellido(guardado.getPrimerApellido())
                .rol(guardado.getRol().getNombreRol().name())
                .estadoAcceso(guardado.getEstadoAcceso().name())
                .passwordGenerada(passwordPlana)
                .mensaje("Propietario registrado exitosamente. Guarde sus credenciales.")
                .build();
    }
    @Transactional
    public PropietarioSetupResponse registrarPropietario(PropietarioSetupRequest request) {
        if (usuarioRepository.existsByCi(request.getCi())) {
            throw new RuntimeException("Ya existe un usuario registrado con el CI: " + request.getCi());
        }

        Rol rolPropietario = rolRepository.findByNombreRol(RolNombre.PROPIETARIO)
                .orElseThrow(() -> new RuntimeException("El rol PROPIETARIO no se encuentra cargado en el sistema."));

        Sucursal sucursal = sucursalRepository.findById(request.getSucursalBaseId())
                .orElseThrow(() -> new RuntimeException("La sucursal seleccionada no existe."));

        // 1. Instanciar usuario temporal CON TODOS LOS DATOS requeridos para la credencial
        Usuario usuarioTemp = Usuario.builder()
                .ci(request.getCi())
                .primerNombre(request.getPrimerNombre())
                .segundoNombre(request.getSegundoNombre())
                .primerApellido(request.getPrimerApellido())
                .segundoApellido(request.getSegundoApellido())
                .fechaNacimiento(request.getFechaNacimiento())
                .build();

        // 2. Generar contraseña plana y hashearla sobre la entidad completa
        String passwordPlana = credentialGenerator.generarPasswordPlana(usuarioTemp);
        String passwordHasheada = passwordEncoder.encode(passwordPlana);

        // 3. Crear la entidad Usuario final
        Usuario nuevoPropietario = Usuario.builder()
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
                .rol(rolPropietario)
                .sucursalBase(sucursal)
                .intentosFallidos(0)
                .estadoAcceso(EstadoAcceso.ACTIVO)
                .build();

        Usuario guardado = usuarioRepository.save(nuevoPropietario);

        return PropietarioSetupResponse.builder()
                .id(guardado.getId())
                .ci(guardado.getCi())
                .primerNombre(guardado.getPrimerNombre())
                .primerApellido(guardado.getPrimerApellido())
                .rol(guardado.getRol().getNombreRol().name())
                .estadoAcceso(guardado.getEstadoAcceso().name())
                .passwordGenerada(passwordPlana)
                .mensaje("Propietario registrado exitosamente. Guarde sus credenciales.")
                .build();
    }

    public LoginResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByCi(request.getCi())
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas."));

        if (usuario.getEstadoAcceso() != EstadoAcceso.ACTIVO) {
            throw new RuntimeException("Acceso denegado: El usuario no se encuentra activo.");
        }

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Credenciales inválidas.");
        }

        String nombreCompleto = usuario.getPrimerNombre() + " " + usuario.getPrimerApellido();

        return LoginResponse.builder()
                .id(usuario.getId())
                .ci(usuario.getCi())
                .nombreCompleto(nombreCompleto)
                .rol(usuario.getRol().getNombreRol().name())
                .mensaje("Inicio de sesión exitoso.")
                .build();
    }
} */

import com.backend.megatlon.config.CredentialGenerator;
import com.backend.megatlon.dto.*;
import com.backend.megatlon.enums.EstadoAcceso;
import com.backend.megatlon.enums.RolNombre;
import com.backend.megatlon.models.*;
import com.backend.megatlon.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final SucursalRepository sucursalRepository;
    private final PasswordEncoder passwordEncoder;
    private final CredentialGenerator credentialGenerator;

    @Transactional
    public PropietarioSetupResponse registrarPropietario(PropietarioSetupRequest request) {
        if (usuarioRepository.existsByCi(request.getCi())) {
            throw new RuntimeException("Ya existe un usuario registrado con el CI: " + request.getCi());
        }

        Rol rolPropietario = rolRepository.findByNombreRol(RolNombre.PROPIETARIO)
                .orElseThrow(() -> new RuntimeException("El rol PROPIETARIO no se encuentra cargado en el sistema."));

        Sucursal sucursal = sucursalRepository.findById(request.getSucursalBaseId())
                .orElseThrow(() -> new RuntimeException("La sucursal seleccionada no existe."));

        // Instanciar usuario temporal para generar contraseña según el requerimiento del Paso 1
        Usuario usuarioTemp = new Usuario();
        usuarioTemp.setPrimerNombre(request.getPrimerNombre());
        usuarioTemp.setSegundoNombre(request.getSegundoNombre());
        usuarioTemp.setPrimerApellido(request.getPrimerApellido());

        String passwordPlana = credentialGenerator.generarPasswordPlana(usuarioTemp);
        String passwordHasheada = passwordEncoder.encode(passwordPlana);

        // Crear la entidad Usuario
        Usuario nuevoPropietario = Usuario.builder()
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
                .rol(rolPropietario)
                .sucursalBase(sucursal)
                .intentosFallidos(0)
                .estadoAcceso(EstadoAcceso.ACTIVO)
                .build();

        Usuario guardado = usuarioRepository.save(nuevoPropietario);

        return PropietarioSetupResponse.builder()
                .id(guardado.getId())
                .ci(guardado.getCi())
                .primerNombre(guardado.getPrimerNombre())
                .primerApellido(guardado.getPrimerApellido())
                .rol(guardado.getRol().getNombreRol().name())
                .estadoAcceso(guardado.getEstadoAcceso().name())
                .passwordGenerada(passwordPlana)
                .mensaje("Propietario registrado exitosamente. Guarde sus credenciales.")
                .build();
    }

    public LoginResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByCi(request.getCi())
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas."));

        if (usuario.getEstadoAcceso() != EstadoAcceso.ACTIVO) {
            throw new RuntimeException("Acceso denegado: El usuario no se encuentra activo.");
        }

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Credenciales inválidas.");
        }

        String nombreCompleto = usuario.getPrimerNombre() + " " + usuario.getPrimerApellido();

        return LoginResponse.builder()
                .id(usuario.getId())
                .ci(usuario.getCi())
                .nombreCompleto(nombreCompleto)
                .rol(usuario.getRol().getNombreRol().name())
                .mensaje("Inicio de sesión exitoso.")
                .build();
    }
}
