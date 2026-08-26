package com.backend.megatlon.services;

import com.backend.megatlon.dto.SetupStatusResponse;
import com.backend.megatlon.enums.RolNombre;
import com.backend.megatlon.exceptions.BusinessRuleException;
import com.backend.megatlon.exceptions.ResourceNotFoundException;
import com.backend.megatlon.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.backend.megatlon.dto.SetupOwnerRequest;
import com.backend.megatlon.dto.SetupOwnerResponse;
import com.backend.megatlon.dto.UserCredentials;
import com.backend.megatlon.enums.EstadoAcceso;
import com.backend.megatlon.models.Rol;
import com.backend.megatlon.models.Sucursal;
import com.backend.megatlon.models.Usuario;
import com.backend.megatlon.repositories.RolRepository;
import com.backend.megatlon.repositories.SucursalRepository;
import com.backend.megatlon.utils.CredentialGenerator;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final RolRepository rolRepository;
    private final SucursalRepository sucursalRepository;
    private final PasswordEncoder passwordEncoder;

    private final UsuarioRepository usuarioRepository;


    @Transactional(readOnly = true)
    public SetupStatusResponse checkSetupStatus() {
        boolean existePropietario = usuarioRepository.existsByRolNombreRol(RolNombre.PROPIETARIO);

        if (!existePropietario) {
            return new SetupStatusResponse(
                    true,
                    "El sistema requiere la configuración inicial del usuario PROPIETARIO."
            );
        }

        return new SetupStatusResponse(
                false,
                "El sistema ya se encuentra configurado."
        );
    }

    @Transactional
    public SetupOwnerResponse registerInitialOwner(SetupOwnerRequest request) {
        // 1. Verificación de seguridad: Evitar ejecuciones duplicadas si el Propietario ya existe
        boolean existePropietario = usuarioRepository.existsByRolNombreRol(RolNombre.PROPIETARIO);
        if (existePropietario) {
            throw new BusinessRuleException("El sistema ya cuenta con un usuario PROPIETARIO configurado.");
        }

        // 2. Validar que el CI no esté registrado previamente
        if (usuarioRepository.existsByCi(request.ci())) {
            throw new BusinessRuleException("El CI ingresado ya se encuentra registrado en el sistema.");
        }

        // 3. Buscar el Rol PROPIETARIO obligatoriamente
        Rol rolPropietario = rolRepository.findByNombreRol(RolNombre.PROPIETARIO)
                .orElseThrow(() -> new ResourceNotFoundException("Error: El Rol PROPIETARIO no está inicializado en la BD."));

        // 4. Asignar Sucursal Base (Se usa la especificada o la primera sucursal disponible)
        Long sucursalId = (request.sucursalBaseId() != null) ? request.sucursalBaseId() : 1L;
        Sucursal sucursalBase = sucursalRepository.findById(sucursalId)
                .orElseThrow(() -> new RuntimeException("Error: No se encontró la sucursal base indicada."));

        // 5. Generar credenciales dinámicas con nuestra regla de negocio
        UserCredentials credentials = CredentialGenerator.generateCredentials(
                request.ci(),
                request.primerNombre(),
                request.segundoNombre(),
                request.primerApellido()
        );

        // 6. Construir entidad Usuario y Hash de Contraseña
        Usuario nuevoPropietario = Usuario.builder()
                .ci(credentials.username())
                .password(passwordEncoder.encode(credentials.rawPassword())) // Encriptación con BCrypt
                .primerNombre(request.primerNombre().trim())
                .segundoNombre(request.segundoNombre() != null ? request.segundoNombre().trim() : null)
                .primerApellido(request.primerApellido().trim())
                .segundoApellido(request.segundoApellido() != null ? request.segundoApellido().trim() : null)
                .fechaNacimiento(request.fechaNacimiento())
                .genero(request.genero())
                .telefono(request.telefono())
                .direccion(request.direccion())
                .rol(rolPropietario)
                .sucursalBase(sucursalBase)
                .intentosFallidos(0)
                .estadoAcceso(EstadoAcceso.ACTIVO)
                .build();

        // 7. Persistir en la Base de Datos
        Usuario propietarioGuardado = usuarioRepository.save(nuevoPropietario);

        // 8. Retornar respuesta con las credenciales en texto plano generadas
        return new SetupOwnerResponse(
                propietarioGuardado.getId(),
                propietarioGuardado.getCi(),
                propietarioGuardado.getPrimerNombre(),
                propietarioGuardado.getPrimerApellido(),
                credentials.username(),
                credentials.rawPassword(), // Contraseña en texto plano para entregar/mostrar en Frontend
                "Propietario registrado exitosamente."
        );
    }
}