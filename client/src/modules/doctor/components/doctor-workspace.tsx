"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { DashboardActions, DataBundle } from "@/modules/operations/model/dashboard-types";
import { apiRequest } from "@/shared/api/http";
import { getStoredToken } from "@/shared/auth/token-storage";
import { EmptyState, Field, Panel, Row } from "@/shared/ui/dashboard/dashboard-primitives";
import styles from "@/modules/operations/components/clinic-shell.module.css";

const PrescriptionEditor = dynamic(
  () =>
    import("./doctor-prescription-editor").then((module) => ({
      default: module.DoctorPrescriptionEditor,
    })),
  {
    ssr: false,
    loading: () => <div className={styles.noteCard}>Cargando editor clinico...</div>,
  },
);

type DoctorWorkspaceProps = {
  section: "doctor-agenda" | "doctor-record" | "doctor-prescriptions";
  data: DataBundle;
  actions: DashboardActions;
  submitting: boolean;
};

export function DoctorWorkspace({
  section,
  data,
  actions,
  submitting,
}: DoctorWorkspaceProps) {
  if (section === "doctor-record") {
    return <DoctorRecordWorkspace data={data} />;
  }

  if (section === "doctor-prescriptions") {
    return <DoctorPrescriptionWorkspace data={data} actions={actions} submitting={submitting} />;
  }

  return <DoctorAgendaWorkspace data={data} />;
}

function DoctorAgendaWorkspace({ data }: { data: DataBundle }) {
  const doctorAppointments = useMemo(
    () =>
      data.appointments.filter(
        (item) => item.doctor.user.email === data.user.email || item.doctor.user.nombre === data.user.nombre,
      ),
    [data],
  );

  return (
    <div className={styles.roleLayout}>
      <Panel title="Mi agenda" subtitle="Solo citas asignadas al doctor autenticado.">
        {doctorAppointments.length ? (
          <div className={styles.list}>
            {doctorAppointments.map((item) => (
              <Row
                key={item.id}
                title={`${item.fecha} ${item.hora}  -  ${item.patient.nombre}`}
                subtitle={item.motivo ?? "Sin motivo registrado"}
                meta={item.estado}
              />
            ))}
          </div>
        ) : (
          <EmptyState title="Sin citas asignadas" text="La agenda personal aparecera aqui." />
        )}
      </Panel>
    </div>
  );
}

function DoctorRecordWorkspace({ data }: { data: DataBundle }) {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(data.patients[0]?.id ?? null);
  const [tab, setTab] = useState<"general" | "history" | "diagnosis">("general");

  const patient = useMemo(
    () => data.patients.find((item) => item.id === selectedPatientId) ?? null,
    [data.patients, selectedPatientId],
  );

  const consultations = useMemo(
    () => data.consultations.filter((item) => item.appointment.patient.id === selectedPatientId),
    [data.consultations, selectedPatientId],
  );

  return (
    <div className={styles.roleLayout}>
      <div className={styles.grid2}>
        <Panel title="Pacientes" subtitle="Selecciona un expediente para revisar su trayectoria clinica.">
          <div className={styles.list}>
            {data.patients.map((item) => (
              <Row
                key={item.id}
                title={item.nombre}
                subtitle={item.cedula}
                meta={item.telefono ?? "Sin telefono"}
                active={item.id === selectedPatientId}
                onClick={() => setSelectedPatientId(item.id)}
              />
            ))}
          </div>
        </Panel>

        <Panel title="Expediente clinico" subtitle="Tabs medicos con informacion relevante.">
          {patient ? (
            <div className={styles.stack}>
              <div className={styles.tabRow}>
                <button
                  type="button"
                  className={tab === "general" ? styles.tabActive : styles.tabButton}
                  onClick={() => setTab("general")}
                >
                  Informacion general
                </button>
                <button
                  type="button"
                  className={tab === "history" ? styles.tabActive : styles.tabButton}
                  onClick={() => setTab("history")}
                >
                  Historial
                </button>
                <button
                  type="button"
                  className={tab === "diagnosis" ? styles.tabActive : styles.tabButton}
                  onClick={() => setTab("diagnosis")}
                >
                  Diagnosticos
                </button>
              </div>

              {tab === "general" ? (
                <div className={styles.list}>
                  <Row title={patient.nombre} subtitle={patient.cedula} meta={patient.sexo ?? "No indicado"} />
                  <Row title="Contacto" subtitle={patient.email ?? "Sin correo"} meta={patient.telefono ?? "Sin telefono"} />
                  <Row title="Direccion" subtitle={patient.direccion ?? "Sin direccion"} />
                </div>
              ) : null}

              {tab === "history" ? (
                <div className={styles.list}>
                  {consultations.length ? (
                    consultations.map((item) => (
                      <Row
                        key={item.id}
                        title={`${item.appointment.fecha}  -  ${item.appointment.doctor.user.nombre}`}
                        subtitle={item.tratamiento ?? "Sin tratamiento"}
                        meta={item.appointment.estado}
                      />
                    ))
                  ) : (
                    <EmptyState title="Sin historial previo" text="Las consultas apareceran aqui." />
                  )}
                </div>
              ) : null}

              {tab === "diagnosis" ? (
                <div className={styles.list}>
                  {consultations.length ? (
                    consultations.map((item) => (
                      <Row key={item.id} title={item.diagnostico} subtitle={item.observaciones ?? "Sin observaciones"} />
                    ))
                  ) : (
                    <EmptyState title="Sin diagnosticos" text="No hay diagnosticos registrados todavia." />
                  )}
                </div>
              ) : null}
            </div>
          ) : (
            <EmptyState title="Selecciona un paciente" text="El expediente detallado se renderiza aqui." />
          )}
        </Panel>
      </div>
    </div>
  );
}

