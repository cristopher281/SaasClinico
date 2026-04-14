# Frontend SaaS Clinico

Frontend en Next.js organizado para seguir la arquitectura operativa del sistema clinico.

## Capas

- `src/app`: rutas y entrypoints de Next.js.
- `src/modules/auth`: acceso y registro inicial de clinica.
- `src/modules/operations`: shell principal, navegacion y orquestacion de datos.
- `src/modules/overview`: panel ejecutivo.
- `src/modules/reception`: pacientes y agenda.
- `src/modules/doctor`: consultas, recetas y laboratorio.
- `src/modules/billing`: facturacion, pagos e impresion.
- `src/shared`: API, almacenamiento local, contratos y primitivas UI.

## Rutas operativas

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

`/app` redirige a `/app/resumen`, y el login envia cada usuario a su modulo principal segun rol.

## Autenticacion y onboarding

- `/login`: acceso universal para todo el personal.
- `/registro-clinica`: onboarding B2B multi-step para crear la clinica y el admin maestro.

## Notas actuales

- El frontend ya soporta el rol `cajero`, pero el backend debe emitir ese rol en autenticacion para activar esas vistas.
- El onboarding ya muestra `NIT/RUC` y `logo`, pero la persistencia real de esos campos todavia requiere ampliacion de la API/backend.

## Relacion con el backend

El frontend consume los modulos del backend NestJS por dominio:

- `auth`
- `patients`
- `appointments`
- `consultations`
- `billing`
- `medications`
- `prescriptions`
- `laboratory`

## Arranque local

```bash
npm install
npm run dev
```

Configura `NEXT_PUBLIC_API_URL` en `.env` o `.env.example` si la API no corre en `http://localhost:3000/api`.
