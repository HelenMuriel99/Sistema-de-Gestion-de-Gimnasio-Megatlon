-- 1. Carga de Roles del sistema
INSERT OR IGNORE INTO rol (id, nombre_rol)
VALUES (1, 'PROPIETARIO'),
       (2, 'RECEPCIONISTA'),
       (3, 'INSTRUCTOR'),
       (4, 'CLIENTE');

-- 2. Carga de Sucursales iniciales
INSERT OR IGNORE INTO sucursal (id, nombre, direccion, telefono, activo)
VALUES (1, 'Sucursal Central', 'Av. Principal #123', '4441111', 1),
       (2, 'Sucursal Norte', 'Av. América #456', '4442222', 1);