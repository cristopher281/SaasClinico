# 🏥 SaaS Gestión Clínica Multi-Especialidad

Sistema de gestión modular para clínicas médicas con arquitectura de **Monolito Modular** y aislamiento de datos **Multi-tenant**. 

Este proyecto está diseñado para funcionar tanto en entornos locales de desarrollo como en servidores VPS para producción, gestionando la orquestación principalmente a través de contenedores Docker.

---

## 📁 Estructura del Proyecto

La arquitectura del proyecto está dividida en los siguientes módulos y carpetas principales:

```text
SaasClinico/
├── automation/       # Scripts de automatización y mantenimiento.
├── client/           # Aplicación Frontend (Next.js, React).
├── server/           # Aplicación Backend (NestJS, TypeORM).
├── docker/           # Archivos de la infraestructura (Bases de datos).
│   ├── docker-compose.yml   # Orquestación de contenedores en la red de Docker.
│   └── postgres/
│       ├── init-db.sql      # Schema de la BD (13 tablas + RLS + índices).
│       └── seed-data.sql    # Scripts con datos realistas de prueba.
├── docs/             # Documentación técnica extendida del sistema (Ej. RESUMEN.md).
├── .gitignore        # Reglas para exclusión de archivos pesados de Git.
└── README.md         # Documentación principal.
```

---

## 🚀 Fase Actual de Desarrollo: Fase 2 (Backend Core - Multi-Tenancy)

El desarrollo del núcleo del servidor en **NestJS** ya cuenta con:
*   **Registros Atómicos**: Flujos controlados para la gestión de clínicas y administradores.
*   **Seguridad Mutli-Tenant RLS**: Aislamiento a nivel de PostgreSQL gestionado por JWT.
*   **Módulos Operativos**: Pacientes, citas, consultas, facturación, entre otros.

---

## 🛠️ Cómo Inicializar en Desarrollo (Local)

### 1. Requisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y en ejecución.
- Git instalado.

### 2. Pasos
1. Abre tu terminal.
2. Clona el proyecto (opcional si ya lo descargaste localmente): `git clone https://github.com/cristopher281/SaasClinico.git`
3. Ve a la carpeta `docker/` del proyecto.
4. Ejecuta:
```bash
docker-compose up -d
```
5. Para llenar con datos iniciales (ejecutar desde la raíz del proyecto):
```bash
docker cp docker/postgres/seed-data.sql saas_clinico_db:/tmp/seed-data.sql
docker exec saas_clinico_db psql -U admin -d saas_clinica_db -f /tmp/seed-data.sql
```

---

## 🌍 Guía de Despliegue en VPS (Producción)

Para alojar el sistema SaaS de manera profesional y accesible por internet, un servidor privado virtual (VPS como DigitalOcean, AWS EC2 o Linode) es la mejor opción. 

### Paso 1: Configurar el Entorno del VPS
1. Conéctate a tu servidor mediante SSH (reemplaza `usuario` y `ip_servidor`):
   ```bash
   ssh usuario@ip_servidor
   ```
2. Actualiza los paquetes del sistema (en base Debian/Ubuntu):
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```
3. Instala **Docker** y **Docker Compose**:
   ```bash
   sudo apt install docker.io docker-compose git -y
   ```
4. Agrega a tu usuario al grupo docker para no tener que usar `sudo` siempre:
   ```bash
   sudo usermod -aG docker $USER
   ```
   *(Sal y vuelve a entrar por SSH para que esto tome efecto).*

### Paso 2: Clonar y Preparar el Sistema
Dentro de tu VPS, clona el código fuente oficial:
```bash
git clone https://github.com/cristopher281/SaasClinico.git
cd SaasClinico
```

> **Aviso de Producción:** Antes de levantar el proyecto en producción debes cambiar las credenciales predeterminadas. Puedes modificar contraseñas dentro del archivo `docker/docker-compose.yml`.

### Paso 3: Levantar los Servicios en el Servidor
1. Ingresa a la carpeta Docker:
   ```bash
   cd docker
   ```
2. Arranca la infraestructura en modo "detach" (segundo plano):
   ```bash
   docker-compose up -d
   ```
3. Verifica que la base de datos se esté ejecutando:
   ```bash
   docker ps
   ```

### Paso 4: Cargar Semillas de Datos (Opcional en VPS)
Si esto es un entorno de demostración y te interesa sembrar datos en Producción:
```bash
# Sube el script de los seeds
docker cp postgres/seed-data.sql saas_clinico_db:/tmp/seed-data.sql

# Ejecútalo internamente
docker exec saas_clinico_db psql -U admin -d saas_clinica_db -f /tmp/seed-data.sql
```

### 🔐 Paso Final y Seguridad (Recomendado)
*   **Dominios y SSL**: Se recomienda instalar y configurar un proxy reverso (como Nginx o Traefik) bloqueando puertos expuestos para asegurar que el tráfico frontal cruce por HTTPS utilizando **Let's Encrypt**.
*   **Firewall**: Configura UFW para restringir conexiones únicamente a los puertos esenciales (80, 443, 22).
   ```bash
   sudo ufw allow 22
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```
