-- 🧪 SCRIPT DE DATOS DE PRUEBA: SaaS Gestión Clínica
-- Inserta datos realistas en todas las 13 tablas
-- Ejecutar con: docker exec -i saas_clinico_db psql -U admin -d saas_clinica_db < seed-data.sql
-- ============================================================
BEGIN;
-- ============================================================
-- 1. CLÍNICAS (2 tenants de prueba)
-- ============================================================
INSERT INTO clinicas (id_p, nombre, telefono, email)
VALUES (
        'a1000000-0000-0000-0000-000000000001',
        'Clínica San Rafael',
        '+52 55 1234 5678',
        'contacto@sanrafael.mx'
    ),
    (
        'a1000000-0000-0000-0000-000000000002',
        'Centro Médico Bienestar',
        '+52 33 9876 5432',
        'info@bienestar.mx'
    );
-- ============================================================
-- 2. ESPECIALIDADES (catálogo global compartido)
-- ============================================================
INSERT INTO especialidades (id_p, nombre, descripcion)
VALUES (
        'b1000000-0000-0000-0000-000000000001',
        'Medicina General',
        'Atención primaria y diagnóstico general'
    ),
    (
        'b1000000-0000-0000-0000-000000000002',
        'Cardiología',
        'Diagnóstico y tratamiento de enfermedades del corazón'
    ),
    (
        'b1000000-0000-0000-0000-000000000003',
        'Pediatría',
        'Atención médica para niños y adolescentes'
    ),
    (
        'b1000000-0000-0000-0000-000000000004',
        'Dermatología',
        'Tratamiento de enfermedades de la piel'
    ),
    (
        'b1000000-0000-0000-0000-000000000005',
        'Ginecología',
        'Salud reproductiva y atención de la mujer'
    ),
    (
        'b1000000-0000-0000-0000-000000000006',
        'Traumatología',
        'Lesiones del sistema musculoesquelético'
    );
-- ============================================================
-- 3. MEDICAMENTOS (catálogo global compartido)
-- ============================================================
INSERT INTO medicamentos (id_p, nombre, descripcion)
VALUES (
        'c1000000-0000-0000-0000-000000000001',
        'Paracetamol 500mg',
        'Analgésico y antipirético'
    ),
    (
        'c1000000-0000-0000-0000-000000000002',
        'Ibuprofeno 400mg',
        'Antiinflamatorio no esteroideo (AINE)'
    ),
    (
        'c1000000-0000-0000-0000-000000000003',
        'Amoxicilina 500mg',
        'Antibiótico de amplio espectro'
    ),
    (
        'c1000000-0000-0000-0000-000000000004',
        'Omeprazol 20mg',
        'Inhibidor de la bomba de protones'
    ),
    (
        'c1000000-0000-0000-0000-000000000005',
        'Metformina 850mg',
        'Antidiabético oral'
    ),
    (
        'c1000000-0000-0000-0000-000000000006',
        'Losartán 50mg',
        'Antihipertensivo (ARA II)'
    ),
    (
        'c1000000-0000-0000-0000-000000000007',
        'Loratadina 10mg',
        'Antihistamínico de segunda generación'
    ),
    (
        'c1000000-0000-0000-0000-000000000008',
        'Salbutamol Inhalador 100mcg',
        'Broncodilatador de acción rápida'
    );
-- ============================================================
-- 4. USUARIOS — Clínica San Rafael
-- ============================================================
INSERT INTO usuarios (id_p, id_clinica, nombre, email, password, rol)
VALUES -- Admin
    (
        'd1000000-0000-0000-0000-000000000001',
        'a1000000-0000-0000-0000-000000000001',
        'Laura Méndez García',
        'laura.admin@sanrafael.mx',
        '$2b$10$hashedpassword001',
        'admin'
    ),
    -- Recepcionista
    (
        'd1000000-0000-0000-0000-000000000002',
        'a1000000-0000-0000-0000-000000000001',
        'Carlos Ruiz López',
        'carlos.recep@sanrafael.mx',
        '$2b$10$hashedpassword002',
        'recepcionista'
    ),
    -- Doctores
    (
        'd1000000-0000-0000-0000-000000000003',
        'a1000000-0000-0000-0000-000000000001',
        'Dra. Ana Torres Vega',
        'ana.torres@sanrafael.mx',
        '$2b$10$hashedpassword003',
        'doctor'
    ),
    (
        'd1000000-0000-0000-0000-000000000004',
        'a1000000-0000-0000-0000-000000000001',
        'Dr. Miguel Ángel Ramos',
        'miguel.ramos@sanrafael.mx',
        '$2b$10$hashedpassword004',
        'doctor'
    ),
    (
        'd1000000-0000-0000-0000-000000000005',
        'a1000000-0000-0000-0000-000000000001',
        'Dra. Sofía Herrera',
        'sofia.herrera@sanrafael.mx',
        '$2b$10$hashedpassword005',
        'doctor'
    );
