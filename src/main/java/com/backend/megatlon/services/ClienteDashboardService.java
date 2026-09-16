package com.backend.megatlon.services;

import com.backend.megatlon.dto.ClienteDashboardResponse;
import com.backend.megatlon.models.MembresiaCliente;
import com.backend.megatlon.models.Usuario;
import com.backend.megatlon.repositories.MembresiaClienteRepository;
import com.backend.megatlon.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClienteDashboardService {

    private final UsuarioRepository usuarioRepository;
    private final MembresiaClienteRepository membresiaClienteRepository;

    @Transactional(readOnly = true)
    public ClienteDashboardResponse obtenerDashboardCliente(String ciCliente) {
        Usuario cliente = usuarioRepository.findByCiWithRelations(ciCliente)
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado con CI: " + ciCliente));

        Optional<MembresiaCliente> membresiaOpt = membresiaClienteRepository.findByClienteIdWithRelations(cliente.getId());

        String nombreCompleto = (cliente.getPrimerNombre() + " " +
                (cliente.getSegundoNombre() != null ? cliente.getSegundoNombre() + " " : "") +
                cliente.getPrimerApellido() + " " +
                (cliente.getSegundoApellido() != null ? cliente.getSegundoApellido() : "")).trim();

        ClienteDashboardResponse.ClienteDashboardResponseBuilder builder = ClienteDashboardResponse.builder()
                .mensaje("¡Bienvenido al Panel de Cliente Megatlon!")
                .ci(cliente.getCi())
                .nombreCliente(nombreCompleto)
                .sucursalNombre(cliente.getSucursalBase().getNombre())
                .estadoAcceso(cliente.getEstadoAcceso().name());

        if (membresiaOpt.isPresent()) {
            MembresiaCliente m = membresiaOpt.get();
            LocalDate hoy = LocalDate.now();

            // Si la fecha fin es anterior a hoy, los días restantes son 0
            long dias = m.getFechaFin().isBefore(hoy) ? 0 : ChronoUnit.DAYS.between(hoy, m.getFechaFin());

            builder.planNombre(m.getPlan().getNombre())
                    .tipoPlan(m.getPlan().getTipoPlan().name())
                    .disciplinaNombre(m.getDisciplina() != null ? m.getDisciplina().getNombre() : "TODAS LAS DISCIPLINAS")
                    .fechaInicio(m.getFechaInicio())
                    .fechaFin(m.getFechaFin())
                    .diasRestantes(dias);
        } else {
            builder.planNombre("SIN PLAN ACTIVO")
                    .tipoPlan("N/A")
                    .disciplinaNombre("N/A")
                    .diasRestantes(0);
        }

        return builder.build();
    }
}