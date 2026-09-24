# Sistema-de-Gestion-de-Gimnasio-Megatlon

Aplicación web para administrar un gimnasio: personal, clientes, planes, disciplinas y membresías, con acceso diferenciado por rol.

- **Backend:** API REST con Spring Boot, autenticación JWT y base de datos SQLite.
- **Frontend:** SPA en React con Vite y Tailwind CSS.

---

## 📑 Contenido

1. [Tecnologías](#-tecnologías)
2. [Estructura del proyecto](#-estructura-del-proyecto)
3. [Requisitos previos](#-requisitos-previos)
4. [Instalación y ejecución](#-instalación-y-ejecución)
5. [Credenciales por defecto](#-credenciales-por-defecto)
6. [Roles y permisos](#-roles-y-permisos)
7. [Perfiles de configuración](#-perfiles-de-configuración)
8. [API REST](#-api-rest)
9. [Reglas de negocio](#-reglas-de-negocio)
10. [Documentación QA](#-documentación-qa)

---

## 🧰 Tecnologías

| Capa | Tecnologías |
| --- | --- |
| Backend | Java 21, Spring Boot 4.1.0, Spring Web MVC, Spring Data JPA, Spring Security, Bean Validation, Lombok |
| Autenticación | JWT (jjwt 0.11.5), contraseñas con BCrypt |
| Base de datos | SQLite (`sqlite-jdbc` + `hibernate-community-dialects`) |
| Frontend | React 19, Vite, React Router 7, Axios, Tailwind CSS 4, lucide-react, jwt-decode |
| Herramientas | Maven Wrapper (`mvnw`), Oxlint |

---

## 📂 Estructura del proyecto

```text
Sistema-de-Gestion-de-Gimnasio-Megatlon-QA/
├── backend/
│   ├── db/                      # Base de datos SQLite (gimnasio_dev.db)
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/backend/megatlon/
│       │   ├── config/          # Seguridad, CORS, DataInitializer, CredentialGenerator
│       │   ├── controllers/     # Endpoints REST
│       │   ├── dto/             # Objetos de request/response
│       │   ├── enums/           # RolNombre, EstadoAcceso, TipoPlan
│       │   ├── exceptions/      # GlobalExceptionHandler
│       │   ├── models/          # Entidades JPA
│       │   ├── repositories/    # Repositorios Spring Data
│       │   ├── security/        # Filtro JWT, JwtService, UserDetailsService
│       │   └── services/        # Lógica de negocio
│       └── resources/           # application*.yaml y data.sql
├── frontend/
│   ├── src/
│   │   ├── components/          # Layout, modales de empleados
│   │   ├── context/             # AuthContext (sesión / token)
│   │   ├── pages/               # Login, Dashboard, Empleados, Clientes, Membresías, Pos
│   │   └── services/api.js      # Instancia de Axios con interceptor JWT
│   └── package.json
├── informe-qa-megatlon.md       # Informe de hallazgos de QA
└── README.md
```

---

## ✅ Requisitos previos

- **JDK 21**
- **Node.js 20 LTS o superior** y **npm**
- No hace falta instalar Maven: el proyecto incluye `mvnw` / `mvnw.cmd`.

---

## 🚀 Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd Sistema-de-Gestion-de-Gimnasio-Megatlon-QA
```

### 2. Levantar el backend

Ejecuta el comando **desde la carpeta `backend`**, porque la ruta de la base de datos (`./db/...`) es relativa.

```bash
cd backend
./mvnw spring-boot:run          # Linux / macOS
mvnw.cmd spring-boot:run        # Windows
```

- Se usa el perfil `dev` por defecto.
- El backend queda disponible en **http://localhost:8080**.
- Al iniciar, se cargan los roles y sucursales iniciales (`data.sql`) y se crea el usuario administrador por defecto si no existe (ver [Credenciales por defecto](#-credenciales-por-defecto)).

### 3. Levantar el frontend

```bash
cd frontend
npm install
npm run dev
```

- Vite mostrará la URL en consola (normalmente **http://localhost:5173**).
- El frontend apunta a `http://localhost:8080/api/v1` (definido en `frontend/src/services/api.js`). Si cambias el puerto del backend, actualiza ese archivo.

### Otros comandos útiles

| Comando | Descripción |
| --- | --- |
| `npm run build` | Genera el build de producción del frontend |
| `npm run preview` | Sirve localmente el build generado |
| `npm run lint` | Ejecuta Oxlint sobre el frontend |
| `./mvnw test` | Ejecuta las pruebas del backend |

---

## 🔑 Credenciales por defecto

Al arrancar por primera vez, el sistema crea automáticamente un usuario administrador (`DataInitializer`):

| Campo | Valor |
| --- | --- |
| **Usuario (CI)** | `1234567` |
| **Contraseña** | `admin123` |
| **Rol** | `PROPIETARIO` (administrador con acceso total) |
| **Sucursal base** | Sucursal Central |

> ℹ️ El rol de administrador del sistema se llama `PROPIETARIO`.
>
> ⚠️ **Solo para desarrollo y pruebas.** Cambia estas credenciales antes de desplegar en un entorno real. Además, `jwt.secret` está escrito directamente en `application-dev.yaml`: usa un secreto propio (por ejemplo, mediante variable de entorno) en producción.

### Inicio de sesión por API

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"ci": "1234567", "password": "admin123"}'
```

Respuesta:

```json
{
  "token": "<jwt>",
  "ci": "1234567",
  "nombreCompleto": "Admin Propietario",
  "rol": "PROPIETARIO",
  "sucursalId": 1,
  "sucursalNombre": "Sucursal Central"
}
```

Usa el token en las siguientes peticiones: `Authorization: Bearer <jwt>` (vigencia de 24 horas en `dev`).

### Contraseñas de usuarios nuevos

Al registrar empleados o clientes, la contraseña inicial se genera automáticamente con esta regla:

- Con segundo nombre → `primerNombre + segundoNombre + NN`
- Sin segundo nombre, con primer apellido → `primerNombre + primerApellido + NN`
- Sin segundo nombre ni primer apellido, con segundo apellido → `primerNombre + segundoApellido + NN`

Donde `NN` es un número aleatorio entre 10 y 99, y el texto va en minúsculas y sin espacios. El usuario inicia sesión con su **CI**.

---

## 👥 Roles y permisos

| Rol | Descripción | Opciones en el menú |
| --- | --- | --- |
| `PROPIETARIO` | Administrador. Gestiona personal, clientes, catálogo (planes y disciplinas) y membresías | Dashboard, Personal, Clientes, Membresías |
| `RECEPCIONISTA` | Atiende clientes: registro, consulta, edición, baja y renovación de plan | Dashboard, Clientes, Punto de Venta |
| `INSTRUCTOR` | Personal de instrucción | Dashboard |
| `CLIENTE` | Socio del gimnasio | — |

Los permisos se aplican en el backend con `@PreAuthorize` sobre cada controlador.

---

## ⚙️ Perfiles de configuración

El perfil activo se define en `backend/src/main/resources/application.yaml` (`spring.profiles.active`) o al ejecutar con `-Dspring-boot.run.profiles=<perfil>`.

| Perfil | Puerto | Base de datos | Comportamiento del esquema |
| --- | --- | --- | --- |
| `dev` (por defecto) | 8080 | `./db/gimnasio_dev.db` | `ddl-auto: update` (conserva los datos) |
| `qa` | 8081 | `./db/gimnasio_qa.db` | `create-drop` (se crea al iniciar y se elimina al apagar) |
| `prod` | 8080 | `./db/gimnasio_dev.db` | `update` + generación de scripts SQL |

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=qa
```

> Si usas `qa`, recuerda que corre en el puerto **8081** y el frontend apunta al **8080** por defecto.

---

## 🌐 API REST

URL base: `http://localhost:8080/api/v1`

Todos los endpoints, excepto `/auth/**`, requieren el header `Authorization: Bearer <jwt>`.

### Autenticación (pública)

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/auth/login` | Inicia sesión con `{ ci, password }` y devuelve el JWT |

### Propietario (`PROPIETARIO`)

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/propietario/empleados` | Registrar un empleado |
| `GET` | `/propietario/consultas/usuarios` | Listar usuarios |
| `GET` | `/propietario/consultas/usuarios/{ci}` | Consultar un usuario por CI |
| `PUT` | `/propietario/gestion/usuarios/{ci}` | Editar un usuario/empleado |
| `DELETE` | `/propietario/gestion/usuarios/{ci}` | Desactivar un usuario (baja lógica) |
| `POST` | `/propietario/clientes` | Registrar un cliente |
| `PUT` | `/propietario/clientes/{ci}/renovar-plan` | Renovar el plan de un cliente |
| `PUT` | `/propietario/gestion/clientes/{ci}` | Editar un cliente |
| `DELETE` | `/propietario/gestion/clientes/{ci}` | Dar de baja a un cliente |
| `GET` / `POST` | `/propietario/catalogo/disciplinas` | Listar / crear disciplinas |
| `GET` / `POST` | `/propietario/catalogo/planes` | Listar / crear planes |
| `PATCH` | `/propietario/catalogo/planes/{id}/precio` | Actualizar el precio de un plan |

### Recepcionista (`RECEPCIONISTA`)

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/recepcionista/clientes` | Registrar un cliente |
| `PUT` | `/recepcionista/clientes/{ci}/renovar-plan` | Renovar el plan de un cliente |
| `GET` | `/recepcionista/consultas/clientes` | Listar clientes |
| `GET` | `/recepcionista/consultas/clientes/{ci}` | Consultar un cliente por CI |
| `PUT` | `/recepcionista/gestion/clientes/{ci}` | Editar un cliente |
| `DELETE` | `/recepcionista/gestion/clientes/{ci}` | Dar de baja a un cliente |
| `GET` | `/recepcionista/catalogo/disciplinas` | Consultar disciplinas |
| `GET` | `/recepcionista/catalogo/planes` | Consultar planes |

### Instructor (`INSTRUCTOR`)

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/instructor/bienvenida` | Endpoint de bienvenida |

---

## 📐 Reglas de negocio

- **Planes** (`TipoPlan`): `FULL`, `ESPECIFICO` (asociado a una disciplina) y `SESION`. Cada plan tiene precio y duración en días.
- **Estados de acceso** (`EstadoAcceso`): `ACTIVO`, `BLOQUEADO_INTENTOS`, `BLOQUEADO_MORA` e `INACTIVO`. Solo los usuarios `ACTIVO` pueden iniciar sesión.
- **Vencimiento automático:** todos los días a las 00:00 un proceso programado pasa a `INACTIVO` las membresías vencidas y el acceso de sus clientes.
- **Baja lógica:** eliminar un usuario lo marca como `INACTIVO`; no se borra de la base de datos.
- **Sucursales iniciales:** Sucursal Central y Sucursal Norte.
- **Salario fijo por defecto de un empleado:** 3350.00.

---

## 🧪 Documentación QA

El archivo [`informe-qa-megatlon.md`](./informe-qa-megatlon.md) recoge los hallazgos de calidad detectados, entre ellos:

- El filtro JWT no captura tokens expirados o malformados (responde 500 en lugar de 401).
- Un token sigue siendo válido aunque el usuario sea desactivado o bloqueado.
- No existe un endpoint para reactivar usuarios.

### Pendientes conocidos

- El perfil `qa` no define `jwt.secret` ni carga `data.sql`, por lo que necesita esos ajustes para arrancar correctamente.
- `Pos.jsx` existe y el menú de `RECEPCIONISTA` enlaza a `/pos`, pero esa ruta aún no está registrada en `App.jsx`.

---

## 📄 Licencia

Proyecto académico / de demostración. Define aquí la licencia que corresponda.
