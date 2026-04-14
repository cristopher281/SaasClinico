"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { apiRequest, apiRequestRaw } from "@/shared/api/http";
import { getStoredToken } from "@/shared/auth/token-storage";
import type { DataBundle } from "@/modules/operations/model/dashboard-types";
import type { StaffUser } from "@/shared/types/clinical";
import { EmptyState, Field, Metric, Panel, Row } from "@/shared/ui/dashboard/dashboard-primitives";
import styles from "@/modules/operations/components/clinic-shell.module.css";

type AdminWorkspaceProps = {
  section: "admin-overview" | "admin-clinic" | "admin-staff" | "admin-reports";
  data: DataBundle;
};

type Specialty = {
  id: string;
  nombre: string;
};

export function AdminWorkspace({ section, data }: AdminWorkspaceProps) {
  if (section === "admin-clinic") {
    return <ClinicManagement data={data} />;
  }

  if (section === "admin-staff") {
    return <StaffManagement data={data} />;
  }

  if (section === "admin-reports") {
    return <ReportsWorkspace data={data} />;
  }

  return <AdminOverview data={data} />;
}

function AdminOverview({ data }: { data: DataBundle }) {
  const totalRevenue = data.invoices.reduce(
    (sum, invoice) => sum + Number(invoice.resumenPago?.pagado ?? invoice.cantidadPago ?? 0),
    0,
  );

  return (
    <div className={styles.roleLayout}>
      <div className={styles.metrics}>
        <Metric title="Pacientes activos" value={String(data.patients.length)} />
        <Metric title="Doctores" value={String(data.doctors.length)} tone="accent" />
        <Metric title="Consultas" value={String(data.consultations.length)} />
        <Metric title="Ingresos" value={`$${totalRevenue.toFixed(2)}`} tone="warning" />
      </div>

      <div className={styles.grid3}>
        <Panel title="Flujo operativo" subtitle="Prioridades de direccion en tiempo real.">
          {data.appointments.slice(0, 5).map((item) => (
            <Row
              key={item.id}
              title={`${item.fecha} ${item.hora}`}
              subtitle={`${item.patient.nombre} con ${item.doctor.user.nombre}`}
              meta={item.estado}
            />
          ))}
        </Panel>
        <Panel title="Caja global" subtitle="Facturas con saldo o seguimiento pendiente.">
          {data.invoices.length ? (
            data.invoices.slice(0, 5).map((item) => (
              <Row
                key={item.id}
                title={item.numero}
                subtitle={item.appointment.patient.nombre}
                meta={`$${Number(item.resumenPago?.saldo ?? item.cantidadPago).toFixed(2)}`}
              />
            ))
          ) : (
            <EmptyState title="Sin facturas" text="No hay comprobantes emitidos todavia." />
          )}
        </Panel>
        <Panel title="Alertas de direccion" subtitle="Controles estructurales ya disponibles.">
          <Row title="Plantillas HTML" subtitle="Recetas y facturas administrables desde Clinica." meta="activo" />
          <Row title="Usuarios de staff" subtitle="Alta y eliminacion centralizadas en Staff." meta="activo" />
          <Row title="Separacion por rol" subtitle="RBAC aplicado ya en endpoints sensibles." meta="reforzado" />
        </Panel>
      </div>
    </div>
  );
}

