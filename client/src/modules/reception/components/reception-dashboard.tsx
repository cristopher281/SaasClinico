"use client";

import { useMemo, useState } from "react";
import { DashboardActions, DataBundle } from "@/modules/operations/model/dashboard-types";
import styles from "@/modules/operations/components/clinic-shell.module.css";
import type { Patient } from "@/shared/types/clinical";
import { EmptyState, Field, Panel, Row } from "@/shared/ui/dashboard/dashboard-primitives";

export function ReceptionDashboard({
  data,
  actions,
  submitting,
}: {
  data: DataBundle;
  actions: DashboardActions;
  submitting: boolean;
}) {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    data.patients[0]?.id ?? null,
  );

  const selectedPatient = useMemo(
    () => data.patients.find((item) => item.id === selectedPatientId) ?? null,
    [data.patients, selectedPatientId],
  );

  const patientAppointments = useMemo(
    () =>
      data.appointments
        .filter((item) => item.patient.id === selectedPatientId)
        .sort((a, b) =>
          `${b.fecha}T${b.hora}`.localeCompare(`${a.fecha}T${a.hora}`),
        ),
    [data.appointments, selectedPatientId],
  );

  const patientConsultations = useMemo(
    () =>
      data.consultations.filter(
        (item) => item.appointment.patient.id === selectedPatientId,
      ),
    [data.consultations, selectedPatientId],
  );

  return (
    <div className={styles.roleLayout}>
      <div className={styles.grid2}>
        <Panel
          title="Alta de paciente"
          subtitle="Recepcion registra rapido y sin pasos tecnicos."
        >
          <PatientCreateForm actions={actions} submitting={submitting} />
        </Panel>

        <Panel
          title="Programar cita"
          subtitle="La agenda queda ligada al paciente correcto y al doctor disponible."
        >
          <AppointmentCreateForm data={data} actions={actions} submitting={submitting} />
        </Panel>
      </div>

      <div className={styles.grid2}>
        <Panel
          title="Pacientes"
          subtitle="Selecciona un paciente para editar sus datos y ver su historial."
        >
          <div className={styles.list}>
            {data.patients.length ? (
              data.patients.map((item) => (
                <Row
                  key={item.id}
                  active={item.id === selectedPatientId}
                  onClick={() => setSelectedPatientId(item.id)}
                  title={item.nombre}
                  subtitle={`${item.cedula} · ${item.telefono ?? "Sin telefono"}`}
                  meta={item.email ?? "Sin correo"}
                />
              ))
            ) : (
              <EmptyState
                title="Sin pacientes"
                text="Recepcion puede empezar registrando el primer paciente."
              />
            )}
          </div>
        </Panel>

        <Panel
          title="Ficha e historial"
          subtitle="Datos editables y trayectoria clinica vinculada a sus citas."
        >
          {selectedPatient ? (
            <div className={styles.stack}>
              <PatientEditForm
                patient={selectedPatient}
                actions={actions}
                submitting={submitting}
              />
              <div className={styles.timeline}>
                <h4>Calendario e historial clinico</h4>
                {patientAppointments.length ? (
                  patientAppointments.map((appointment) => {
                    const consultation = patientConsultations.find(
                      (item) => item.appointment.id === appointment.id,
                    );
                    return (
                      <article className={styles.timelineItem} key={appointment.id}>
                        <strong>
                          {appointment.fecha} · {appointment.hora}
                        </strong>
                        <span>
                          {appointment.doctor.user.nombre} · {appointment.estado}
                        </span>
                        <p>{appointment.motivo ?? "Sin motivo registrado"}</p>
                        {consultation ? (
                          <div className={styles.timelineNote}>
                            <strong>Consulta vinculada</strong>
                            <p>{consultation.diagnostico}</p>
                          </div>
                        ) : null}
                      </article>
                    );
                  })
                ) : (
                  <EmptyState
                    title="Sin historial aun"
                    text="Las citas y consultas de este paciente apareceran aqui."
                  />
                )}
              </div>
            </div>
          ) : (
            <EmptyState
              title="Selecciona un paciente"
              text="Al elegir uno, podras editar sus datos y revisar su historial."
            />
          )}
        </Panel>
      </div>
    </div>
  );
}

