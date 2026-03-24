# 🌐 Propuesta de Implementación Frontend: SaasClinico (v1.0)

Esta propuesta detalla la arquitectura, el diseño y las funcionalidades necesarias para construir un frontend de nivel empresarial para el sistema **SaaS de Gestión Clínica Multi-Especialidad**. El objetivo es ofrecer una experiencia de usuario (UX) excepcional, rápida, escalable y visualmente impactante.

---

## 🏗️ Stack Tecnológico Recomendado

Para garantizar el rendimiento y la escalabilidad, se propone el siguiente stack moderno:

*   **Framework:** [Next.js 14+](https://nextjs.org/) (App Router) - Optimización SEO, renderizado híbrido (SSR/CSR) y rutas dinámicas.
*   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) - Seguridad de tipos y mantenibilidad.
*   **Estilos:** [Tailwind CSS](https://tailwindcss.com/) - Diseño rápido y consistente.
*   **Componentes UI:** [Shadcn/UI](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) - Componentes accesibles, altamente personalizables y con estética minimalista.
*   **Gestión de Estado & Fetching:** [TanStack Query (React Query) v5](https://tanstack.com/query/latest) - Sincronización de datos con el servidor, cacheo automático y manejo de estados de carga/error.
*   **Formularios:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) - Validación de esquemas robusta y eficiente.
*   **Iconografía:** [Lucide React](https://lucide.dev/) - Iconos consistentes y ligeros.
*   **Visualización de Datos:** [Tremor](https://www.tremor.so/) o [Recharts](https://recharts.org/) - Dashboards analíticos limpios.
*   **Calendarios:** [FullCalendar](https://fullcalendar.io/) o [React Day Picker](https://react-day-picker.js.org/).

---

## 🎨 Concepto de Diseño (UI/UX)

*   **Paleta de Colores:** 
    *   **Primario:** Azul Médico (`#0F172A` - Slate 900 / `#2563EB` - Blue 600) para transmitir confianza y profesionalismo.
    *   **Secundario:** Esmeralda (`#10B981` - Emerald 500) para indicar salud y éxito en acciones.
    *   **Fondo:** Gris muy claro (`#F8FAFC` - Slate 50) para evitar la fatiga visual.
*   **Tipografía:** Inter (Sans-serif) para legibilidad en interfaces de datos densos.
*   **Interacciones:** Micro-animaciones con [Framer Motion](https://www.framer.com/motion/) para feedback táctil (ej. al guardar, al abrir modales).

---

## 🛠️ Arquitectura del Frontend

El proyecto seguirá una estructura modular basada en dominios para facilitar la escalabilidad:

```text
src/
├── app/              # Next.js App Router (Páginas y Layouts)
├── components/       # Componentes compartidos (Buttons, Inputs, Modals)
│   └── ui/           # Componentes base de Shadcn
├── features/         # Lógica por dominio (Auth, Patients, Appointments, Billing)
│   ├── components/   # Componentes específicos del dominio
│   ├── hooks/        # Custom hooks (usePatients, useAuth)
│   ├── services/     # Llamadas a la API (Axios/Fetch)
│   └── types/        # Interfaces de TypeScript
├── hooks/            # Hooks globales (useDebounce, useLocalStorage)
├── lib/              # Configuraciones (Axios instance, Utils)
├── store/            # Estado global ligero (Zustand)
└── types/            # Tipos globales del sistema
```

---

## 📱 Mapa del Sitio y Pantallas Detalladas

### 1. Autenticación (Auth)
*   **Login Multi-Tenant:**
    *   **Campos:** Email, Password, ID Clínica (o detección automática por subdominio).
    *   **Interacción:** Botón con estado de carga ("Iniciando sesión..."), validación en tiempo real.
    *   **Seguridad:** Almacenamiento de JWT en cookies seguras (HttpOnly) para evitar XSS.
*   **Registro de Clínica:**
    *   Stepper de 3 pasos: (1) Datos de la Clínica, (2) Cuenta de Administrador, (3) Confirmación.

### 2. Dashboard Principal (Vistas por Rol)
*   **Administrador:** Resumen financiero, cantidad de pacientes activos, citas del día, ocupación de doctores.
*   **Doctor:** Lista de citas próximas, acceso rápido a "Atender Paciente", notificaciones de laboratorio pendientes.
*   **Recepcionista:** Calendario general, gestión de pagos rápidos, registro de nuevos pacientes.

### 3. Gestión de Pacientes (`/patients`)
*   **Pantalla de Listado:** Tabla con filtros avanzados (Cédula, Nombre, Última visita), paginación y búsqueda asíncrona.
*   **Pantalla de Detalle (Expediente):** 
    *   **Header:** Foto (opcional), datos básicos y alertas médicas (alergias en rojo).
    *   **Tabs:** Historia Clínica, Consultas Pasadas, Recetas, Laboratorio, Facturación.
    *   **Botón de Acción:** "Nueva Cita", "Iniciar Consulta".

### 4. Agenda de Citas (`/appointments`)
*   **Vista de Calendario:** Selector de vista (Día, Semana, Mes). Drag & drop para representar citas.
*   **Modal de Nueva Cita:** Búsqueda rápida de paciente, selección de especialidad -> doctor -> horario disponible.
*   **Interacción:** Los horarios ocupados deben aparecer bloqueados visualmente mediante una lógica de consulta al backend.

### 5. Módulo de Consulta Médica (`/consultations/new/:id_cita`)
*   **Interfaz de Escritorio del Doctor:**
    *   **Sección Diagnóstico:** Editor de texto enriquecido (Rich Text) o campos específicos para síntomas y diagnóstico.
    *   **Sección Tratamiento:** Selector de medicamentos (con búsqueda predictiva del catálogo compartido), dosis y frecuencia.
    *   **Acción Final:** Botón "Finalizar y Generar Receta" -> Abre vista de impresión o envío por email.

### 6. Facturación y Pagos (`/billing`)
*   **Listado de Facturas:** Filtros por estado (Pendiente, Pagado, Parcial).
*   **Modal de Pago:** Registro de monto recibido, método de pago (Efectivo, Tarjeta, Transferencia).
*   **Generación de PDF:** Vista previa de la factura estética antes de descargar.

---

## 🔌 Comunicación con el Backend

*   **Instancia de Axios:** Configurada con interceptores para añadir el `Authorization: Bearer <token>` y el header de Tenant ID.
*   **TanStack Query:** Gestión de estados asíncronos y caché de datos.

---

## 🚀 Escalabilidad y Calidad

1.  **Lazy Loading:** Carga diferida de módulos pesados.
2.  **Responsividad:** Diseño Mobile-First.
3.  **Tests:** Tests unitarios y de integración.
4.  **Internacionalización (i18n):** Preparado para múltiples idiomas.

---
**Elaborado por:** Gemini CLI / Senior Frontend Architect
**Fecha:** 23 de Marzo de 2026
