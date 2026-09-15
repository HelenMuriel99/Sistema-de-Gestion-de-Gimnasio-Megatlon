package com.backend.megatlon.services;

import com.backend.megatlon.enums.EstadoAcceso;
import com.backend.megatlon.models.MembresiaCliente;
import com.backend.megatlon.repositories.MembresiaClienteRepository;
import com.backend.megatlon.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MembresiaExpiracionScheduler {

    private final MembresiaClienteRepository membresiaClienteRepository;
    private final UsuarioRepository usuarioRepository;

    // Se ejecuta automáticamente todos los días a medianoche (00:00:00)
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void verificarExpiracionMembresias() {
        LocalDate hoy = LocalDate.now();

        List<MembresiaCliente> membresiasAExpirar = membresiaClienteRepository.findAll().stream()
                .filter(m -> m.getEstadoMembresia() == EstadoAcceso.ACTIVO)
                .filter(m -> m.getFechaFin().isBefore(hoy))
                .toList();

        for (MembresiaCliente membresia : membresiasAExpirar) {
            membresia.setEstadoMembresia(EstadoAcceso.INACTIVO);

            // Inactivar acceso del cliente
            var cliente = membresia.getCliente();
            cliente.setEstadoAcceso(EstadoAcceso.INACTIVO);

            usuarioRepository.save(cliente);
            membresiaClienteRepository.save(membresia);
        }

        if (!membresiasAExpirar.isEmpty()) {
            log.info("Se inactivaron automáticamente {} membresías/clientes vencidos.", membresiasAExpirar.size());
        }
    }
}