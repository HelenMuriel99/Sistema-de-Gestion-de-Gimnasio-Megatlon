-- 1. Insertar Roles
INSERT INTO rol (id, nombre_rol)
VALUES (1, 'PROPIETARIO'),
       (2, 'RECEPCIONISTA'),
       (3, 'INSTRUCTOR'),
       (4, 'CLIENTE');

-- 2. Insertar 4 Sucursales iniciales
INSERT INTO sucursal (id, nombre, direccion, telefono, activo)
VALUES (1, 'Sucursal Central', 'Av. Principal #123', '4441111', 1),
       (2, 'Sucursal Norte', 'Av. América #456', '4442222', 1),
       (3, 'Sucursal Sur', 'Av. Petrolera #789', '4443333', 1),
       (4, 'Sucursal Este', 'Av. Villazón #101', '4444444', 1);