-- ============================================================
-- 5. USUARIOS — Centro Médico Bienestar
-- ============================================================
INSERT INTO usuarios (id_p, id_clinica, nombre, email, password, rol)
VALUES (
        'd2000000-0000-0000-0000-000000000001',
        'a1000000-0000-0000-0000-000000000002',
        'Roberto Castillo',
        'roberto.admin@bienestar.mx',
        '$2b$10$hashedpassword006',
        'admin'
    ),
    (
        'd2000000-0000-0000-0000-000000000002',
        'a1000000-0000-0000-0000-000000000002',
        'Dr. Fernando Díaz',
        'fernando.diaz@bienestar.mx',
        '$2b$10$hashedpassword007',
        'doctor'
    ),
    (
        'd2000000-0000-0000-0000-000000000003',
        'a1000000-0000-0000-0000-000000000002',
        'Dra. Patricia Núñez',
        'patricia.nunez@bienestar.mx',
        '$2b$10$hashedpassword008',
        'doctor'
    );
-- ============================================================
-- 6. PACIENTES — Clínica San Rafael
-- ============================================================
INSERT INTO pacientes (
        id_p,
        id_clinica,
        cedula,
        fecha_nacimiento,
        sexo,
        telefono,
        email,
        direccion
    )
VALUES (
        'e1000000-0000-0000-0000-000000000001',
        'a1000000-0000-0000-0000-000000000001',
        'CURP-SR001',
        '1985-03-15',
        'Masculino',
        '+52 55 1111 0001',
        'juan.perez@email.com',
        'Av. Reforma 123, Col. Centro, CDMX'
    ),
    (
        'e1000000-0000-0000-0000-000000000002',
        'a1000000-0000-0000-0000-000000000001',
        'CURP-SR002',
        '1992-07-22',
        'Femenino',
        '+52 55 1111 0002',
        'maria.lopez@email.com',
        'Calle Insurgentes 456, Col. Roma, CDMX'
    ),
    (
        'e1000000-0000-0000-0000-000000000003',
        'a1000000-0000-0000-0000-000000000001',
        'CURP-SR003',
        '1978-11-08',
        'Masculino',
        '+52 55 1111 0003',
        'pedro.garcia@email.com',
        'Blvd. Ávila Camacho 789, Naucalpan'
    ),
    (
        'e1000000-0000-0000-0000-000000000004',
        'a1000000-0000-0000-0000-000000000001',
        'CURP-SR004',
        '2000-01-30',
        'Femenino',
        '+52 55 1111 0004',
        'carolina.martinez@email.com',
        'Paseo de la Reforma 321, Col. Juárez, CDMX'
    ),
    (
        'e1000000-0000-0000-0000-000000000005',
        'a1000000-0000-0000-0000-000000000001',
        'CURP-SR005',
        '1965-09-12',
        'Masculino',
        '+52 55 1111 0005',
        'ricardo.hernandez@email.com',
        'Calzada de Tlalpan 654, Coyoacán'
    );
-- ============================================================
-- 7. PACIENTES — Centro Médico Bienestar
-- ============================================================
INSERT INTO pacientes (
        id_p,
        id_clinica,
        cedula,
        fecha_nacimiento,
        sexo,
        telefono,
        email,
        direccion
    )
VALUES (
        'e2000000-0000-0000-0000-000000000001',
        'a1000000-0000-0000-0000-000000000002',
        'CURP-BN001',
        '1990-05-20',
        'Femenino',
        '+52 33 2222 0001',
        'gabriela.rios@email.com',
        'Av. Chapultepec 100, Guadalajara'
    ),
    (
        'e2000000-0000-0000-0000-000000000002',
        'a1000000-0000-0000-0000-000000000002',
        'CURP-BN002',
        '1988-12-03',
        'Masculino',
        '+52 33 2222 0002',
        'andres.soto@email.com',
        'Av. Vallarta 200, Guadalajara'
    );