function DoctorPrescriptionWorkspace({
  data,
  actions,
  submitting,
}: {
  data: DataBundle;
  actions: DashboardActions;
  submitting: boolean;
}) {
  const [documentHtml, setDocumentHtml] = useState(
    "<p>Rp/</p><p>- Indicaciones del tratamiento</p><p>- Observaciones medicas</p>",
  );

  return (
    <div className={styles.roleLayout}>
      <div className={styles.grid2}>
        <Panel title="Generador de recetas" subtitle="Editor enriquecido con branding institucional.">
          <PrescriptionEditor
            clinicName={data.user.clinic.nombre}
            value={documentHtml}
            onChange={setDocumentHtml}
          />
          <div className={styles.inlineActions}>
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={() => window.print()}
            >
              Generar PDF / Imprimir
            </button>
            <button
              className={styles.ghostButton}
              type="button"
              onClick={async () => {
                const token = getStoredToken();
                const firstPrescription = data.prescriptions[0];
                if (!token || !firstPrescription) return;
                const preview = await apiRequest<{ html: string }>(
                  `/prescriptions/${firstPrescription.id}/preview`,
                  { token },
                );
                const popup = window.open("", "_blank");
                if (popup) {
                  popup.document.write(preview.html);
                  popup.document.close();
                }
              }}
            >
              Vista previa HTML
            </button>
          </div>
        </Panel>

        <Panel title="Guardar en historial" subtitle="La receta queda ligada a una consulta existente.">
          <form
            className={styles.form}
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              void actions.createPrescription({
                consultationId: form.get("consultationId"),
                items: [
                  {
                    medicationId: form.get("medicationId"),
                    dosis: form.get("dosis"),
                    frecuencia: form.get("frecuencia"),
                  },
                ],
              });
              event.currentTarget.reset();
            }}
          >
            <Field label="Consulta">
              <select name="consultationId" required defaultValue="">
                <option value="" disabled>
                  Selecciona consulta
                </option>
                {data.consultations.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.appointment.patient.nombre}  -  {item.diagnostico}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Medicamento">
              <select name="medicationId" required defaultValue="">
                <option value="" disabled>
                  Selecciona medicamento
                </option>
                {data.medications.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nombre}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Dosis">
              <input name="dosis" />
            </Field>
            <Field label="Frecuencia">
              <input name="frecuencia" />
            </Field>
            <button className={styles.primaryButton} disabled={submitting} type="submit">
              Guardar receta
            </button>
          </form>
        </Panel>
      </div>

      <Panel title="Laboratorio vinculado" subtitle="Continuidad del flujo clinico en la misma estacion del doctor.">
        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            void actions.createLaboratory({
              consultationId: form.get("consultationId"),
              resultado: form.get("resultado"),
            });
            event.currentTarget.reset();
          }}
        >
          <Field label="Consulta">
            <select name="consultationId" required defaultValue="">
              <option value="" disabled>
                Selecciona consulta
              </option>
              {data.consultations.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.appointment.patient.nombre}  -  {item.diagnostico}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Resultado o nota" wide>
            <textarea name="resultado" />
          </Field>
          <button className={styles.secondaryButton} disabled={submitting} type="submit">
            Guardar laboratorio
          </button>
        </form>
      </Panel>
    </div>
  );
}
