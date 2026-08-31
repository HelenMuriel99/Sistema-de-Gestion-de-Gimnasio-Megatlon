# Sistema-de-Gestion-de-Gimnasio-Megatlon
Sistema integral para la administración operativa, gestión de aforos por disciplinas, control financiero y registro de asistencia en puerta para las 4 sucursales del gimnasio MEGATLÓN.
---
## Estructura del Proyecto
### Fase 1: Levantamiento y Análisis Inicial
Esta fase documenta los requerimientos del negocio y establece el marco operativo del software:
* **Entrevistas Iniciales:** Relevamiento de reglas de negocio, disciplinas (Spinning, Zumba, Cardio, Pesas), capacidad por áreas y modalidades de atención.
* **Especificación de Requerimientos:**
  * Requerimientos Funcionales (RF): Gestión de inscripciones, administración de planes, reservas de cupos, tiqueo de personal y clientes, y control de morosidad.
  * Requerimientos No Funcionales (RNF): Disponibilidad 24/7, tolerancia a fallos, seguridad en accesos (máximo 3 intentos) y auditoría de eventos.
* **Alcances y Límites del Sistema:** Delimitación de las funcionalidades incluidas (administración multisucursal, lógica de cobros en cuotas, cálculo de retrasos a instructores) y las exclusiones explícitas (planes de entrenamiento físico, desarrollo de app móvil nativa, facturación tributaria compleja).
---
### Fase 2: Diseño y Especificación Técnica
Esta fase abarca la modelación de datos y la experiencia funcional del usuario final:
* **Base de Datos:** Modelo de datos diseñado para dar soporte a la gestión de clientes, cobros, planes, sucursales y control de asistencias.
* **Casos de Uso (Vista del Cliente):** 
  * Modelado en UML (PlantUML) del flujo de acceso en terminales físicas de entrada.
  * Inclusiones (`<<include>>`): Validación de intentos fallidos, verificación de solvencia/pago y débito de cupo.
  * Extensiones (`<<extend>>`): Despliegue en pantalla del saldo de accesos restantes.
* **Historias de Usuario (Vista del Cliente):**
  * Especificación detallada bajo el estándar *Como... Quiero... Para...*
  * Criterios de Aceptación (CA) para el inicio de sesión en puerta, consumo de ingresos por visita y bloqueo automático por deudas no saldadas tras 5 días de gracia.
---
## Tecnologías y Herramientas Empleadas
* **Modelado UML:** PlantUML / Draw.io
* **Gestión de Versiones:** Git & GitHub