-- ============================================================
-- 8. DOCTORES — Clínica San Rafael
-- ============================================================
INSERT INTO doctores (
        id_p,
        id_clinica,
        id_usuario,
        id_especialidad,
        licencia,
        opinion,
        activo
    )
VALUES (
        'f1000000-0000-0000-0000-000000000001',
        'a1000000-0000-0000-0000-000000000001',
        'd1000000-0000-0000-0000-000000000003',
        'b1000000-0000-0000-0000-000000000001',
        'CED-MED-001',
        'Médica general con 12 años de experiencia',
        true
    ),
    (
        'f1000000-0000-0000-0000-000000000002',
        'a1000000-0000-0000-0000-000000000001',
        'd1000000-0000-0000-0000-000000000004',
        'b1000000-0000-0000-0000-000000000002',
        'CED-CARD-002',
        'Cardiólogo certificado por el Consejo Nacional',
        true
    ),
    (
        'f1000000-0000-0000-0000-000000000003',
        'a1000000-0000-0000-0000-000000000001',
        'd1000000-0000-0000-0000-000000000005',
        'b1000000-0000-0000-0000-000000000003',
        'CED-PED-003',
        'Pediatra especializada en neonatología',
        true
    );
-- ============================================================
-- 9. DOCTORES — Centro Médico Bienestar
-- ============================================================
INSERT INTO doctores (
        id_p,
        id_clinica,
        id_usuario,
        id_especialidad,
        licencia,
        opinion,
        activo
    )
VALUES (
        'f2000000-0000-0000-0000-000000000001',
        'a1000000-0000-0000-0000-000000000002',
        'd2000000-0000-0000-0000-000000000002',
        'b1000000-0000-0000-0000-000000000004',
        'CED-DERM-004',
        'Dermatólogo con subespecialidad en dermatología estética',
        true
    ),
    (
        'f2000000-0000-0000-0000-000000000002',
        'a1000000-0000-0000-0000-000000000002',
        'd2000000-0000-0000-0000-000000000003',
        'b1000000-0000-0000-0000-000000000005',
        'CED-GIN-005',
        'Ginecóloga con experiencia en embarazo de alto riesgo',
        true
    );
-- ============================================================
-- 10. CITAS — Clínica San Rafael (variedad de estados)
-- ============================================================
INSERT INTO citas (
        id_p,
        id_clinica,
        id_paciente,
        id_doctor,
        fecha,
        hora,
        estado,
        motivo
    )
VALUES -- Citas completadas
    (
        'aa100000-0000-0000-0000-000000000001',
        'a1000000-0000-0000-0000-000000000001',
        'e1000000-0000-0000-0000-000000000001',
        'f1000000-0000-0000-0000-000000000001',
        '2026-03-10',
        '09:00',
        'completada',
        'Dolor de cabeza recurrente y fatiga'
    ),
    (
        'aa100000-0000-0000-0000-000000000002',
        'a1000000-0000-0000-0000-000000000001',
        'e1000000-0000-0000-0000-000000000002',
        'f1000000-0000-0000-0000-000000000002',
        '2026-03-11',
        '10:30',
        'completada',
        'Revisión cardiológica de rutina'
    ),
    (
        'aa100000-0000-0000-0000-000000000003',
        'a1000000-0000-0000-0000-000000000001',
        'e1000000-0000-0000-0000-000000000005',
        'f1000000-0000-0000-0000-000000000001',
        '2026-03-12',
        '11:00',
        'completada',
        'Control de hipertensión y diabetes'
    ),
    -- Citas pendientes (futuras)
    (
        'aa100000-0000-0000-0000-000000000004',
        'a1000000-0000-0000-0000-000000000001',
        'e1000000-0000-0000-0000-000000000003',
        'f1000000-0000-0000-0000-000000000003',
        '2026-03-20',
        '14:00',
        'pendiente',
        'Vacunación de hijo de 3 años'
    ),
    (
        'aa100000-0000-0000-0000-000000000005',
        'a1000000-0000-0000-0000-000000000001',
        'e1000000-0000-0000-0000-000000000004',
        'f1000000-0000-0000-0000-000000000001',
        '2026-03-21',
        '16:30',
        'pendiente',
        'Chequeo general preventivo'
    ),
    -- Cita cancelada
    (
        'aa100000-0000-0000-0000-000000000006',
        'a1000000-0000-0000-0000-000000000001',
        'e1000000-0000-0000-0000-000000000001',
        'f1000000-0000-0000-0000-000000000002',
        '2026-03-08',
        '08:00',
        'cancelada',
        'Dolor en el pecho — paciente canceló'
    );
