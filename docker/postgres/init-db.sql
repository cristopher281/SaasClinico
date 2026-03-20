-- 🏥 SCHEMA COMPLETO: SaaS GESTIÓN CLÍNICA MULTI-ESPECIALIDAD
-- Estrategia: Shared Database con RLS (Row-Level Security)
-- Aislamiento: id_clinica (UUID)
-- Fuente: dbdiagram.io — 13 tablas
-- ============================================================
-- 1. EXTENSIONES
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- ============================================================
-- 2. TABLAS MAESTRAS (CATÁLOGOS GLOBALES)
-- ============================================================
-- ► Clínicas (Tenant principal)
CREATE TABLE clinicas (
    id_p UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(150) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);
-- ► Especialidades médicas (catálogo compartido)
CREATE TABLE especialidades (
    id_p UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);
-- ► Medicamentos (catálogo compartido)
CREATE TABLE medicamentos (
    id_p UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT
);
-- ============================================================
-- 3. TABLAS CON AISLAMIENTO POR CLÍNICA (TENANT)
-- ============================================================
-- ► Usuarios del sistema
CREATE TABLE usuarios (
    id_p UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_clinica UUID NOT NULL REFERENCES clinicas(id_p) ON DELETE CASCADE,
    nombre VARCHAR(200) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    rol VARCHAR(50) CHECK (
        rol IN ('admin', 'recepcionista', 'doctor', 'paciente')
    ),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);
-- ► Pacientes
CREATE TABLE pacientes (
    id_p UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_clinica UUID NOT NULL REFERENCES clinicas(id_p) ON DELETE CASCADE,
    cedula VARCHAR(50) NOT NULL,
    fecha_nacimiento DATE,
    sexo VARCHAR(20),
    telefono VARCHAR(20),
    email VARCHAR(150),
    direccion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);
-- ► Doctores (perfil profesional vinculado a un usuario)
CREATE TABLE doctores (
    id_p UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_clinica UUID NOT NULL REFERENCES clinicas(id_p) ON DELETE CASCADE,
    id_usuario UUID NOT NULL REFERENCES usuarios(id_p) ON DELETE CASCADE,
    id_especialidad UUID REFERENCES especialidades(id_p),
    licencia VARCHAR(100),
    opinion VARCHAR(255),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);
-- ► Citas médicas
CREATE TABLE citas (
    id_p UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_clinica UUID NOT NULL REFERENCES clinicas(id_p) ON DELETE CASCADE,
    id_paciente UUID NOT NULL REFERENCES pacientes(id_p),
    id_doctor UUID NOT NULL REFERENCES doctores(id_p),
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    estado VARCHAR(50) DEFAULT 'pendiente',
    motivo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- ► Consultas (resultado de una cita atendida)
CREATE TABLE consultas (
    id_p UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_cita UUID NOT NULL REFERENCES citas(id_p) ON DELETE CASCADE,
    diagnostico TEXT,
    tratamiento TEXT,
    observaciones TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);
-- ► Recetas médicas (derivadas de una consulta)
CREATE TABLE recetas (
    id_p UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_consulta UUID NOT NULL REFERENCES consultas(id_p) ON DELETE CASCADE,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- ► Detalle de receta ↔ medicamento (tabla pivote)
CREATE TABLE receta_medicamento (
    id_p UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_receta UUID NOT NULL REFERENCES recetas(id_p) ON DELETE CASCADE,
    id_medicamento UUID NOT NULL REFERENCES medicamentos(id_p),
    dosis VARCHAR(100),
    frecuencia VARCHAR(100)
);
-- ► Laboratorio (exámenes derivados de una consulta)
CREATE TABLE laboratorio (
    id_p UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_consulta UUID NOT NULL REFERENCES consultas(id_p) ON DELETE CASCADE,
    resultado TEXT,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- ============================================================
-- 4. TABLAS DE FACTURACIÓN Y PAGOS
-- ============================================================
-- ► Facturas (vinculadas a una cita)
CREATE TABLE facturas (
    id_p UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_cita UUID NOT NULL REFERENCES citas(id_p),
    cantidad_pago DECIMAL(12, 2),
    estado VARCHAR(50) DEFAULT 'pendiente',
    fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- ► Pagos (abonos/transacciones sobre una factura)
CREATE TABLE pagos (
    id_p UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_factura UUID NOT NULL REFERENCES facturas(id_p) ON DELETE CASCADE,
    fecha DATE DEFAULT CURRENT_DATE,
    monto DECIMAL(12, 2) NOT NULL,
    metodo_pago VARCHAR(50)
);
-- ============================================================
-- 5. ROW-LEVEL SECURITY (RLS) — AISLAMIENTO POR CLÍNICA
-- ============================================================
-- La aplicación debe configurar en cada transacción:
--   SET app.current_clinic_id = '<uuid-de-la-clinica>';
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctores ENABLE ROW LEVEL SECURITY;
ALTER TABLE citas ENABLE ROW LEVEL SECURITY;
-- Políticas de aislamiento directo (tablas con id_clinica)
CREATE POLICY clinica_isolation_usuarios ON usuarios USING (
    id_clinica = current_setting('app.current_clinic_id')::UUID
);
CREATE POLICY clinica_isolation_pacientes ON pacientes USING (
    id_clinica = current_setting('app.current_clinic_id')::UUID
);
CREATE POLICY clinica_isolation_doctores ON doctores USING (
    id_clinica = current_setting('app.current_clinic_id')::UUID
);
CREATE POLICY clinica_isolation_citas ON citas USING (
    id_clinica = current_setting('app.current_clinic_id')::UUID
);
-- ============================================================
-- 6. ÍNDICES DE RENDIMIENTO
-- ============================================================
-- Índices por tenant (consultas frecuentes filtradas por clínica)
CREATE INDEX idx_usuarios_clinica ON usuarios(id_clinica);
CREATE INDEX idx_pacientes_clinica ON pacientes(id_clinica);
CREATE INDEX idx_doctores_clinica ON doctores(id_clinica);
CREATE INDEX idx_citas_clinica ON citas(id_clinica);
-- Índices de relación (JOINs frecuentes)
CREATE INDEX idx_doctores_usuario ON doctores(id_usuario);
CREATE INDEX idx_doctores_especialidad ON doctores(id_especialidad);
CREATE INDEX idx_citas_paciente ON citas(id_paciente);
CREATE INDEX idx_citas_doctor ON citas(id_doctor);
CREATE INDEX idx_consultas_cita ON consultas(id_cita);
CREATE INDEX idx_recetas_consulta ON recetas(id_consulta);
CREATE INDEX idx_receta_med_receta ON receta_medicamento(id_receta);
CREATE INDEX idx_receta_med_medicamento ON receta_medicamento(id_medicamento);
CREATE INDEX idx_laboratorio_consulta ON laboratorio(id_consulta);
CREATE INDEX idx_facturas_cita ON facturas(id_cita);
CREATE INDEX idx_pagos_factura ON pagos(id_factura);
-- Índices de búsqueda
CREATE INDEX idx_pacientes_cedula ON pacientes(cedula);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_citas_fecha ON citas(fecha);