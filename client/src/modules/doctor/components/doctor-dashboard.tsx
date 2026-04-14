"use client";

import { DashboardActions, DataBundle } from "@/modules/operations/model/dashboard-types";
import styles from "@/modules/operations/components/clinic-shell.module.css";
import { EmptyState, Field, Panel, Row } from "@/shared/ui/dashboard/dashboard-primitives";

export function DoctorDashboard({
  data,
  actions,
  submitting,
}: {
  data: DataBundle;
  actions: DashboardActions;
  submitting: boolean;
}) {
  return (
    <div className={styles.roleLayout}>
      <div className={styles.grid2}>
        <Panel
          title="Registrar consulta"
          subtitle="Diagnostico, tratamiento y observaciones en una misma vista."
        >
          <form
            className={styles.form}
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              void actions.createConsultation({
                appointmentId: form.get("appointmentId"),
                diagnostico: form.get("diagnostico"),
                tratamiento: form.get("tratamiento"),
                observaciones: form.get("observaciones"),
              });
              event.currentTarget.reset();
            }}
          >
            <Field label="Cita">
              <select name="appointmentId" required defaultValue="">
                <option value="" disabled>
                  Selecciona cita
                </option>
                {data.appointments.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.patient.nombre} · {item.fecha} {item.hora}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Diagnostico" wide>
              <textarea name="diagnostico" required />
            </Field>
            <Field label="Tratamiento" wide>
              <textarea name="tratamiento" />
            </Field>
            <Field label="Observaciones" wide>
              <textarea name="observaciones" />
            </Field>
            <button className={styles.primaryButton} disabled={submitting} type="submit">
              Guardar consulta
            </button>
          </form>
        </Panel>

        <Panel
          title="Receta y laboratorio"
          subtitle="Secuencia clinica posterior a la consulta."
        >
          <div className={styles.stack}>
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
              <h4>Emitir receta</h4>
              <Field label="Consulta">
                <select name="consultationId" required defaultValue="">
                  <option value="" disabled>
                    Selecciona consulta
                  </option>
                  {data.consultations.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.appointment.patient.nombre} · {item.diagnostico}
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
              <button className={styles.secondaryButton} disabled={submitting} type="submit">
                Guardar receta
              </button>
            </form>

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
              <h4>Registrar laboratorio</h4>
              <Field label="Consulta">
                <select name="consultationId" required defaultValue="">
                  <option value="" disabled>
                    Selecciona consulta
                  </option>
                  {data.consultations.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.appointment.patient.nombre} · {item.diagnostico}
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
          </div>
        </Panel>
      </div>

      <div className={styles.grid2}>
        <Panel
          title="Consultas recientes"
          subtitle="Seguimiento rapido de pacientes atendidos."
        >
          {data.consultations.length ? (
            data.consultations.map((item) => (
              <Row
                key={item.id}
                title={item.appointment.patient.nombre}
                subtitle={item.diagnostico}
                meta={item.appointment.doctor.user.nombre}
              />
            ))
          ) : (
            <EmptyState
              title="Sin consultas"
              text="Las consultas medicas quedaran visibles aqui."
            />
          )}
        </Panel>

        <Panel
          title="Actividad clinica vinculada"
          subtitle="Recetas y laboratorio conectados al historial del paciente."
        >
          {data.prescriptions.length || data.laboratory.length ? (
            <div className={styles.list}>
              {data.prescriptions.slice(0, 4).map((item) => (
                <Row
                  key={`p-${item.id}`}
                  title={`Receta · ${item.consultation.appointment.patient.nombre}`}
                  subtitle={item.items.map((entry) => entry.medication?.nombre ?? "Medicamento").join(", ")}
                  meta="Receta"
                />
              ))}
              {data.laboratory.slice(0, 4).map((item) => (
                <Row
                  key={`l-${item.id}`}
                  title={`Laboratorio · ${item.consultation.appointment.patient.nombre}`}
                  subtitle={item.resultado ?? "Sin resultado"}
                  meta="Lab"
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Sin actividad clinica vinculada"
              text="Recetas y laboratorio apareceran cuando el medico los registre."
            />
          )}
        </Panel>
      </div>
    </div>
  );
}