-- ============================================================
-- 11. CITAS — Centro Médico Bienestar
-- ============================================================
INSERT INTO citas (
        id_p,
        id_clinica,
        id_paciente,
        id_doctor,
        fecha,
        hora,
        estado,
        motivo
    )
VALUES (
        'aa200000-0000-0000-0000-000000000001',
        'a1000000-0000-0000-0000-000000000002',
        'e2000000-0000-0000-0000-000000000001',
        'f2000000-0000-0000-0000-000000000002',
        '2026-03-14',
        '09:30',
        'completada',
        'Control prenatal del segundo trimestre'
    ),
    (
        'aa200000-0000-0000-0000-000000000002',
        'a1000000-0000-0000-0000-000000000002',
        'e2000000-0000-0000-0000-000000000002',
        'f2000000-0000-0000-0000-000000000001',
        '2026-03-22',
        '11:00',
        'pendiente',
        'Revisión de lunares sospechosos'
    );
-- ============================================================
-- 12. CONSULTAS (resultado de citas completadas)
-- ============================================================
INSERT INTO consultas (
        id_p,
        id_cita,
        diagnostico,
        tratamiento,
        observaciones
    )
VALUES (
        'bb100000-0000-0000-0000-000000000001',
        'aa100000-0000-0000-0000-000000000001',
        'Cefalea tensional crónica',
        'Paracetamol 500mg cada 8 horas por 5 días. Reducir estrés laboral.',
        'Paciente presenta cuadro de estrés. Se recomienda seguimiento en 2 semanas.'
    ),
    (
        'bb100000-0000-0000-0000-000000000002',
        'aa100000-0000-0000-0000-000000000002',
        'Hipertensión arterial leve (estadio I)',
        'Losartán 50mg una vez al día. Dieta baja en sodio.',
        'Electrocardiograma normal. Solicitar laboratorios de perfil lipídico.'
    ),
    (
        'bb100000-0000-0000-0000-000000000003',
        'aa100000-0000-0000-0000-000000000003',
        'Diabetes mellitus tipo 2 controlada + Hipertensión arterial',
        'Continuar Metformina 850mg. Ajustar Losartán a 100mg.',
        'Hemoglobina glucosilada en rango. Presión arterial ligeramente elevada.'
    ),
    (
        'bb200000-0000-0000-0000-000000000001',
        'aa200000-0000-0000-0000-000000000001',
        'Embarazo de 22 semanas, curso normal',
        'Ácido fólico, hierro, calcio. Ultrasonido estructural solicitado.',
        'Peso y presión arterial dentro de parámetros normales.'
    );
-- ============================================================
-- 13. RECETAS (derivadas de consultas)
-- ============================================================
INSERT INTO recetas (id_p, id_consulta)
VALUES (
        'cc100000-0000-0000-0000-000000000001',
        'bb100000-0000-0000-0000-000000000001'
    ),
    (
        'cc100000-0000-0000-0000-000000000002',
        'bb100000-0000-0000-0000-000000000002'
    ),
    (
        'cc100000-0000-0000-0000-000000000003',
        'bb100000-0000-0000-0000-000000000003'
    );
-- ============================================================
-- 14. DETALLE RECETA ↔ MEDICAMENTO
-- ============================================================
INSERT INTO receta_medicamento (id_receta, id_medicamento, dosis, frecuencia)
VALUES -- Receta 1: Cefalea tensional
    (
        'cc100000-0000-0000-0000-000000000001',
        'c1000000-0000-0000-0000-000000000001',
        '500mg',
        'Cada 8 horas por 5 días'
    ),
    (
        'cc100000-0000-0000-0000-000000000001',
        'c1000000-0000-0000-0000-000000000002',
        '400mg',
        'Cada 12 horas si persiste el dolor'
    ),
    -- Receta 2: Hipertensión
    (
        'cc100000-0000-0000-0000-000000000002',
        'c1000000-0000-0000-0000-000000000006',
        '50mg',
        'Una vez al día por la mañana'
    ),
    (
        'cc100000-0000-0000-0000-000000000002',
        'c1000000-0000-0000-0000-000000000004',
        '20mg',
        'Una vez al día en ayunas'
    ),
    -- Receta 3: Diabetes + Hipertensión
    (
        'cc100000-0000-0000-0000-000000000003',
        'c1000000-0000-0000-0000-000000000005',
        '850mg',
        'Dos veces al día con alimentos'
    ),
    (
        'cc100000-0000-0000-0000-000000000003',
        'c1000000-0000-0000-0000-000000000006',
        '100mg',
        'Una vez al día por la mañana'
    );
