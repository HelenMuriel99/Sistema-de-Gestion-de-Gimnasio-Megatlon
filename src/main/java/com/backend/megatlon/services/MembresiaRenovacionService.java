package com.backend.megatlon.services;

import com.backend.megatlon.dto.ClienteResponse;
import com.backend.megatlon.dto.RenovarMembresiaRequest;
import com.backend.megatlon.enums.EstadoAcceso;
import com.backend.megatlon.enums.RolNombre;
import com.backend.megatlon.enums.TipoPlan;
import com.backend.megatlon.models.*;
import com.backend.megatlon.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class MembresiaRenovacionService {

    private final UsuarioRepository usuarioRepository;
    private final PlanRepository planRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final MembresiaClienteRepository membresiaClienteRepository;

    @Transactional
    public ClienteResponse renovarPlanCliente(String ciCliente, RenovarMembresiaRequest request, String ciEjecutor) {

        // 1. Obtener ejecutor (Propietario o Recepcionista)
        Usuario ejecutor = usuarioRepository.findByCiWithRelations(ciEjecutor)
                .orElseThrow(() -> new IllegalArgumentException("Usuario ejecutor no encontrado."));

        // 2. Buscar Cliente
        Usuario cliente = usuarioRepository.findByCiWithRelations(ciCliente)
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado con CI: " + ciCliente));

        if (cliente.getRol().getNombreRol() != RolNombre.CLIENTE) {
            throw new IllegalArgumentException("El usuario debe tener rol CLIENTE.");
        }

        // 3. Validar sucursal si quien ejecuta es RECEPCIONISTA
        boolean esPropietario = ejecutor.getRol().getNombreRol() == RolNombre.PROPIETARIO;
        if (!esPropietario && !cliente.getSucursalBase().getId().equals(ejecutor.getSucursalBase().getId())) {
            throw new IllegalArgumentException("Acceso denegado: El cliente pertenece a otra sucursal.");
        }

        // 4. Buscar nuevo Plan y Disciplina
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

        // 5. Actualizar o Crear Membresía
        MembresiaCliente membresia = membresiaClienteRepository.findByClienteIdWithRelations(cliente.getId())
                .orElse(MembresiaCliente.builder().cliente(cliente).build());

        LocalDate hoy = LocalDate.now();
        LocalDate fechaFin = plan.getTipoPlan() == TipoPlan.SESION ? hoy : hoy.plusDays(plan.getDuracionDias());

        membresia.setPlan(plan);
        membresia.setDisciplina(disciplina);
        membresia.setFechaInicio(hoy);
        membresia.setFechaFin(fechaFin);
        membresia.setEstadoMembresia(EstadoAcceso.ACTIVO);

        membresiaClienteRepository.save(membresia);

        // 6. Reactivar estado de acceso del usuario
        cliente.setEstadoAcceso(EstadoAcceso.ACTIVO);
        usuarioRepository.save(cliente);

        // 7. Retornar Respuesta
        String nombreCompleto = (cliente.getPrimerNombre() + " " +
                (cliente.getSegundoNombre() != null ? cliente.getSegundoNombre() + " " : "") +
                cliente.getPrimerApellido() + " " +
                (cliente.getSegundoApellido() != null ? cliente.getSegundoApellido() : "")).trim();

        return ClienteResponse.builder()
                .id(cliente.getId())
                .ci(cliente.getCi())
                .primerNombre(cliente.getPrimerNombre())
                .segundoNombre(cliente.getSegundoNombre())
                .primerApellido(cliente.getPrimerApellido())
                .segundoApellido(cliente.getSegundoApellido())
                .nombreCompleto(nombreCompleto)
                .fechaNacimiento(cliente.getFechaNacimiento())
                .genero(cliente.getGenero())
                .telefono(cliente.getTelefono())
                .direccion(cliente.getDireccion())
                .rol(cliente.getRol().getNombreRol().name())
                .sucursalId(cliente.getSucursalBase().getId())
                .sucursalNombre(cliente.getSucursalBase().getNombre())
                .estadoAcceso(cliente.getEstadoAcceso().name())
                .planNombre(plan.getNombre())
                .tipoPlan(plan.getTipoPlan().name())
                .planPrecio(plan.getPrecio())
                .disciplinaNombre(disciplina != null ? disciplina.getNombre() : "TODAS LAS DISCIPLINAS")
                .fechaInicioMembresia(hoy)
                .fechaFinMembresia(fechaFin)
                .build();
    }
}