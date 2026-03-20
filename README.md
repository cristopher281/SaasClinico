# 🏥 SaaS Gestión Clínica Multi-Especialidad

Sistema de gestión modular para clínicas médicas con arquitectura de **Monolito Modular** y aislamiento de datos **Multi-tenant**.

---

## 🚀 Estado Actual del Proyecto: Fase 2 (Backend Core - Multi-Tenancy)

Se ha iniciado el desarrollo del núcleo del servidor en **NestJS**.

### ✅ Tareas Ejecutadas:
1.  **Entorno NestJS**: Todas las dependencias (TypeORM, JWT, PostgreSQL drivers) instaladas y configuradas.
2.  **Entidades Base (TypeORM)**:
    *   `Clinic`: Gestión de entidades multi-tenant.
    *   `User`: Gestión de usuarios vinculados a clínica y con roles definidos (`admin`, `doctor`, `recepcionista`, `paciente`).
3.  **Configuración de Conexión**: Servidor vinculado dinámicamente con el contenedor Docker de PostgreSQL.
4.  **Seguridad y Hashing**: Instalación y configuración de `bcrypt` para el cifrado irreversible de contraseñas de usuario.
5.  **Registro Atómico (Multi-Tenant)**: Implementación de transacciones de base de datos para crear clínica y administrador maestro en un solo flujo seguro.
6.  **Login y Emisión de JWT**: Sistema de autenticación con tokens que transportan la identidad de la clínica y el rol del usuario para el aislamiento de datos.
7.  **RLS Interceptor (Tenancy)**: Implementación del interceptor que conecta el JWT con PostgreSQL para activar automáticamente el aislamiento de datos en cada petición.
8.  **Módulo de Pacientes (CRUD Multi-Tenant)**: Creación del primer módulo operativo para la gestión de historias clínicas y datos de pacientes aislados por clínica.
9.  **Módulo de Doctores y Especialidades**: Gestión de staff médico y especialidades clínicas con vinculación automática de roles y clínicas.
10. **Módulo de Citas Médicas**: Motor de agendamiento inteligente con validación de disponibilidad y aislamiento multi-tenant.
11. **Módulo de Consultas y Diagnósticos**: Registro estructurado de la atención médica y almacenamiento de información clínica confidencial protegida por RLS.
12. **Módulo de Facturación y Pagos**: Gestión financiera automatizada para el control de ingresos, facturas y métodos de pago multi-clínica.

---

## 🏗️ Fase 2.3: Módulos Core (En Proceso)

Se está implementando el **Cerebro de Aislamiento**:
*   **Registro Atómico**: Un solo flujo para crear una clínica y su administrador maestro.
*   **JWT Multi-Tenant**: Inyección automática del `id_clinica` en el token de sesión.
*   **Aislamiento de Datos**: Preparación del middleware para activar las políticas RLS en cada consulta.

---

## 🛠️ Cómo Iniciar el Entorno de Desarrollo

### 1. Requisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y en ejecución.

### 2. Levantar la Base de Datos
Abre una terminal (PowerShell) en la carpeta `docker/` y ejecuta:
```bash
docker-compose up -d
```

### 3. Cargar Datos de Prueba (seed)
Después de levantar los contenedores, ejecuta estos dos comandos para insertar los datos de prueba:

```bash
# Paso 1: Copiar el script al contenedor
docker cp postgres/seed-data.sql saas_clinico_db:/tmp/seed-data.sql

# Paso 2: Ejecutar el script dentro del contenedor
docker exec saas_clinico_db psql -U admin -d saas_clinica_db -f /tmp/seed-data.sql
```

> ⚠️ **Nota:** El `seed-data.sql` solo debe ejecutarse **una vez**. Si necesitas reiniciar los datos desde cero, ejecuta `docker-compose down -v` y luego repite desde el paso 2.

### 4. Acceso a la Base de Datos
- **PostgreSQL**: Puerto `5432`
- **Adminer (Interfaz Web)**: [http://localhost:8080](http://localhost:8080)

| Campo | Valor |
|---|---|
| Sistema | PostgreSQL |
| Servidor | `db` |
| Usuario | `admin` |
| Contraseña | `supersecretpassword` |
| Base de datos | `saas_clinica_db` |

### 5. Comandos Útiles

| Comando | Descripción |
|---|---|
| `docker-compose up -d` | Levantar los contenedores |
| `docker-compose down` | Detener y eliminar contenedores |
| `docker-compose down -v` | Detener, eliminar contenedores **y datos** |
| `docker-compose logs db` | Ver logs de PostgreSQL |
| `docker exec -it saas_clinico_db psql -U admin -d saas_clinica_db` | Conectarse por terminal |

---

## 🧪 Datos de Prueba (seed-data.sql)

El script `docker/postgres/seed-data.sql` inserta datos realistas en todas las tablas del sistema:

| Tabla | Registros | Descripción |
|---|---|---|
| `clinicas` | 2 | Clínica San Rafael (CDMX) y Centro Médico Bienestar (GDL) |
| `especialidades` | 6 | Medicina General, Cardiología, Pediatría, Dermatología, Ginecología, Traumatología |
| `medicamentos` | 8 | Paracetamol, Ibuprofeno, Amoxicilina, Omeprazol, Metformina, Losartán, Loratadina, Salbutamol |
| `usuarios` | 8 | 2 admins, 1 recepcionista, 5 doctores |
| `pacientes` | 7 | 5 en Clínica San Rafael, 2 en Centro Bienestar |
| `doctores` | 5 | 3 en Clínica San Rafael, 2 en Centro Bienestar |
| `citas` | 8 | Variedad: completadas, pendientes, cancelada |
| `consultas` | 4 | Con diagnósticos, tratamientos y observaciones |
| `recetas` | 3 | Derivadas de consultas completadas |
| `receta_medicamento` | 6 | Dosis y frecuencia específicas |
| `laboratorio` | 2 | Resultados de perfil lipídico y glucosa |
| `facturas` | 4 | Estados: pagada, parcial, pendiente |
| `pagos` | 4 | Métodos: tarjeta, transferencia, efectivo |

---

## 🧠 Lógica de Seguridad (Multi-Tenancy)

El aislamiento de datos se maneja a nivel de Base de Datos mediante **RLS**. 
Cada tabla con datos por clínica tiene un campo `id_clinica`. Cuando el Backend (NestJS) realice una consulta, debe configurar la variable de sesión:
```sql
SET app.current_clinic_id = 'UUID-DE-LA-CLINICA';
```
PostgreSQL filtrará automáticamente todos los registros que no pertenezcan a ese ID.

**Tablas con RLS activo:** `usuarios`, `pacientes`, `doctores`, `citas`.

---

## 📁 Estructura del Proyecto

```
base de datos Saas clinico/
├── automation/              # Scripts de automatización
├── client/                  # Frontend (Next.js)
├── server/                  # Backend (NestJS)
├── docker/
│   ├── docker-compose.yml   # Orquestación de contenedores
│   └── postgres/
│       ├── init-db.sql      # Schema de la BD (13 tablas + RLS + índices)
│       └── seed-data.sql    # Datos de prueba realistas
├── docs/
│   └── RESUMEN.md           # Documentación técnica detallada
└── README.md                # ← Este archivo
```

---
*Última actualización: 2026-03-18 · Documentación del proyecto SaaS Clínico.*
