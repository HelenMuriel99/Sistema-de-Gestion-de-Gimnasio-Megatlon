package com.backend.megatlon.config;

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
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final SucursalRepository sucursalRepository;
    private final EmpleadoDetalleRepository empleadoDetalleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String ciPropietario = "1234567";

        if (!usuarioRepository.existsByCi(ciPropietario)) {
            Rol rolPropietario = rolRepository.findByNombreRol(RolNombre.PROPIETARIO)
                    .orElseThrow(() -> new RuntimeException("Error: Rol PROPIETARIO no encontrado en la BD."));

            Sucursal sucursalCentral = sucursalRepository.findById(1L)
                    .orElseThrow(() -> new RuntimeException("Error: Sucursal inicial no encontrada."));

            Usuario propietario = Usuario.builder()
                    .ci(ciPropietario)
                    .password(passwordEncoder.encode("admin123"))
                    .primerNombre("Admin")
                    .primerApellido("Propietario")
                    .fechaNacimiento(LocalDate.of(1990, 1, 1))
                    .genero("MASCULINO")
                    .telefono("77777777")
                    .direccion("Oficina Central")
                    .rol(rolPropietario)
                    .sucursalBase(sucursalCentral)
                    .intentosFallidos(0)
                    .estadoAcceso(EstadoAcceso.ACTIVO)
                    .build();

            Usuario guardado = usuarioRepository.save(propietario);

            EmpleadoDetalle detalle = EmpleadoDetalle.builder()
                    .usuario(guardado)
                    .salarioFijo(new BigDecimal("5000.00"))
                    .build();

            empleadoDetalleRepository.save(detalle);
            System.out.println(">>> Usuario PROPIETARIO inicializado correctamente.");
        }
    }
}