function PatientCreateForm({
  actions,
  submitting,
}: {
  actions: DashboardActions;
  submitting: boolean;
}) {
  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        void actions.createPatient({
          nombre: String(form.get("nombre") ?? ""),
          cedula: String(form.get("cedula") ?? ""),
          fechaNacimiento: String(form.get("fechaNacimiento") ?? ""),
          sexo: String(form.get("sexo") ?? ""),
          telefono: String(form.get("telefono") ?? ""),
          email: String(form.get("email") ?? ""),
          direccion: String(form.get("direccion") ?? ""),
        });
        event.currentTarget.reset();
      }}
    >
      <Field label="Nombre completo">
        <input name="nombre" required />
      </Field>
      <Field label="Cedula o identificacion">
        <input name="cedula" required />
      </Field>
      <Field label="Fecha de nacimiento">
        <input name="fechaNacimiento" type="date" />
      </Field>
      <Field label="Sexo">
        <input name="sexo" />
      </Field>
      <Field label="Telefono">
        <input name="telefono" />
      </Field>
      <Field label="Correo">
        <input name="email" type="email" />
      </Field>
      <Field label="Direccion" wide>
        <textarea name="direccion" />
      </Field>
      <button className={styles.primaryButton} disabled={submitting} type="submit">
        Guardar paciente
      </button>
    </form>
  );
}

function AppointmentCreateForm({
  data,
  actions,
  submitting,
}: {
  data: DataBundle;
  actions: DashboardActions;
  submitting: boolean;
}) {
  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        void actions.createAppointment({
          patientId: form.get("patientId"),
          doctorId: form.get("doctorId"),
          fecha: form.get("fecha"),
          hora: form.get("hora"),
          estado: form.get("estado"),
          motivo: form.get("motivo"),
        });
        event.currentTarget.reset();
      }}
    >
      <Field label="Paciente">
        <select name="patientId" required defaultValue="">
          <option value="" disabled>
            Selecciona paciente
          </option>
          {data.patients.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nombre}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Doctor">
        <select name="doctorId" required defaultValue="">
          <option value="" disabled>
            Selecciona doctor
          </option>
          {data.doctors.map((item) => (
            <option key={item.id} value={item.id}>
              {item.user.nombre}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Fecha">
        <input name="fecha" type="date" required />
      </Field>
      <Field label="Hora">
        <input name="hora" type="time" required />
      </Field>
      <Field label="Estado">
        <select name="estado" defaultValue="pendiente">
          <option value="pendiente">Pendiente</option>
          <option value="confirmada">Confirmada</option>
          <option value="cancelada">Cancelada</option>
          <option value="completada">Completada</option>
        </select>
      </Field>
      <Field label="Motivo" wide>
        <textarea name="motivo" />
      </Field>
      <button className={styles.primaryButton} disabled={submitting} type="submit">
        Agendar cita
      </button>
    </form>
  );
}

function PatientEditForm({
  patient,
  actions,
  submitting,
}: {
  patient: Patient;
  actions: DashboardActions;
  submitting: boolean;
}) {
  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        void actions.updatePatient(patient.id, {
          nombre: String(form.get("nombre") ?? ""),
          cedula: String(form.get("cedula") ?? ""),
          fechaNacimiento: String(form.get("fechaNacimiento") ?? ""),
          sexo: String(form.get("sexo") ?? ""),
          telefono: String(form.get("telefono") ?? ""),
          email: String(form.get("email") ?? ""),
          direccion: String(form.get("direccion") ?? ""),
        });
      }}
    >
      <h4>Editar ficha del paciente</h4>
      <Field label="Nombre completo">
        <input name="nombre" defaultValue={patient.nombre} required />
      </Field>
      <Field label="Cedula">
        <input name="cedula" defaultValue={patient.cedula} required />
      </Field>
      <Field label="Fecha de nacimiento">
        <input name="fechaNacimiento" type="date" defaultValue={patient.fechaNacimiento ?? ""} />
      </Field>
      <Field label="Sexo">
        <input name="sexo" defaultValue={patient.sexo ?? ""} />
      </Field>
      <Field label="Telefono">
        <input name="telefono" defaultValue={patient.telefono ?? ""} />
      </Field>
      <Field label="Correo">
        <input name="email" type="email" defaultValue={patient.email ?? ""} />
      </Field>
      <Field label="Direccion" wide>
        <textarea name="direccion" defaultValue={patient.direccion ?? ""} />
      </Field>
      <button className={styles.secondaryButton} disabled={submitting} type="submit">
        Actualizar paciente
      </button>
    </form>
  );
}
