"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AdminWorkspace } from "@/modules/admin/components/admin-workspace";
import { CashierWorkspace } from "@/modules/cashier/components/cashier-workspace";
import { ReceptionWorkspace } from "@/modules/reception/components/reception-workspace";
import { apiRequest } from "@/shared/api/http";
import { clearStoredToken, getStoredToken } from "@/shared/auth/token-storage";
import type {
  Appointment,
  Consultation,
  Doctor,
  Invoice,
  LaboratoryRecord,
  Medication,
  Patient,
  Prescription,
  UserProfile,
} from "@/shared/types/clinical";
import styles from "./clinic-shell.module.css";
import { ActionState, DashboardActions, DataBundle } from "../model/dashboard-types";
import {
  getNavigationForRole,
  resolveDefaultAppRoute,
  resolveSectionFromPath,
} from "../model/module-routes";

const DoctorWorkspace = dynamic(
  () => import("@/modules/doctor/components/doctor-workspace").then((module) => module.DoctorWorkspace),
  {
    ssr: false,
    loading: () => <div className={styles.loadingInline}>Cargando modulo clinico...</div>,
  },
);

export function ClinicShell() {
  const pathname = usePathname();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [data, setData] = useState<DataBundle | null>(null);
  const [state, setState] = useState<ActionState>({
    submitting: false,
    error: null,
    success: null,
  });
  const [loading, setLoading] = useState(true);
  const activeSection = resolveSectionFromPath(pathname);

  useEffect(() => {
    const currentToken = getStoredToken();
    if (!currentToken) {
      router.replace("/login");
      return;
    }

    setToken(currentToken);
    void loadAll(currentToken);
  }, [router]);

  const roleSummary = useMemo(() => {
    if (!data) return "Operacion coordinada";
    if (data.user.rol === "doctor") return "Atencion clinica, expediente y recetas";
    if (data.user.rol === "recepcionista") return "Agenda global, pacientes y logistica de flujo";
    if (data.user.rol === "cajero" || data.user.rol === "cajera") {
      return "Cobro, comprobantes y cierre operativo";
    }
    return "Gobierno clinico, staff y reportes";
  }, [data]);

  const visibleNavigation = useMemo(() => getNavigationForRole(data?.user.rol), [data?.user.rol]);

  async function loadAll(currentToken: string) {
    try {
      setLoading(true);
      setState((current) => ({ ...current, error: null }));

      const user = await apiRequest<UserProfile>("/auth/me", { token: currentToken });

      const requests: [
        Promise<Patient[]>,
        Promise<Doctor[]>,
        Promise<Appointment[]>,
        Promise<Consultation[]>,
        Promise<Invoice[]>,
        Promise<Medication[]>,
        Promise<Prescription[]>,
        Promise<LaboratoryRecord[]>,
      ] = [
        canAccess(user.rol, ["admin", "recepcionista", "doctor"])
          ? apiRequest<Patient[]>("/patients", { token: currentToken })
          : Promise.resolve<Patient[]>([]),
        canAccess(user.rol, ["admin", "recepcionista", "doctor"])
          ? apiRequest<Doctor[]>("/doctors", { token: currentToken })
          : Promise.resolve<Doctor[]>([]),
        canAccess(user.rol, ["admin", "recepcionista", "doctor", "cajero"])
          ? apiRequest<Appointment[]>("/appointments", { token: currentToken })
          : Promise.resolve<Appointment[]>([]),
        canAccess(user.rol, ["admin", "doctor"])
          ? apiRequest<Consultation[]>("/consultations", { token: currentToken })
          : Promise.resolve<Consultation[]>([]),
        canAccess(user.rol, ["admin", "cajero"])
          ? apiRequest<Invoice[]>("/billing/invoices", { token: currentToken })
          : Promise.resolve<Invoice[]>([]),
        canAccess(user.rol, ["admin", "doctor"])
          ? apiRequest<Medication[]>("/medications", { token: currentToken })
          : Promise.resolve<Medication[]>([]),
        canAccess(user.rol, ["admin", "doctor"])
          ? apiRequest<Prescription[]>("/prescriptions", { token: currentToken })
          : Promise.resolve<Prescription[]>([]),
        canAccess(user.rol, ["admin", "doctor"])
          ? apiRequest<LaboratoryRecord[]>("/laboratory", { token: currentToken })
          : Promise.resolve<LaboratoryRecord[]>([]),
      ];

      const [
        patients,
        doctors,
        appointments,
        consultations,
        invoices,
        medications,
        prescriptions,
        laboratory,
      ] = await Promise.all(requests);

      const bundle: DataBundle = {
        user,
        patients,
        doctors,
        appointments,
        consultations,
        invoices,
        medications,
        prescriptions,
        laboratory,
      };

      setData(bundle);

      const allowedPaths = new Set(getNavigationForRole(user.rol).map((item) => item.path));
      if (!allowedPaths.has(pathname)) {
        router.replace(resolveDefaultAppRoute(user.rol));
      }
    } catch (error) {
      setState((current) => ({
        ...current,
        error: error instanceof Error ? error.message : "No se pudo cargar el panel.",
      }));
    } finally {
      setLoading(false);
    }
  }

  async function perform(
    action: () => Promise<void>,
    successMessage: string,
    errorMessage: string,
  ) {
    if (!token) return;

    setState({ submitting: true, error: null, success: null });
    try {
      await action();
      setState({ submitting: false, error: null, success: successMessage });
      await loadAll(token);
    } catch (error) {
      setState({
        submitting: false,
        error: error instanceof Error ? error.message : errorMessage,
        success: null,
      });
    }
  }

  const actions: DashboardActions = {
    refresh: async () => {
      if (token) {
        await loadAll(token);
      }
    },
    createPatient: async (payload) => {
      await perform(
        () => apiRequest("/patients", { method: "POST", token, body: payload }).then(() => undefined),
        "Paciente creado correctamente.",
        "No se pudo crear el paciente.",
      );
    },
    updatePatient: async (patientId, payload) => {
      await perform(
        () =>
          apiRequest(`/patients/${patientId}`, {
            method: "PATCH",
            token,
            body: payload,
          }).then(() => undefined),
        "Paciente actualizado correctamente.",
        "No se pudo actualizar el paciente.",
      );
    },
    createAppointment: async (payload) => {
      await perform(
        () => apiRequest("/appointments", { method: "POST", token, body: payload }).then(() => undefined),
        "Cita creada correctamente.",
        "No se pudo crear la cita.",
      );
    },
    createConsultation: async (payload) => {
      await perform(
        () => apiRequest("/consultations", { method: "POST", token, body: payload }).then(() => undefined),
        "Consulta registrada correctamente.",
        "No se pudo registrar la consulta.",
      );
    },
    createInvoice: async (payload) => {
      await perform(
        () =>
          apiRequest("/billing/invoices", { method: "POST", token, body: payload }).then(() => undefined),
        "Factura creada correctamente.",
        "No se pudo crear la factura.",
      );
    },
    createPayment: async (invoiceId, payload) => {
      await perform(
        () =>
          apiRequest(`/billing/invoices/${invoiceId}/payments`, {
            method: "POST",
            token,
            body: payload,
          }).then(() => undefined),
        "Pago aplicado correctamente.",
        "No se pudo registrar el pago.",
      );
    },
    printInvoice: async (invoiceId) => {
      await perform(
        () =>
          apiRequest(`/billing/invoices/${invoiceId}/print`, {
            method: "POST",
            token,
          }).then(() => undefined),
        "Comprobante enviado al flujo de impresion configurado.",
        "No se pudo imprimir el comprobante.",
      );
    },
    createPrescription: async (payload) => {
      await perform(
        () => apiRequest("/prescriptions", { method: "POST", token, body: payload }).then(() => undefined),
        "Receta creada correctamente.",
        "No se pudo crear la receta.",
      );
    },
    createLaboratory: async (payload) => {
      await perform(
        () => apiRequest("/laboratory", { method: "POST", token, body: payload }).then(() => undefined),
        "Registro de laboratorio creado.",
        "No se pudo crear el registro de laboratorio.",
      );
    },
  };

  function logout() {
    clearStoredToken();
    router.replace("/login");
  }

  if (loading || !data) {
    return (
      <main className={styles.loading}>
        <div className={styles.loadingCard}>
          <span className={styles.pill}>Preparando estacion clinica</span>
          <h1>Cargando informacion esencial</h1>
          <p>Estamos reuniendo agenda, pacientes, caja y consultas para el equipo.</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandMark} />
          <div>
            <span className={styles.pill}>SaaS Clinico</span>
            <h1>{data.user.clinic.nombre}</h1>
            <p>{data.user.nombre}</p>
            <small>{humanRole(data.user.rol)}</small>
          </div>
        </div>

        <div className={styles.roleCard}>
          <strong>Acceso dinamico por rol</strong>
          <p>{roleSummary}</p>
        </div>

        <nav className={styles.nav}>
          {visibleNavigation.map((item) => (
            <Link
              key={item.id}
              href={item.path}
              className={pathname === item.path ? styles.navActive : styles.navButton}
            >
              <span>{item.label}</span>
              <small>{item.note}</small>
            </Link>
          ))}
        </nav>

        <button className={styles.logout} onClick={logout} type="button">
          Cerrar sesion
        </button>
      </aside>

      <section className={styles.content}>
        <header className={styles.header}>
          <div>
            <span className={styles.pill}>{humanRole(data.user.rol)}</span>
            <h2>{activeSection.title}</h2>
            <p>{activeSection.text}</p>
          </div>
          <div className={styles.inlineActions}>
            <button className={styles.refresh} onClick={() => void actions.refresh()} type="button">
              Recargar panel
            </button>
          </div>
        </header>

        {state.error ? <div className={styles.error}>{state.error}</div> : null}
        {state.success ? <div className={styles.success}>{state.success}</div> : null}

        {activeSection.id.startsWith("admin-") ? (
          <AdminWorkspace
            section={activeSection.id as "admin-overview" | "admin-clinic" | "admin-staff" | "admin-reports"}
            data={data}
          />
        ) : null}

        {activeSection.id.startsWith("reception-") ? (
          <ReceptionWorkspace
            section={activeSection.id as "reception-agenda" | "reception-patients"}
            data={data}
            actions={actions}
            submitting={state.submitting}
          />
        ) : null}

        {activeSection.id.startsWith("doctor-") ? (
          <DoctorWorkspace
            section={
              activeSection.id as "doctor-agenda" | "doctor-record" | "doctor-prescriptions"
            }
            data={data}
            actions={actions}
            submitting={state.submitting}
          />
        ) : null}

        {activeSection.id.startsWith("cashier-") ? (
          <CashierWorkspace
            section={
              activeSection.id as
                | "cashier-appointments"
                | "cashier-billing"
                | "cashier-receipts"
            }
            data={data}
            actions={actions}
            submitting={state.submitting}
          />
        ) : null}
      </section>
    </main>
  );
}

function canAccess(role: string, allowedRoles: string[]) {
  return allowedRoles.includes(role === "cajera" ? "cajero" : role);
}

function humanRole(role: string) {
  return {
    admin: "Administrador",
    doctor: "Doctor",
    recepcionista: "Recepcion",
    cajero: "Caja",
    cajera: "Caja",
    paciente: "Paciente",
  }[role] ?? role;
}
