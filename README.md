## Metodología de Desarrollo: Scrum

El proyecto se desarrolla bajo el marco de trabajo ágil **Scrum**, organizando las entregas en sprints cortos orientados a valor, con revisiones técnicas y refinamiento continuo del Product Backlog.

### Roles del Equipo Scrum

| Rol Scrum | Integrante(s) | Responsabilidades en el Proyecto |
| :--- | :--- | :--- |
| **Product Owner / Scrum Master** | Líder de Grupo | Priorización del Product Backlog, coordinación de sprints y control de cronograma de entregas. |
| **Analista de Sistemas** | Kimberly Mariana Peredo Bristott | Levantamiento de reglas de negocio, modelado UML, definición de historias de usuario y validación de requerimientos[cite: 4]. |
| **Development Team (Frontend)** | Dev 2 | Maquetación e implementación de vistas de usuario, formularios de captura y manejo de alertas en interfaz. |
| **Development Team (Backend)** | Dev-Backend | Construcción de APIs, endpoints, esquemas de bases de datos, restricciones de integridad y lógica de negocio. |
| **QA / Testing** | Tester QA | Diseño y ejecución de matrices de prueba, pruebas de regresión e inspección de validaciones de campos. |

---

### Cronograma de Sprints y Revisiones Técnicas

| Iteración / Hito | Periodo / Fecha | Objetivos y Tareas Clave | Entregables / Resultados |
| :--- | :--- | :--- | :--- |
| **Sprint 1: Fase 1 (Requerimientos)** | Semanas 1 y 2 | Entrevistas con stakeholders, definición de RF/RNF y delimitación de alcances/límites[cite: 4, 5]. | Documento de Requerimientos y matriz de Alcances y Límites[cite: 4, 5]. |
| **Sprint 2: Fase 2 (Diseño y Modelado)** | Semanas 3 y 4 | Modelado de datos relacional, diseño de casos de uso (vista cliente/sistema) e historias de usuario[cite: 4]. | Diagramas UML (PlantUML), Historias de Usuario con Criterios de Aceptación[cite: 4]. |
| **Revisión 1 (Sprint Review / Refinamiento)** | 31/08/2026 | Auditoría interna de formularios de registro y autenticación. | Informe técnico: detección de fallas en inputs (nombres, teléfonos, edad >= 18 años) y eliminación de errores HTTP 500. |
| **Revisión 2 (Corrección y Despliegue)** | 31/08/2026 - 03/09/2026 | Aplicación de restricciones de unicidad de CI y desarrollo de registro de clientes en recepción[cite: 4]. | Formulario de clientes operativo en panel de recepcionista e integridad de CI en base de datos[cite: 4]. |
| **Revisión 3 (Sprint Refinement)** | 03/09/2026 | Análisis de nuevos requerimientos de negocio y casos de borde. | Informe de cambios: soporte multirrol para Administrador, separación de CI/Complemento y notificación de saldo en puerta[cite: 2, 4]. |

---

### Artefactos Scrum Aplicados

* **Product Backlog:** Registro centralizado de requerimientos funcionales, no funcionales e historias de usuario.
* **Sprint Backlog:** Subconjunto de historias de usuario y correcciones asignadas por rol en cada ciclo de revisión.
* **Incremento:** Módulos de software funcionales y versionados en el repositorio (`Git & GitHub`).
