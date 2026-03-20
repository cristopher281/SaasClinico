# 🏥 SaaS Gestión Clínica Multi-Especialidad

## Información General

| Concepto | Detalle |
|---|---|
| **Tipo** | SaaS Multi-Tenant |
| **Arquitectura** | Modular Monolith |
| **Base de datos** | PostgreSQL con RLS (Row-Level Security) |
| **Stack** | Next.js · NestJS · Docker · Nginx · JWT |
| **Multi-tenancy** | Shared Database — aislamiento por `id_clinica` |
| **Infraestructura** | Docker Compose (PostgreSQL) |

---

## Diagrama de Relaciones

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                              FLUJO PRINCIPAL DEL SISTEMA                             │
└──────────────────────────────────────────────────────────────────────────────────────┘

  ┌───────────┐         ┌───────────┐        ┌───────────────┐
  │ clinicas  │ 1────N  │ usuarios  │        │especialidades │
  │  (tenant) │         │           │        │  (catálogo)   │
  └─────┬─────┘         └─────┬─────┘        └───────┬───────┘
        │                     │                      │
        │ 1────N        FK: id_usuario         FK: id_especialidad
        │                     │                      │
        │               ┌─────▼──────────────────────▼───┐
        ├──── 1────N ──►│           doctores              │
        │               └─────────────┬──────────────────-┘
        │                             │
        │    ┌────────────┐     FK: id_doctor
        │    │ pacientes  │           │
        │◄───┤            │     ┌─────▼─────┐
        │    └──────┬─────┘     │   citas   │
        │           │           │           │
        │     FK: id_paciente   └─────┬─────┘
        │           │                 │
        │           └────────►────────┘
        │                             │
        │                    ┌────────▼────────┐
        │                    │    consultas    │
        │                    └───┬──────┬──────┘
        │                        │      │
        │              ┌─────────┘      └──────────┐
        │              ▼                           ▼
        │       ┌────────────┐             ┌──────────────┐
        │       │  recetas   │             │ laboratorio  │
        │       └──────┬─────┘             └──────────────┘
        │              │
        │       ┌──────▼───────────┐     ┌──────────────┐
        │       │receta_medicamento│◄────┤ medicamentos │
        │       └──────────────────┘     │  (catálogo)  │
        │                                └──────────────┘
        │
        │         ┌────────────┐       ┌──────────┐
        │         │  facturas  │──────►│  pagos   │
        │         └──────┬─────┘       └──────────┘
        │                │
        └────────────────┘
                   (vía citas)
```

---

## Tablas del Sistema (13)

### 🏢 Tenant Principal

| Tabla | Descripción | Campos clave |
|---|---|---|
| `clinicas` | Cada clínica es un tenant del SaaS | `nombre`, `telefono`, `email` |

### 📋 Catálogos Globales (compartidos entre clínicas)

| Tabla | Descripción | Campos clave |
|---|---|---|
| `especialidades` | Especialidades médicas disponibles | `nombre`, `descripcion` |
| `medicamentos` | Catálogo maestro de medicamentos | `nombre`, `descripcion` |

### 👤 Gestión de Usuarios (aislados por clínica)

| Tabla | Descripción | Campos clave |
|---|---|---|
| `usuarios` | Usuarios del sistema | `nombre`, `email`, `password`, `rol` |
| `pacientes` | Pacientes registrados | `cedula`, `fecha_nacimiento`, `sexo`, `telefono`, `direccion` |
| `doctores` | Perfil profesional de un usuario-doctor | `id_usuario` → `id_especialidad`, `licencia`, `activo` |

### 🩺 Gestión Clínica

| Tabla | Descripción | Campos clave |
|---|---|---|
| `citas` | Citas médicas agendadas | `id_paciente`, `id_doctor`, `fecha`, `hora`, `estado`, `motivo` |
| `consultas` | Resultado de una cita atendida | `diagnostico`, `tratamiento`, `observaciones` |
| `recetas` | Recetas generadas en una consulta | `id_consulta`, `fecha` |
| `receta_medicamento` | Detalle: medicamento + dosis + frecuencia | `id_receta`, `id_medicamento`, `dosis`, `frecuencia` |
| `laboratorio` | Exámenes de laboratorio por consulta | `id_consulta`, `resultado`, `fecha` |

### 💰 Facturación y Pagos

| Tabla | Descripción | Campos clave |
|---|---|---|
| `facturas` | Factura generada por una cita | `id_cita`, `cantidad_pago`, `estado` |
| `pagos` | Pagos/abonos sobre una factura | `id_factura`, `monto`, `metodo_pago` |

---

## Flujos de Negocio

### 📅 Flujo de Atención Médica

```
Paciente → agenda CITA → Doctor atiende → genera CONSULTA
                                              │
                                ┌─────────────┼──────────────┐
                                ▼             ▼              ▼
                            RECETA      LABORATORIO      FACTURA
                              │                            │
                              ▼                            ▼
                       RECETA_MEDICAMENTO              PAGOS
                       (dosis, frecuencia)         (monto, método)
