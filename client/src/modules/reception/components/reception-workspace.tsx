"use client";

import { useMemo, useState } from "react";
import { DashboardActions, DataBundle } from "@/modules/operations/model/dashboard-types";
import { EmptyState, Field, Panel, Row } from "@/shared/ui/dashboard/dashboard-primitives";
import styles from "@/modules/operations/components/clinic-shell.module.css";

type ReceptionWorkspaceProps = {
  section: "reception-agenda" | "reception-patients";
  data: DataBundle;
  actions: DashboardActions;
  submitting: boolean;
};

export function ReceptionWorkspace({
  section,
  data,
  actions,
  submitting,
}: ReceptionWorkspaceProps) {
  if (section === "reception-patients") {
    return <PatientsWorkspace data={data} actions={actions} submitting={submitting} />;
  }

  return <AgendaWorkspace data={data} />;
}

function AgendaWorkspace({ data }: { data: DataBundle }) {
  const [doctorFilter, setDoctorFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredAppointments = useMemo(() => {
    return data.appointments.filter((item) => {
      const doctorPass = doctorFilter === "all" || item.doctor.id === doctorFilter;
      const statusPass = statusFilter === "all" || item.estado === statusFilter;
      return doctorPass && statusPass;
    });
  }, [data.appointments, doctorFilter, statusFilter]);

  return (
    <div className={styles.roleLayout}>
      <div className={styles.grid2}>
        <Panel title="Filtros operativos" subtitle="Recepcion controla la agenda global.">
          <div className={styles.form}>
            <Field label="Doctor">
              <select value={doctorFilter} onChange={(event) => setDoctorFilter(event.target.value)}>
                <option value="all">Todos</option>
                {data.doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.user.nombre}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Estado">
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="all">Todos</option>
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="en sala de espera">En sala de espera</option>
                <option value="en consulta">En consulta</option>
                <option value="atendido">Atendido</option>
                <option value="completada">Completada</option>
              </select>
            </Field>
          </div>
        </Panel>

        <Panel title="Estado de sala" subtitle="Seguimiento inmediato del flujo diario.">
          <div className={styles.list}>
            <Row
              title="En sala de espera"
              subtitle="Pacientes listos para ser llamados"
              meta={String(data.appointments.filter((item) => item.estado === "en sala de espera").length)}
            />
            <Row
              title="En consulta"
              subtitle="Pacientes siendo atendidos"
              meta={String(data.appointments.filter((item) => item.estado === "en consulta").length)}
            />
            <Row
              title="Atendidos"
              subtitle="Listos para cierre o cobro"
              meta={String(
                data.appointments.filter(
                  (item) => item.estado === "atendido" || item.estado === "completada",
                ).length,
              )}
            />
          </div>
        </Panel>
      </div>

      <Panel
        title="Agenda global"
        subtitle="Base lista para integrarse con un calendario avanzado."
      >
        {filteredAppointments.length ? (
          <div className={styles.list}>
            {filteredAppointments.map((item) => (
              <Row
                key={item.id}
                title={`${item.fecha} ${item.hora}  -  ${item.patient.nombre}`}
                subtitle={`${item.doctor.user.nombre}  -  ${item.motivo ?? "Sin motivo"}`}
                meta={item.estado}
              />
            ))}
          </div>
        ) : (
          <EmptyState title="Sin coincidencias" text="Ajusta filtros o registra una nueva cita." />
        )}
      </Panel>
    </div>
  );
}

function PatientsWorkspace({
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

  const relatedAppointments = useMemo(
    () => data.appointments.filter((item) => item.patient.id === selectedPatientId),
    [data.appointments, selectedPatientId],
  );

  return (
    <div className={styles.roleLayout}>
      <div className={styles.grid2}>
        <Panel title="Nuevo paciente" subtitle="Recepcion solo captura datos demograficos.">
          <PatientCreateForm actions={actions} submitting={submitting} />
        </Panel>

        <Panel title="Nueva cita" subtitle="Programacion rapida sin historial medico profundo.">
          <AppointmentCreateForm data={data} actions={actions} submitting={submitting} />
        </Panel>
      </div>

      <div className={styles.grid2}>
        <Panel title="Pacientes" subtitle="Vista rapida de identificacion y contacto.">
          <div className={styles.list}>
            {data.patients.map((patient) => (
              <Row
                key={patient.id}
                title={patient.nombre}
                subtitle={`${patient.cedula}  -  ${patient.telefono ?? "Sin telefono"}`}
                meta={patient.email ?? "Sin correo"}
                active={patient.id === selectedPatientId}
                onClick={() => setSelectedPatientId(patient.id)}
              />
            ))}
          </div>
        </Panel>

        <Panel title="Seguimiento de cita" subtitle="Solo estado operativo y proximos movimientos.">
          {selectedPatient ? (
            <div className={styles.stack}>
              <article className={styles.noteCard}>
                <strong>{selectedPatient.nombre}</strong>
                <p>{selectedPatient.direccion ?? "Direccion no registrada"}</p>
              </article>

              <div className={styles.list}>
                {relatedAppointments.length ? (
                  relatedAppointments.map((appointment) => (
                    <Row
                      key={appointment.id}
                      title={`${appointment.fecha} ${appointment.hora}`}
                      subtitle={`${appointment.doctor.user.nombre}  -  ${appointment.motivo ?? "Sin motivo"}`}
                      meta={appointment.estado}
                    />
                  ))
                ) : (
                  <EmptyState
                    title="Sin citas asociadas"
                    text="Este paciente aun no tiene agenda registrada."
                  />
                )}
              </div>
            </div>
          ) : (
            <EmptyState
              title="Selecciona un paciente"
              text="Recepcion puede revisar aqui su flujo operativo inmediato."
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
          {data.patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.nombre}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Doctor">
        <select name="doctorId" required defaultValue="">
          <option value="" disabled>
            Selecciona doctor
          </option>
          {data.doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.user.nombre}
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
      <Field label="Estado inicial">
        <select name="estado" defaultValue="pendiente">
          <option value="pendiente">Pendiente</option>
          <option value="confirmada">Confirmada</option>
          <option value="en sala de espera">En sala de espera</option>
        </select>
      </Field>
      <Field label="Motivo" wide>
        <textarea name="motivo" />
      </Field>
      <button className={styles.primaryButton} disabled={submitting} type="submit">
        Programar cita
      </button>
    </form>
  );
}
