# SaaS Clinico

Base operativa para un SaaS de gestion clinica multi-tenant con frontend en Next.js, backend en NestJS y PostgreSQL en Docker.

## Estado actual

Al 8 de abril de 2026 el proyecto ya tiene una base funcional de extremo a extremo:

- `client/` implementado con Next.js App Router.
- `server/` implementado como modular monolith en NestJS.
- PostgreSQL levantable con `docker compose`.
- Autenticacion JWT con registro inicial de clinica.
- Separacion multi-tenant por clinica en la capa de aplicacion.
- Flujo operativo cubierto para recepcion, consulta, recetas, laboratorio, caja y administracion basica.

Verificacion ejecutada sobre el estado actual del repositorio:

- `server`: `npm run build` OK
- `client`: `npm run build` OK
- `client`: `npm run lint` OK con warnings menores

## Que ya existe

### Frontend

Aplicacion web en `client/` con rutas funcionales:

- `/login`
- `/registro-clinica`
- `/app/resumen`
- `/app/recepcion`
- `/app/doctor`
- `/app/caja`
- `/app/[...slug]` para vistas operativas adicionales

La estructura interna sigue esta organizacion:

- `src/modules/auth`
- `src/modules/overview`
- `src/modules/reception`
- `src/modules/doctor`
- `src/modules/billing`
- `src/modules/cashier`
- `src/modules/admin`
- `src/modules/operations`
- `src/shared`

### Backend

API en `server/` con prefijo global `http://localhost:3000/api`.

Modulos activos:

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

Capacidades implementadas:

- Registro de clinica y admin maestro
- Login JWT y endpoint de usuario actual
- Gestion de staff por clinica
- Consulta y actualizacion de clinica actual
- Carga de logo de clinica
- CRUD de pacientes
- Agenda de citas
- Consultas medicas
- Catalogo de doctores y especialidades
- Facturacion, pagos parciales y ticket imprimible
- Catalogo de medicamentos
- Recetas medicas
- Ordenes/registros de laboratorio

### Base de datos e infraestructura

En `docker/` ya esta lista la base local:

- PostgreSQL 15
- `init-db.sql` para esquema inicial
- `seed-data.sql` para carga base
- Adminer como perfil opcional de soporte

## Estructura del repositorio

```text
base de datos Saas clinico/
|-- automation/
|-- client/
|-- docker/
|   |-- docker-compose.yml
|   `-- postgres/
|       |-- init-db.sql
|       `-- seed-data.sql
|-- docs/
|-- server/
`-- README.md
```

## Requisitos

- Node.js 20+
- npm
- Docker Desktop

## Arranque local

### 1. Variables de entorno

Copia los archivos de ejemplo:

```bash
cd server
copy .env.example .env
```

```bash
cd docker
copy .env.example .env
```

En `client/` puedes usar:

```bash
cd client
copy .env.example .env
```

### 2. Levantar PostgreSQL

```bash
cd docker
docker compose up -d
```

Si vienes de una version anterior del esquema:

```bash
cd docker
docker compose down -v
docker compose up -d
```

### 3. Iniciar backend

```bash
cd server
npm install
npm run start:dev
```

La API queda en:

```text
http://localhost:3000/api
```

### 4. Iniciar frontend

```bash
cd client
npm install
npm run dev -- --port 3001
```

La aplicacion web queda en `http://localhost:3001`.

Si usas otro puerto para el frontend, no hace falta cambiar `NEXT_PUBLIC_API_URL` mientras la API siga corriendo en `http://localhost:3000/api`.

## Variables de entorno principales

### Backend `server/.env`

```env
NODE_ENV=development
PORT=3000
CORS_ORIGIN=*

DB_HOST=localhost
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=supersecretpassword
DB_NAME=saas_clinica_db

JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=8h

PRINTER_MODE=disabled
PRINTER_OUTPUT_DIR=prints
PRINTER_HOST=127.0.0.1
PRINTER_PORT=9100

UPLOADS_DIR=uploads
NOTIFICATIONS_MODE=file
NOTIFICATIONS_OUTPUT_DIR=outbox
```

### Frontend `client/.env`

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Docker `docker/.env`

```env
DB_USER=admin
DB_PASSWORD=supersecretpassword
DB_NAME=saas_clinica_db
DB_PORT=5432
ADMINER_PORT=8080
```

## Endpoints principales

### Salud y autenticacion

- `GET /api/health`
- `POST /api/auth/register-clinic`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/auth/staff`
- `POST /api/auth/staff`
- `PATCH /api/auth/staff/:id`
- `DELETE /api/auth/staff/:id`

### Clinica

- `GET /api/clinics/current`
- `PATCH /api/clinics/current`
- `POST /api/clinics/current/logo`

### Operacion clinica

- `GET /api/doctors`
- `GET /api/doctors/specialties`
- CRUD de `patients`
- CRUD de `appointments`
- CRUD de `consultations`
- CRUD de `laboratory`
- CRUD/listado de `prescriptions`
- listado de `medications`

### Caja y facturacion

- `POST /api/billing/invoices`
- `GET /api/billing/invoices`
- `GET /api/billing/invoices/:id`
- `PATCH /api/billing/invoices/:id`
- `POST /api/billing/invoices/:id/payments`
- `GET /api/billing/invoices/:id/payments`
- `GET /api/billing/invoices/:id/ticket`
- `POST /api/billing/invoices/:id/print`

## Impresion de tickets

El backend soporta tres modos:

- `PRINTER_MODE=disabled`: genera preview pero no imprime
- `PRINTER_MODE=file`: guarda tickets en `PRINTER_OUTPUT_DIR`
- `PRINTER_MODE=network`: envia ESC/POS a `PRINTER_HOST:PRINTER_PORT`

Para pruebas locales sin impresora fisica:

```env
PRINTER_MODE=file
PRINTER_OUTPUT_DIR=prints
```

## Limitaciones actuales

- El repositorio aun tiene muchos cambios locales sin consolidar en git.
- El `README` de submodulos y algunas docs pueden ir por delante o por detras del codigo.
- No hay suite de pruebas automatizadas madura en el backend.
- El frontend compila y navega, pero todavia requiere estabilizacion funcional completa por rol.
- `npm run lint` del frontend sigue mostrando warnings menores.

## Documentacion relacionada

- `docs/ARQUITECTURA_SAAS_CLINICO.md`
- `docs/REQUERIMIENTOS_DISENO_UI.md`
- `docs/RESUMEN.md`
- `client/README.md`
- `server/src/modules/README.md`

## Produccion

Antes de desplegar:

- cambia `JWT_SECRET`
- cambia credenciales de base de datos
- usa HTTPS detras de proxy reverso
- manten `synchronize=false`
- no expongas Adminer fuera de soporte interno
- restringe impresoras de red a la LAN interna
