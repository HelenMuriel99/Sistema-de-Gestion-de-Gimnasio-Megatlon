-- 1. Insertar Roles
INSERT INTO rol (id, nombre_rol)
VALUES (1, 'PROPIETARIO'),
       (2, 'RECEPCIONISTA'),
       (3, 'INSTRUCTOR'),
       (4, 'CLIENTE');

-- 2. Insertar Sucursales (incluye columna activo)
INSERT INTO sucursal (id, nombre, direccion, telefono, activo)
VALUES (1, 'Sucursal Central', 'Av. Principal #123', '4441111', 1),
       (2, 'Sucursal Norte', 'Av. América #456', '4442222', 1);

-- 3. Insertar Usuarios (incluye intentos_fallidos y estado_acceso)
INSERT INTO usuario (id, ci, password, primer_nombre, primer_apellido,
                     fecha_nacimiento, genero, telefono, direccion,
                     rol_id, sucursal_base_id, intentos_fallidos, estado_acceso)
VALUES (1, '1234567', '$2a$10$eE/2fPjU12vC7y9W5J9zseE3HwW/7O.R8O0z2m8D2n8f5G1h3k5O', 'Admin', 'Propietario',
        '1990-01-01', 'MASCULINO', '77777777', 'Oficina Central', 1, 1, 0, 'ACTIVO'),
       (2, '2000001', '$2a$10$8.UnVuG9HHg7yWWRt3mJ.uI5g3S4G.F7J9k0L1M2N3O4P5Q6R7S8T', 'Maria', 'Lopez', '1995-05-12',
        'FEMENINO', '71111111', 'Av. Heroínas #55', 2, 1, 0, 'ACTIVO'),
       (3, '3000001', '$2a$10$8.UnVuG9HHg7yWWRt3mJ.uI5g3S4G.F7J9k0L1M2N3O4P5Q6R7S8T', 'Carlos', 'Gomez', '1988-03-20',
        'MASCULINO', '72222222', 'Calle España #200', 3, 1, 0, 'ACTIVO'),
       (4, '3000002', '$2a$10$8.UnVuG9HHg7yWWRt3mJ.uI5g3S4G.F7J9k0L1M2N3O4P5Q6R7S8T', 'Andrea', 'Rios', '1992-08-15',
        'FEMENINO', '72222223', 'Av. Ballivián #88', 3, 2, 0, 'ACTIVO'),
       (5, '4000001', '$2a$10$8.UnVuG9HHg7yWWRt3mJ.uI5g3S4G.F7J9k0L1M2N3O4P5Q6R7S8T', 'Juan', 'Perez', '2000-01-10',
        'MASCULINO', '74444441', 'Calle Calama #12', 4, 1, 0, 'ACTIVO');

-- 4. Insertar Detalles de Empleados
INSERT INTO empleado_detalle (id, usuario_id, salario_fijo)
VALUES (1, 1, 5000.00),
       (2, 2, 2800.00),
       (3, 3, 3500.00),
       (4, 4, 3500.00);