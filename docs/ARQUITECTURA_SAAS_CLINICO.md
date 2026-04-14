# Arquitectura objetivo del SaaS Clinico

Este documento alinea el repositorio con el diagrama arquitectonico de referencia.

## Nivel 1. Arquitectura general

- `client/`: cliente web en Next.js.
- `server/`: backend NestJS en formato modular monolith.
- `docker/postgres/`: definicion y carga inicial de PostgreSQL.

## Nivel 2. Modulos del sistema

### Frontend

- `src/modules/auth`: autenticacion y alta inicial.
- `src/modules/operations`: shell principal y coordinacion.
- `src/modules/overview`: supervision general.
- `src/modules/reception`: recepcion, pacientes y citas.
- `src/modules/doctor`: consulta, recetas y laboratorio.
- `src/modules/billing`: facturacion y caja.
- `src/shared`: contratos, API y UI reutilizable.

Rutas activas:

- `/app/resumen`
- `/app/clinica`
- `/app/staff`
- `/app/reportes`
- `/app/recepcion/agenda`
- `/app/recepcion/pacientes`
- `/app/doctor/agenda`
- `/app/doctor/expediente`
- `/app/doctor/recetas`
- `/app/caja/citas`
- `/app/caja/facturacion`
- `/app/caja/comprobantes`
- `/login`
- `/registro-clinica`

### Backend

- `auth`
- `clinics`
- `patients`
- `doctors`
- `appointments`
- `consultations`
- `billing`
- `medications`
- `prescriptions`
- `laboratory`
- `health`

Convencion interna por modulo:

- `controllers/`
- `services/`
- `repositories/`
- `entities/`
- `dto/`

## Nivel 3. Datos

La persistencia central sigue en PostgreSQL con separacion multi-tenant por clinica, servida desde `server/` y provisionada desde `docker/postgres/`.

## Nivel 4. Flujo operativo

El flujo del diagrama queda representado asi:

1. `/registro-clinica` crea el tenant y al administrador maestro.
2. `/login` autentica a cualquier usuario sin preguntar rol.
3. El frontend redirige automaticamente al modulo RBAC correspondiente.
4. Recepcion registra paciente y agenda cita.
5. Doctor atiende consulta, revisa expediente y genera receta o laboratorio.
6. Caja emite factura, registra pago e imprime ticket.
7. Administracion consolida configuracion, staff y reportes.
