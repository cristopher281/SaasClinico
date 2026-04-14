# 🎨 Figma Design Brief: SaaS Gestión Clínica (Multi-Tenant)

## 📌 1. Visión y Nivel de Calidad Exigido
El objetivo de este documento es definir el estándar de interfaz para nuestro diseñador UI/UX en Figma. 
Este **no** debe ser un sistema administrativo (dashboard) genérico ni lucir como plantillas corporativas obsoletas de hace 10 años. Exigimos un producto con acabado **Premium**, equivalente a interfaces de **Linear, Stripe, Vercel o Notion**.

*   **Identidad Visual Limpia:** Una interfaz que grite orden y confianza. Fondos neutros (`#FAFAFA` o grisáceos muy sutiles), contenedores de contenido en blanco absoluto (`#FFFFFF`) con sombras ligeras (soft shadows) que den profundidad.
*   **Arquitectura Figma Rigurosa:** *Prohibido utilizar píxeles sueltos.* Todo el sistema debe construirse empleando **Auto-Layout**, **Design Tokens** (Variables locales) y **Componentes con Variantes**.
*   **Micro-animaciones y UX:** Los estados de interactividad deben estar 100% diagramados (hover, active, disabled, focus en inputs).

---

## 🧩 2. "Foundation" y Design System
*Antes de diseñar ni una sola pantalla final, el creador en Figma debe iniciar definiendo la página "Design System" con:*

1.  **Variables / Tokens Globales:**
    *   **Colores:** Primary Brand (Azul médico premium o índigo profundo), Success (Verde vibrante pero serio), Warning (Naranja/Amarillo), Danger (Rojo elegante), y una escala de Grises estricta (`gray-50` al `gray-900`).
    *   **Tipografía:** Fuente moderna geométrica-humanista (*Inter, Geist, o Plus Jakarta Sans*). Establecer estilos de Texto Globales (`H1`, `H2`, `Body`, `Caption`).
    *   **Sombras y Radios (Borders):** Bordes suaves `6px` a `8px`. Evitar redondos exagerados estilo píldora salvo en badges.
2.  **Componentería (UI Kit Base):**
    *   **Botones:** Variantes completas (`Primary`, `Secondary`, `Outline`, `Ghost`, `Danger`, además de iconos combinados con Auto-Layout).
    *   **Inputs y Formularios:** `Select`, `Input Text` (con y sin label), Date-Pickers modernos e intuitivos, Radio buttons, Checkboxes, Toggle switches.
    *   **Badges/Pills:** Para estados dentro de las tablas (Ej: Fondo verde pálido con texto verde fuerte para "Pagado" o "Confirmada").

---

## � 3. Flujos Completos y Pantallas a Diseñar

### �️ Módulo 1: Portal y Autenticación
*   **Pantalla 1: Landing Page (Marketing del SaaS)**
    *   Hero section imponente mostrando un "Mockup" de la aplicación principal y frases de valor, planes de precios, y un llamado a "Crea tu Clínica".
*   **Pantalla 2: Onboarding de Nivel Dios (Wizard Multi-Tenant)**
    *   Diseño por pasos limpios, tipo *Stepper*. Nada de formularios de scroll largo.
    *   1. Paso Clínica (Logo, Nombre) -> 2. Administrador Maestro (Tus credenciales) -> 3. ¡Todo listo!
*   **Pantalla 3: Login Minimalista**
    *   Diseño dividido: Izquierda una fotografía curada o patrón sutil geométrico médico, Derecha un formulario de inicio de sesión centrado, con amplio margen interior, campos muy legibles. Botón enorme de "Iniciar Sesión".

### 📊 Módulo 2: Core Application Shell & Dashboard
*   **Layout Maestro:**
    *   Side-bar (Menú lateral) que puede colapsarse para dejar solo íconos modernos (ej: tipo Phosphor Icons o Lucide).
    *   Top-bar (Cabecera): Menú de perfil de usuario, campanita de alertas y fundamental: Un selector global visible desde dónde se pueda "Cambiar de Clínica" si el usuario tiene acceso a más de una.
*   **Pantalla 4: Dashboard Overview**
    *   Vista "A vuelo de pájaro". Tarjetas de métricas agrupadas en grid de 3 o 4 (Citas de Hoy, Ingresos, Pacientes).
    *   Tabla estilo widget "Últimos Movimientos".

### 🗓️ Módulo 3: El Gran Motor (Calendario Inteligente)
*   **Pantalla 5: Visualización de Calendario**
    *   Debe lucir tan pulcro como Calendly o Google Calendar. Los bloques de citas deben usar el color principal o el de la especialidad correspondiente.
    *   Alineación y grillas estrictas.
*   **Pantalla 6: Slide-over "Nueva Cita"**
    *   (Interacción UX Clave): Al darle a "Nueva Cita", NO cargar otra página. Que se deslice suavemente un Panel Lateral (Drawer / Slide-over) por la derecha para elegir al paciente, al doctor especialista y registrar el bloque de tiempo.

### 👨‍⚕️ Módulo 4: Modo Doctor (Máxima Concentración) - [CRÍTICO]
*   **Pantalla 7: El Consola de Diagnóstico (Split-View / Modo Fluido)**
    *   El éxito médico radica en ver y escribir al mismo tiempo.
    *   **Lado izquierdo (25% u Ocultable):** Historial del paciente en timeline condensado, sus fotos, constantes vitales previas y **Pills ROJAS para ALERGIAS muy vistosas**.
    *   **Lado derecho grueso (75%):** Formularios amplios, tipo "Pizarra en blanco", para el Motivo de Consulta, Exploración Física (espacio amplio), Diagnóstico y un buscador instantáneo (estilo búsqueda global) de medicamentos para recetar rápido sin salir de pantalla.

### 💳 Módulo 5: Recepción, Tesorería y Tablas
*   **Pantalla 8: Directorio de Clientes y Tablas Densas**
    *   Listas de Facturas / Pacientes. Las filas de las tablas (Data Tables) deben tener paginación abajo, buscador poderoso arriba a la izquierda. Cada fila debe tener acciones finales bajo un botón "..." (elipsis) para editar o cobrar.
*   **Pantalla 9: Checkout de Deuda (Modal de Cobro)**
    *   Estilo pasarela de Stripe. Resumen visual al centro como un ticket digital (Ej: Consulta General $50.00). Múltiples botones grandes en tarjeta para "Tarjeta", "Transferencia" o "Efectivo". Botón final "Proteger pago y Emitir Factura".

---

## 🚀 4. Expectativas de Entregables (Hand-off)
1.   El diseño debe enviarse con el **Prototipado habilitado en Figma** (Animaciones conectadas como Modales, Sidebars que entran lateralmente, Tabs que simulen cambiar vistas entre "Resumen" y "Citas" de un paciente).
2.   Cada pantalla debe estar agrupada en "Frames" y usar estricto Auto-layout.
3.   Toda desviación o componente hecho "a la medida" deberá poder ser inspeccionable con las nuevas herramientas del *Dev Mode* de Figma en 2026. ¡Si un programador ve márgenes rotos en Auto-layout, el diseño se regresa!