function ClinicManagement({ data }: { data: DataBundle }) {
  const token = getStoredToken();
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    nombre: data.user.clinic.nombre ?? "",
    taxId: data.user.clinic.taxId ?? "",
    email: data.user.clinic.email ?? "",
    telefono: data.user.clinic.telefono ?? "",
    logoUrl: data.user.clinic.logoUrl ?? "",
    prescriptionTemplateHtml:
      `<html><body><h1>${data.user.clinic.nombre}</h1><p>{{patientName}}</p><ul>{{items}}</ul></body></html>`,
    invoiceTemplateHtml:
      `<html><body><h1>${data.user.clinic.nombre}</h1><p>{{invoiceNumber}}</p><p>{{patientName}}</p><p>{{total}}</p></body></html>`,
  });

  async function saveClinic(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setSaving(true);
    setMessage(null);

    try {
      await apiRequest("/clinics/current", {
        method: "PATCH",
        token,
        body: form,
      });

      if (logoFile) {
        const formData = new FormData();
        formData.append("file", logoFile);
        await apiRequest("/clinics/current/logo", {
          method: "POST",
          token,
          body: formData,
        });
      }

      setMessage("Configuracion de clinica actualizada.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo actualizar la clinica.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.roleLayout}>
      <div className={styles.grid2}>
        <Panel title="Datos de clinica" subtitle="Identidad institucional y datos visibles en documentos.">
          <form className={styles.form} onSubmit={saveClinic}>
            <Field label="Nombre">
              <input value={form.nombre} onChange={(event) => setForm((current) => ({ ...current, nombre: event.target.value }))} />
            </Field>
            <Field label="NIT / RUC">
              <input value={form.taxId} onChange={(event) => setForm((current) => ({ ...current, taxId: event.target.value }))} />
            </Field>
            <Field label="Correo">
              <input value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
            </Field>
            <Field label="Telefono">
              <input value={form.telefono} onChange={(event) => setForm((current) => ({ ...current, telefono: event.target.value }))} />
            </Field>
            <Field label="Logo">
              <input type="file" accept="image/*" onChange={(event) => setLogoFile(event.target.files?.[0] ?? null)} />
            </Field>
            <Field label="URL actual de logo" wide>
              <input value={form.logoUrl} onChange={(event) => setForm((current) => ({ ...current, logoUrl: event.target.value }))} />
            </Field>
            <Field label="Template receta HTML" wide>
              <textarea value={form.prescriptionTemplateHtml} onChange={(event) => setForm((current) => ({ ...current, prescriptionTemplateHtml: event.target.value }))} />
            </Field>
            <Field label="Template factura HTML" wide>
              <textarea value={form.invoiceTemplateHtml} onChange={(event) => setForm((current) => ({ ...current, invoiceTemplateHtml: event.target.value }))} />
            </Field>
            {message ? <div className={styles.success}>{message}</div> : null}
            <button className={styles.primaryButton} disabled={saving} type="submit">
              {saving ? "Guardando..." : "Guardar configuracion"}
            </button>
          </form>
        </Panel>

        <Panel title="Branding activo" subtitle="Referencia visual y de documentos del tenant.">
          <div className={styles.stack}>
            <Row title={data.user.clinic.nombre} subtitle={data.user.clinic.email ?? "Sin correo"} meta={data.user.clinic.telefono ?? "Sin telefono"} />
            <article className={styles.noteCard}>
              <strong>Logo y plantilla</strong>
              <p>El backend ya admite subida de logo y almacenamiento de templates HTML.</p>
            </article>
            <article className={styles.noteCard}>
              <strong>Vista previa</strong>
              <p>Los comprobantes y recetas usan estos templates para abrir una vista lista para imprimir a PDF.</p>
            </article>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function StaffManagement({ data }: { data: DataBundle }) {
  const token = getStoredToken();
  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    rol: "recepcionista",
    specialtyId: "",
    licencia: "",
    temporaryPassword: "",
  });

  useEffect(() => {
    if (!token) return;

    void (async () => {
      try {
        const [staffResponse, specialtiesResponse] = await Promise.all([
          apiRequest<StaffUser[]>("/auth/staff", { token }),
          apiRequest<Specialty[]>("/doctors/specialties", { token }),
        ]);
        setStaff(staffResponse);
        setSpecialties(specialtiesResponse);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "No se pudo cargar el staff.");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const grouped = useMemo(() => {
    return {
      doctors: staff.filter((item) => item.rol === "doctor"),
      reception: staff.filter((item) => item.rol === "recepcionista"),
      cashier: staff.filter((item) => item.rol === "cajero"),
    };
  }, [staff]);

  async function createStaff(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setSaving(true);
    setMessage(null);
    try {
      const response = await apiRequest<{
        temporaryPassword: string;
        notification?: { targetPath?: string };
        user: StaffUser;
      }>("/auth/staff", {
        method: "POST",
        token,
        body: {
          ...form,
          specialtyId: form.rol === "doctor" ? form.specialtyId : undefined,
          licencia: form.rol === "doctor" ? form.licencia : undefined,
          temporaryPassword: form.temporaryPassword || undefined,
        },
      });
      setStaff((current) => [response.user, ...current]);
      setMessage(
        `Staff creado. Password temporal: ${response.temporaryPassword}${
          response.notification?.targetPath ? ` | salida correo: ${response.notification.targetPath}` : ""
        }`,
      );
      setForm({
        nombre: "",
        email: "",
        rol: "recepcionista",
        specialtyId: "",
        licencia: "",
        temporaryPassword: "",
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo crear el usuario.");
    } finally {
      setSaving(false);
    }
  }

  async function removeStaff(staffId: string) {
    if (!token) return;
    try {
      await apiRequest(`/auth/staff/${staffId}`, { method: "DELETE", token });
      setStaff((current) => current.filter((item) => item.id !== staffId));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo eliminar el staff.");
    }
  }

  return (
    <div className={styles.roleLayout}>
      <div className={styles.grid2}>
        <Panel title="Alta de staff" subtitle="Solo el administrador puede provisionar personal.">
          <form className={styles.form} onSubmit={createStaff}>
            <Field label="Nombre">
              <input value={form.nombre} onChange={(event) => setForm((current) => ({ ...current, nombre: event.target.value }))} required />
            </Field>
            <Field label="Correo">
              <input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required />
            </Field>
            <Field label="Rol">
              <select value={form.rol} onChange={(event) => setForm((current) => ({ ...current, rol: event.target.value }))}>
                <option value="recepcionista">Recepcionista</option>
                <option value="doctor">Doctor</option>
                <option value="cajero">Cajero</option>
              </select>
            </Field>
            {form.rol === "doctor" ? (
              <>
                <Field label="Especialidad">
                  <select value={form.specialtyId} onChange={(event) => setForm((current) => ({ ...current, specialtyId: event.target.value }))} required>
                    <option value="">Selecciona especialidad</option>
                    {specialties.map((specialty) => (
                      <option key={specialty.id} value={specialty.id}>
                        {specialty.nombre}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Licencia">
                  <input value={form.licencia} onChange={(event) => setForm((current) => ({ ...current, licencia: event.target.value }))} />
                </Field>
              </>
            ) : null}
            <Field label="Password temporal opcional">
              <input value={form.temporaryPassword} onChange={(event) => setForm((current) => ({ ...current, temporaryPassword: event.target.value }))} />
            </Field>
            {message ? <div className={styles.success}>{message}</div> : null}
            <button className={styles.primaryButton} disabled={saving} type="submit">
              {saving ? "Creando..." : "Crear usuario"}
            </button>
          </form>
        </Panel>

        <Panel title="Staff actual" subtitle="Doctores, recepcion y caja dentro del tenant.">
          {loading ? (
            <div className={styles.loadingInline}>Cargando staff...</div>
          ) : (
            <div className={styles.stack}>
              <RoleList title="Doctores" items={grouped.doctors} onRemove={removeStaff} />
              <RoleList title="Recepcion" items={grouped.reception} onRemove={removeStaff} />
              <RoleList title="Caja" items={grouped.cashier} onRemove={removeStaff} />
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

function RoleList({
  title,
  items,
  onRemove,
}: {
  title: string;
  items: StaffUser[];
  onRemove: (staffId: string) => void;
}) {
  return (
    <div className={styles.stack}>
      <strong>{title}</strong>
      {items.length ? (
        items.map((item) => (
          <div key={item.id} className={styles.invoiceRow}>
            <Row
              title={item.nombre}
              subtitle={item.specialty?.nombre ?? item.email}
              meta={item.rol}
            />
            <button className={styles.secondaryButton} type="button" onClick={() => onRemove(item.id)}>
              Eliminar
            </button>
          </div>
        ))
      ) : (
        <EmptyState title={`Sin ${title.toLowerCase()}`} text="No hay usuarios registrados en este grupo." />
      )}
    </div>
  );
}

function ReportsWorkspace({ data }: { data: DataBundle }) {
  const completedAppointments = data.appointments.filter((item) => item.estado === "completada").length;
  const pendingInvoices = data.invoices.filter((item) => item.estado !== "pagada").length;

  return (
    <div className={styles.roleLayout}>
      <div className={styles.grid2}>
        <Panel title="Indicadores operativos" subtitle="Lectura ejecutiva para direccion.">
          <div className={styles.list}>
            <Row title="Citas completadas" subtitle="Pacientes efectivamente atendidos" meta={String(completedAppointments)} />
            <Row title="Consultas registradas" subtitle="Historias clinicas cargadas" meta={String(data.consultations.length)} />
            <Row title="Facturas pendientes" subtitle="Casos que requieren seguimiento de caja" meta={String(pendingInvoices)} />
          </div>
        </Panel>
        <Panel title="Resumen financiero" subtitle="Situacion actual del ciclo de cobro.">
          <div className={styles.list}>
            {data.invoices.slice(0, 6).map((invoice) => (
              <Row
                key={invoice.id}
                title={invoice.numero}
                subtitle={`${invoice.appointment.patient.nombre} - ${invoice.estado}`}
                meta={`$${Number(invoice.resumenPago?.total ?? invoice.cantidadPago).toFixed(2)}`}
              />
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
