/* package com.backend.megatlon.services;

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
} */

package com.backend.megatlon.services;

import com.backend.megatlon.dto.ClienteResponse;
import com.backend.megatlon.dto.RegistrarClienteRequest;
import com.backend.megatlon.enums.EstadoAcceso;
import com.backend.megatlon.enums.RolNombre;
import com.backend.megatlon.enums.TipoPlan;
import com.backend.megatlon.models.*;
import com.backend.megatlon.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class PropietarioClienteRegistroService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final SucursalRepository sucursalRepository;
    private final PlanRepository planRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final MembresiaClienteRepository membresiaClienteRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public ClienteResponse registrarCliente(RegistrarClienteRequest request, Long sucursalId) {

        // 1. Validaciones de duplicados
        if (usuarioRepository.existsByCi(request.getCi())) {
            throw new IllegalArgumentException("Ya existe un usuario registrado con el CI: " + request.getCi());
        }

        if (request.getTelefono() != null && usuarioRepository.existsByTelefono(request.getTelefono())) {
            throw new IllegalArgumentException("Ya existe un usuario con ese telefono: " + request.getTelefono());
        }

        // 2. Validar Sucursal especificada por el Propietario
        Sucursal sucursal = sucursalRepository.findById(sucursalId)
                .orElseThrow(() -> new IllegalArgumentException("No se encontró la sucursal con ID: " + sucursalId));

        // 3. Validar Plan y Disciplina opcional
        Plan plan = planRepository.findById(request.getPlanId())
                .orElseThrow(() -> new IllegalArgumentException("Plan no encontrado con ID: " + request.getPlanId()));

        Disciplina disciplina = null;
        if (plan.getTipoPlan() == TipoPlan.ESPECIFICO) {
            if (request.getDisciplinaId() == null) {
                throw new IllegalArgumentException("Debe seleccionar una disciplina para el plan ESPECIFICO.");
            }
            disciplina = disciplinaRepository.findById(request.getDisciplinaId())
                    .orElseThrow(() -> new IllegalArgumentException("Disciplina no encontrada con ID: " + request.getDisciplinaId()));
        }

        // 4. Obtener el rol CLIENTE
        Rol rolCliente = rolRepository.findByNombreRol(RolNombre.CLIENTE)
                .orElseThrow(() -> new RuntimeException("El rol CLIENTE no está configurado en el sistema."));

        // 5. Crear e insertar la entidad Usuario
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

        // 6. Asignar Fechas de Vigencia y Registrar Membresía
        LocalDate hoy = LocalDate.now();
        LocalDate fechaFin = plan.getTipoPlan() == TipoPlan.SESION ? hoy : hoy.plusDays(plan.getDuracionDias());

        MembresiaCliente membresia = MembresiaCliente.builder()
                .cliente(clienteGuardado)
                .plan(plan)
                .disciplina(disciplina)
                .fechaInicio(hoy)
                .fechaFin(fechaFin)
                .estadoMembresia(EstadoAcceso.ACTIVO)
                .build();

        membresiaClienteRepository.save(membresia);

        // 7. Mapear respuesta
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
                .planNombre(plan.getNombre())
                .tipoPlan(plan.getTipoPlan().name())
                .planPrecio(plan.getPrecio())
                .disciplinaNombre(disciplina != null ? disciplina.getNombre() : "TODAS LAS DISCIPLINAS")
                .fechaInicioMembresia(hoy)
                .fechaFinMembresia(fechaFin)
                .build();
    }
}