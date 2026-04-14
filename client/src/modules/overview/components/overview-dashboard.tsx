import { DataBundle } from "@/modules/operations/model/dashboard-types";
import styles from "@/modules/operations/components/clinic-shell.module.css";
import { EmptyState, Metric, Panel, Row } from "@/shared/ui/dashboard/dashboard-primitives";

export function OverviewDashboard({ data }: { data: DataBundle }) {
  const pendingAppointments = data.appointments.filter(
    (item) => item.estado !== "completada",
  );
  const openInvoices = data.invoices.filter((item) => item.estado !== "pagada");

  return (
    <>
      <div className={styles.hero}>
        <div className={styles.heroCard}>
          <span className={styles.pill}>Vision inmediata</span>
          <h3>
            {pendingAppointments.length} citas activas y {openInvoices.length} cobros pendientes.
          </h3>
          <p>
            Recepcion, doctores y caja comparten un mismo sistema, pero cada equipo
            ve prioridades claras desde este centro de control.
          </p>
        </div>
        <div className={styles.metrics}>
          <Metric title="Pacientes" value={String(data.patients.length)} />
          <Metric title="Doctores" value={String(data.doctors.length)} />
          <Metric title="Consultas" value={String(data.consultations.length)} tone="accent" />
          <Metric title="Facturas abiertas" value={String(openInvoices.length)} tone="warning" />
        </div>
      </div>

      <div className={styles.grid3}>
        <Panel title="Agenda prioritaria" subtitle="Lo que recepcion debe revisar ahora.">
          {pendingAppointments.length ? (
            pendingAppointments.slice(0, 5).map((item) => (
              <Row
                key={item.id}
                title={`${item.fecha} ${item.hora}`}
                subtitle={`${item.patient.nombre} con ${item.doctor.user.nombre}`}
                meta={item.estado}
              />
            ))
          ) : (
            <EmptyState title="Agenda controlada" text="No hay citas activas por resolver." />
          )}
        </Panel>

        <Panel title="Caja pendiente" subtitle="Cobros que requieren seguimiento.">
          {openInvoices.length ? (
            openInvoices.slice(0, 5).map((item) => (
              <Row
                key={item.id}
                title={item.numero}
                subtitle={`${item.appointment.patient.nombre} · ${item.estado}`}
                meta={`$${Number(item.cantidadPago).toFixed(2)}`}
              />
            ))
          ) : (
            <EmptyState title="Caja al dia" text="No hay facturas pendientes por ahora." />
          )}
        </Panel>

        <Panel title="Actividad medica" subtitle="Ultimas consultas registradas.">
          {data.consultations.length ? (
            data.consultations.slice(0, 5).map((item) => (
              <Row
                key={item.id}
                title={item.appointment.patient.nombre}
                subtitle={item.diagnostico}
                meta={item.appointment.doctor.user.nombre}
              />
            ))
          ) : (
            <EmptyState title="Sin consultas" text="El historial medico aparecera aqui." />
          )}
        </Panel>
      </div>
    </>
  );
}
