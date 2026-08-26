
    create table empleado_detalle (
        salario_fijo numeric(10,2) not null,
        id integer,
        usuario_id bigint not null unique,
        primary key (id)
    );

    create table rol (
        id integer,
        nombre_rol varchar(50) not null unique check ((nombre_rol in ('PROPIETARIO','RECEPCIONISTA','INSTRUCTOR','CLIENTE'))),
        primary key (id)
    );

    create table sucursal (
        activo boolean not null,
        id integer,
        telefono varchar(20),
        nombre varchar(100) not null,
        direccion varchar(255),
        primary key (id)
    );

    create table usuario (
        fecha_nacimiento date,
        intentos_fallidos integer not null,
        id,
        rol_id bigint not null,
        sucursal_base_id bigint not null,
        ci varchar(20) not null unique,
        genero varchar(20),
        telefono varchar(20),
        primer_apellido varchar(50) not null,
        primer_nombre varchar(50) not null,
        segundo_apellido varchar(50),
        segundo_nombre varchar(50),
        direccion varchar(255),
        estado_acceso varchar(255) not null check ((estado_acceso in ('ACTIVO','BLOQUEADO_INTENTOS','BLOQUEADO_MORA','INACTIVO'))),
        password varchar(255) not null,
        primary key (id)
    );

    create table empleado_detalle (
        salario_fijo numeric(10,2) not null,
        id integer,
        usuario_id bigint not null unique,
        primary key (id)
    );

    create table rol (
        id integer,
        nombre_rol varchar(50) not null unique check ((nombre_rol in ('PROPIETARIO','RECEPCIONISTA','INSTRUCTOR','CLIENTE'))),
        primary key (id)
    );

    create table sucursal (
        activo boolean not null,
        id integer,
        telefono varchar(20),
        nombre varchar(100) not null,
        direccion varchar(255),
        primary key (id)
    );

    create table usuario (
        fecha_nacimiento date,
        intentos_fallidos integer not null,
        id,
        rol_id bigint not null,
        sucursal_base_id bigint not null,
        ci varchar(20) not null unique,
        genero varchar(20),
        telefono varchar(20),
        primer_apellido varchar(50) not null,
        primer_nombre varchar(50) not null,
        segundo_apellido varchar(50),
        segundo_nombre varchar(50),
        direccion varchar(255),
        estado_acceso varchar(255) not null check ((estado_acceso in ('ACTIVO','BLOQUEADO_INTENTOS','BLOQUEADO_MORA','INACTIVO'))),
        password varchar(255) not null,
        primary key (id)
    );

    create table empleado_detalle (
        salario_fijo numeric(10,2) not null,
        id integer,
        usuario_id bigint not null unique,
        primary key (id)
    );

    create table rol (
        id integer,
        nombre_rol varchar(50) not null unique check ((nombre_rol in ('PROPIETARIO','RECEPCIONISTA','INSTRUCTOR','CLIENTE'))),
        primary key (id)
    );

    create table sucursal (
        activo boolean not null,
        id integer,
        telefono varchar(20),
        nombre varchar(100) not null,
        direccion varchar(255),
        primary key (id)
    );

    create table usuario (
        fecha_nacimiento date,
        intentos_fallidos integer not null,
        id,
        rol_id bigint not null,
        sucursal_base_id bigint not null,
        ci varchar(20) not null unique,
        genero varchar(20),
        telefono varchar(20),
        primer_apellido varchar(50) not null,
        primer_nombre varchar(50) not null,
        segundo_apellido varchar(50),
        segundo_nombre varchar(50),
        direccion varchar(255),
        estado_acceso varchar(255) not null check ((estado_acceso in ('ACTIVO','BLOQUEADO_INTENTOS','BLOQUEADO_MORA','INACTIVO'))),
        password varchar(255) not null,
        primary key (id)
    );

    create table empleado_detalle (
        salario_fijo numeric(10,2) not null,
        id integer,
        usuario_id bigint not null unique,
        primary key (id)
    );

    create table rol (
        id integer,
        nombre_rol varchar(50) not null unique check ((nombre_rol in ('PROPIETARIO','RECEPCIONISTA','INSTRUCTOR','CLIENTE'))),
        primary key (id)
    );

    create table sucursal (
        activo boolean not null,
        id integer,
        telefono varchar(20),
        nombre varchar(100) not null,
        direccion varchar(255),
        primary key (id)
    );

    create table usuario (
        fecha_nacimiento date,
        intentos_fallidos integer not null,
        id,
        rol_id bigint not null,
        sucursal_base_id bigint not null,
        ci varchar(20) not null unique,
        genero varchar(20),
        telefono varchar(20),
        primer_apellido varchar(50) not null,
        primer_nombre varchar(50) not null,
        segundo_apellido varchar(50),
        segundo_nombre varchar(50),
        direccion varchar(255),
        estado_acceso varchar(255) not null check ((estado_acceso in ('ACTIVO','BLOQUEADO_INTENTOS','BLOQUEADO_MORA','INACTIVO'))),
        password varchar(255) not null,
        primary key (id)
    );

    create table empleado_detalle (
        salario_fijo numeric(10,2) not null,
        id integer,
        usuario_id bigint not null unique,
        primary key (id)
    );

    create table rol (
        id integer,
        nombre_rol varchar(50) not null unique check ((nombre_rol in ('PROPIETARIO','RECEPCIONISTA','INSTRUCTOR','CLIENTE'))),
        primary key (id)
    );

    create table sucursal (
        activo boolean not null,
        id integer,
        telefono varchar(20),
        nombre varchar(100) not null,
        direccion varchar(255),
        primary key (id)
    );

    create table usuario (
        fecha_nacimiento date,
        intentos_fallidos integer not null,
        id,
        rol_id bigint not null,
        sucursal_base_id bigint not null,
        ci varchar(20) not null unique,
        genero varchar(20),
        telefono varchar(20),
        primer_apellido varchar(50) not null,
        primer_nombre varchar(50) not null,
        segundo_apellido varchar(50),
        segundo_nombre varchar(50),
        direccion varchar(255),
        estado_acceso varchar(255) not null check ((estado_acceso in ('ACTIVO','BLOQUEADO_INTENTOS','BLOQUEADO_MORA','INACTIVO'))),
        password varchar(255) not null,
        primary key (id)
    );

    create table empleado_detalle (
        salario_fijo numeric(10,2) not null,
        id integer,
        usuario_id bigint not null unique,
        primary key (id)
    );

    create table rol (
        id integer,
        nombre_rol varchar(50) not null unique check ((nombre_rol in ('PROPIETARIO','RECEPCIONISTA','INSTRUCTOR','CLIENTE'))),
        primary key (id)
    );

    create table sucursal (
        activo boolean not null,
        id integer,
        telefono varchar(20),
        nombre varchar(100) not null,
        direccion varchar(255),
        primary key (id)
    );

    create table usuario (
        fecha_nacimiento date,
        intentos_fallidos integer not null,
        id,
        rol_id bigint not null,
        sucursal_base_id bigint not null,
        ci varchar(20) not null unique,
        genero varchar(20),
        telefono varchar(20),
        primer_apellido varchar(50) not null,
        primer_nombre varchar(50) not null,
        segundo_apellido varchar(50),
        segundo_nombre varchar(50),
        direccion varchar(255),
        estado_acceso varchar(255) not null check ((estado_acceso in ('ACTIVO','BLOQUEADO_INTENTOS','BLOQUEADO_MORA','INACTIVO'))),
        password varchar(255) not null,
        primary key (id)
    );
