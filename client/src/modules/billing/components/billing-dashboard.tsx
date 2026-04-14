"use client";

import { DashboardActions, DataBundle } from "@/modules/operations/model/dashboard-types";
import styles from "@/modules/operations/components/clinic-shell.module.css";
import { EmptyState, Field, Panel, Row } from "@/shared/ui/dashboard/dashboard-primitives";

export function BillingDashboard({
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
          title="Emitir factura"
          subtitle="Caja trabaja sobre una cita y deja el concepto listo para ticket."
        >
          <form
            className={styles.form}
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              void actions.createInvoice({
                appointmentId: form.get("appointmentId"),
                cantidadPago: Number(form.get("cantidadPago")),
                concepto: form.get("concepto"),
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
                    {item.patient.nombre} · {item.fecha}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Monto total">
              <input name="cantidadPago" type="number" step="0.01" required />
            </Field>
            <Field label="Concepto" wide>
              <textarea name="concepto" />
            </Field>
            <button className={styles.primaryButton} disabled={submitting} type="submit">
              Crear factura
            </button>
          </form>
        </Panel>

        <Panel
          title="Registrar pago"
          subtitle="Abonos o cobro completo sin salir del modulo de caja."
        >
          <form
            className={styles.form}
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const invoiceId = String(form.get("invoiceId") ?? "");
              void actions.createPayment(invoiceId, {
                monto: Number(form.get("monto")),
                metodoPago: form.get("metodoPago"),
                fecha: form.get("fecha"),
              });
              event.currentTarget.reset();
            }}
          >
            <Field label="Factura">
              <select name="invoiceId" required defaultValue="">
                <option value="" disabled>
                  Selecciona factura
                </option>
                {data.invoices.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.numero} · {item.appointment.patient.nombre}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Monto">
              <input name="monto" type="number" step="0.01" required />
            </Field>
            <Field label="Metodo de pago">
              <input name="metodoPago" required />
            </Field>
            <Field label="Fecha">
              <input name="fecha" type="date" />
            </Field>
            <button className={styles.primaryButton} disabled={submitting} type="submit">
              Aplicar pago
            </button>
          </form>
        </Panel>
      </div>

      <Panel
        title="Facturas visibles"
        subtitle="Control de caja con acceso directo a impresion de ticket."
      >
        {data.invoices.length ? (
          data.invoices.map((item) => (
            <div className={styles.invoiceRow} key={item.id}>
              <Row
                title={`${item.numero} · ${item.appointment.patient.nombre}`}
                subtitle={`${item.estado} · ${item.concepto ?? "Sin concepto"}`}
                meta={`$${Number(item.cantidadPago).toFixed(2)}`}
              />
              <button
                className={styles.secondaryButton}
                onClick={() => void actions.printInvoice(item.id)}
                type="button"
              >
                Imprimir ticket
              </button>
            </div>
          ))
        ) : (
          <EmptyState
            title="Sin facturas emitidas"
            text="Las facturas apareceran aqui para cobro e impresion."
          />
        )}
      </Panel>
    </div>
  );
}
