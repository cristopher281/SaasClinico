import type { AppRole } from "@/shared/types/clinical";

export type RoleModule = "overview" | "reception" | "doctor" | "billing";
export type AppSectionId =
  | "admin-overview"
  | "admin-clinic"
  | "admin-staff"
  | "admin-reports"
  | "reception-agenda"
  | "reception-patients"
  | "doctor-agenda"
  | "doctor-record"
  | "doctor-prescriptions"
  | "cashier-appointments"
  | "cashier-billing"
  | "cashier-receipts";

export type NavigationItem = {
  id: AppSectionId;
  path: string;
  label: string;
  note: string;
  roles: AppRole[];
  title: string;
  text: string;
  module: RoleModule;
};

export const navigationItems: NavigationItem[] = [
  {
    id: "admin-overview",
    path: "/app/resumen",
    label: "Resumen",
    note: "operacion global",
    roles: ["admin"],
    title: "Panel administrativo",
    text: "Vision ejecutiva de la clinica, sucursales y operacion general.",
    module: "overview",
  },
  {
    id: "admin-clinic",
    path: "/app/clinica",
    label: "Clinica",
    note: "configuracion",
    roles: ["admin"],
    title: "Gestion de clinica",
    text: "Datos globales, sucursal matriz, branding y plantillas administrables.",
    module: "overview",
  },
  {
    id: "admin-staff",
    path: "/app/staff",
    label: "Staff",
    note: "usuarios y roles",
    roles: ["admin"],
    title: "Gestion de usuarios",
    text: "Alta, control y coordinacion del personal operativo por rol.",
    module: "overview",
  },
  {
    id: "admin-reports",
    path: "/app/reportes",
    label: "Reportes",
    note: "finanzas y flujo",
    roles: ["admin"],
    title: "Reportes globales",
    text: "Indicadores financieros y operativos para direccion clinica.",
    module: "overview",
  },
  {
    id: "reception-agenda",
    path: "/app/recepcion/agenda",
    label: "Agenda",
    note: "flujo diario",
    roles: ["recepcionista"],
    title: "Agenda global",
    text: "Calendario diario de recepcion con foco en flujo, filtros y estados de cita.",
    module: "reception",
  },
  {
    id: "reception-patients",
    path: "/app/recepcion/pacientes",
    label: "Pacientes",
    note: "alta y seguimiento",
    roles: ["recepcionista"],
    title: "Pacientes y sala de espera",
    text: "Registro rapido de pacientes y control de estados sin exponer historial medico profundo.",
    module: "reception",
  },
  {
    id: "doctor-agenda",
    path: "/app/doctor/agenda",
    label: "Mi agenda",
    note: "solo mis citas",
    roles: ["doctor"],
    title: "Agenda del doctor",
    text: "Citas filtradas automaticamente para el profesional autenticado.",
    module: "doctor",
  },
  {
    id: "doctor-record",
    path: "/app/doctor/expediente",
    label: "Expediente",
    note: "historial clinico",
    roles: ["doctor"],
    title: "Expediente clinico",
    text: "Vista por tabs con datos generales, consultas previas y diagnosticos.",
    module: "doctor",
  },
  {
    id: "doctor-prescriptions",
    path: "/app/doctor/recetas",
    label: "Recetas",
    note: "wysiwyg y pdf",
    roles: ["doctor"],
    title: "Generador de recetas",
    text: "Editor enriquecido con branding clinico, guardado en historial y salida a PDF.",
    module: "doctor",
  },
  {
    id: "cashier-appointments",
    path: "/app/caja/citas",
    label: "Citas del dia",
    note: "solo lectura",
    roles: ["cajero"],
    title: "Citas atendidas",
    text: "Vista simplificada para identificar rapidamente a quien se debe cobrar.",
    module: "billing",
  },
  {
    id: "cashier-billing",
    path: "/app/caja/facturacion",
    label: "Facturacion",
    note: "punto de venta",
    roles: ["cajero"],
    title: "Facturacion POS",
    text: "Construccion de comprobantes, calculo de totales y emision de cobro.",
    module: "billing",
  },
  {
    id: "cashier-receipts",
    path: "/app/caja/comprobantes",
    label: "Comprobantes",
    note: "edicion final",
    roles: ["cajero"],
    title: "Gestor de comprobantes",
    text: "Revision final, impresion y salida PDF de facturas emitidas.",
    module: "billing",
  },
];

export function normalizeRole(role?: string | null): AppRole {
  switch (role) {
    case "admin":
      return "admin";
    case "doctor":
      return "doctor";
    case "recepcionista":
      return "recepcionista";
    case "cajero":
    case "cajera":
      return "cajero";
    case "paciente":
      return "paciente";
    default:
      return "unknown";
  }
}

export function getNavigationForRole(role?: string | null) {
  const normalizedRole = normalizeRole(role);
  return navigationItems.filter((item) => item.roles.includes(normalizedRole));
}

export function resolveSectionFromPath(pathname: string): NavigationItem {
  const normalizedPath = pathname.replace(/\/$/, "") || "/app/resumen";
  return (
    navigationItems.find((item) => item.path === normalizedPath) ?? navigationItems[0]
  );
}

export function resolveDefaultAppRoute(role?: string | null): string {
  const items = getNavigationForRole(role);
  if (items.length > 0) {
    return items[0].path;
  }

  return "/app/resumen";
}