```

### 🔐 Roles del Sistema

| Rol | Permisos típicos |
|---|---|
| `admin` | Gestión total de la clínica, usuarios, configuración |
| `recepcionista` | Agendar citas, registrar pacientes |
| `doctor` | Atender citas, crear consultas, recetas, laboratorios |
| `paciente` | Ver sus citas, historial y recetas |

---

## Seguridad Multi-Tenant (RLS)

### Tablas con RLS activo

- ✅ `usuarios`
- ✅ `pacientes`
- ✅ `doctores`
- ✅ `citas`

### Cómo funciona

```sql
-- La app configura el tenant en cada transacción:
SET app.current_clinic_id = '<uuid-de-la-clinica>';

-- Las políticas RLS filtran automáticamente:
-- Solo se ven registros donde id_clinica = app.current_clinic_id
```

> **Nota:** Las tablas `consultas`, `recetas`, `laboratorio`, `facturas` y `pagos` se aíslan indirectamente a través de sus relaciones con `citas` (que sí tiene RLS).

---

## Índices de Rendimiento (19)

### Por tenant (filtros por `id_clinica`)
- `idx_usuarios_clinica`
- `idx_pacientes_clinica`
- `idx_doctores_clinica`
- `idx_citas_clinica`

### Por relación (JOINs frecuentes)
- `idx_doctores_usuario`, `idx_doctores_especialidad`
- `idx_citas_paciente`, `idx_citas_doctor`
- `idx_consultas_cita`
- `idx_recetas_consulta`
- `idx_receta_med_receta`, `idx_receta_med_medicamento`
- `idx_laboratorio_consulta`
- `idx_facturas_cita`
- `idx_pagos_factura`

### Por búsqueda
- `idx_pacientes_cedula`
- `idx_usuarios_email`
- `idx_citas_fecha`

---

## Convenciones

| Convención | Ejemplo |
|---|---|
| Primary Key | `id_p` (UUID v4) |
| Foreign Key | `id_clinica`, `id_usuario`, `id_cita` |
| Timestamps | `created_at` (TIMESTAMPTZ), `deleted_at` (soft delete) |
| Estados | `'pendiente'` como valor default |
| Tipos de dato | UUID para IDs, VARCHAR para texto corto, TEXT para texto largo, DECIMAL(12,2) para montos |

---

## Estructura del Proyecto

```
base de datos Saas clinico/
├── automation/          # Scripts de automatización
├── client/              # Frontend (Next.js)
├── server/              # Backend (NestJS)
├── docker/
│   └── postgres/
│       └── init-db.sql  # ← Schema de la BD (13 tablas)
└── docs/
    └── RESUMEN.md       # ← Este archivo
```