-- ============================================================
-- 15. LABORATORIO (exámenes solicitados)
-- ============================================================
INSERT INTO laboratorio (id_p, id_consulta, resultado)
VALUES (
        'dd100000-0000-0000-0000-000000000001',
        'bb100000-0000-0000-0000-000000000002',
        'Colesterol total: 210 mg/dL (elevado) | LDL: 145 mg/dL | HDL: 42 mg/dL | Triglicéridos: 180 mg/dL'
    ),
    (
        'dd100000-0000-0000-0000-000000000002',
        'bb100000-0000-0000-0000-000000000003',
        'Glucosa en ayunas: 126 mg/dL | HbA1c: 6.8% | Creatinina: 0.9 mg/dL | Urea: 35 mg/dL'
    );
-- ============================================================
-- 16. FACTURAS
-- ============================================================
INSERT INTO facturas (id_p, id_cita, cantidad_pago, estado)
VALUES (
        'ee100000-0000-0000-0000-000000000001',
        'aa100000-0000-0000-0000-000000000001',
        800.00,
        'pagada'
    ),
    (
        'ee100000-0000-0000-0000-000000000002',
        'aa100000-0000-0000-0000-000000000002',
        1500.00,
        'pagada'
    ),
    (
        'ee100000-0000-0000-0000-000000000003',
        'aa100000-0000-0000-0000-000000000003',
        900.00,
        'parcial'
    ),
    (
        'ee200000-0000-0000-0000-000000000001',
        'aa200000-0000-0000-0000-000000000001',
        1200.00,
        'pendiente'
    );
-- ============================================================
-- 17. PAGOS (transacciones sobre facturas)
-- ============================================================
INSERT INTO pagos (id_factura, fecha, monto, metodo_pago)
VALUES -- Factura 1: pagada completa
    (
        'ee100000-0000-0000-0000-000000000001',
        '2026-03-10',
        800.00,
        'tarjeta_credito'
    ),
    -- Factura 2: pagada completa
    (
        'ee100000-0000-0000-0000-000000000002',
        '2026-03-11',
        1500.00,
        'transferencia'
    ),
    -- Factura 3: pago parcial (2 abonos)
    (
        'ee100000-0000-0000-0000-000000000003',
        '2026-03-12',
        500.00,
        'efectivo'
    ),
    (
        'ee100000-0000-0000-0000-000000000003',
        '2026-03-15',
        200.00,
        'tarjeta_debito'
    );
COMMIT;
-- ============================================================
-- 🔍 CONSULTAS DE VERIFICACIÓN
-- ============================================================
-- Ejecuta estas queries para verificar que los datos se insertaron:
SELECT '📊 Resumen de datos insertados:' AS info;
SELECT 'Clínicas' AS tabla,
    COUNT(*) AS registros
FROM clinicas
UNION ALL
SELECT 'Especialidades',
    COUNT(*)
FROM especialidades
UNION ALL
SELECT 'Medicamentos',
    COUNT(*)
FROM medicamentos
UNION ALL
SELECT 'Usuarios',
    COUNT(*)
FROM usuarios
UNION ALL
SELECT 'Pacientes',
    COUNT(*)
FROM pacientes
UNION ALL
SELECT 'Doctores',
    COUNT(*)
FROM doctores
UNION ALL
SELECT 'Citas',
    COUNT(*)
FROM citas
UNION ALL
SELECT 'Consultas',
    COUNT(*)
FROM consultas
UNION ALL
SELECT 'Recetas',
    COUNT(*)
FROM recetas
UNION ALL
SELECT 'Receta-Medicamento',
    COUNT(*)
FROM receta_medicamento
UNION ALL
SELECT 'Laboratorio',
    COUNT(*)
FROM laboratorio
UNION ALL
SELECT 'Facturas',
    COUNT(*)
FROM facturas
UNION ALL
SELECT 'Pagos',
    COUNT(*)
FROM pagos;