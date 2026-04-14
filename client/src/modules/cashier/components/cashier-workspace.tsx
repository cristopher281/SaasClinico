"use client";

import { useMemo, useState } from "react";
import { DashboardActions, DataBundle } from "@/modules/operations/model/dashboard-types";
import { apiRequest } from "@/shared/api/http";
import { getStoredToken } from "@/shared/auth/token-storage";
import { EmptyState, Field, Panel, Row } from "@/shared/ui/dashboard/dashboard-primitives";
import styles from "@/modules/operations/components/clinic-shell.module.css";

type CashierWorkspaceProps = {
  section: "cashier-appointments" | "cashier-billing" | "cashier-receipts";
  data: DataBundle;
  actions: DashboardActions;
  submitting: boolean;
};

type PosItem = {
  label: string;
  amount: number;
};

export function CashierWorkspace({
  section,
  data,
  actions,
  submitting,
}: CashierWorkspaceProps) {
  if (section === "cashier-billing") {
    return <CashierBillingWorkspace data={data} actions={actions} submitting={submitting} />;
  }

  if (section === "cashier-receipts") {
    return <CashierReceiptsWorkspace data={data} actions={actions} />;
  }

  return <CashierAppointmentsWorkspace data={data} />;
}

function CashierAppointmentsWorkspace({ data }: { data: DataBundle }) {
  const todaysAppointments = data.appointments.slice(0, 8);

  return (
    <Panel title="Citas del dia" subtitle="Caja solo necesita lectura rapida para procesar cobros.">
      {todaysAppointments.length ? (
        <div className={styles.list}>
          {todaysAppointments.map((item) => (
            <Row
              key={item.id}
              title={`${item.patient.nombre}  -  ${item.fecha}`}
              subtitle={`${item.doctor.user.nombre}  -  ${item.motivo ?? "Sin motivo"}`}
              meta={item.estado}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="Sin citas" text="No hay citas visibles para caja." />
      )}
    </Panel>
  );
}

function CashierBillingWorkspace({
  data,
  actions,
  submitting,
}: {
  data: DataBundle;
  actions: DashboardActions;
  submitting: boolean;
}) {
  const [items, setItems] = useState<PosItem[]>([{ label: "Consulta general", amount: 20 }]);
  const total = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [items],
  );

  function updateItem(index: number, key: keyof PosItem, value: string) {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [key]: key === "amount" ? Number(value) : value,
            }
          : item,
      ),
    );
  }

  return (
    <div className={styles.roleLayout}>
      <div className={styles.grid2}>
        <Panel title="Facturacion POS" subtitle="Servicios y totales construidos antes de emitir la factura.">
          <form
            className={styles.form}
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              void actions.createInvoice({
                appointmentId: form.get("appointmentId"),
                cantidadPago: total,
                concepto: items.map((item) => `${item.label} $${item.amount}`).join(", "),
              });
            }}
          >
            <Field label="Cita atendida">
              <select name="appointmentId" required defaultValue="">
                <option value="" disabled>
                  Selecciona cita
                </option>
                {data.appointments.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.patient.nombre}  -  {item.fecha}
                  </option>
                ))}
              </select>
            </Field>

            {items.map((item, index) => (
              <div key={`${item.label}-${index}`} className={styles.splitFields}>
                <Field label={`Servicio ${index + 1}`}>
                  <input
                    value={item.label}
                    onChange={(event) => updateItem(index, "label", event.target.value)}
                  />
                </Field>
                <Field label="Monto">
                  <input
                    type="number"
                    step="0.01"
                    value={item.amount}
                    onChange={(event) => updateItem(index, "amount", event.target.value)}
                  />
                </Field>
              </div>
            ))}

            <button
              className={styles.ghostButton}
              type="button"
              onClick={() => setItems((current) => [...current, { label: "Servicio", amount: 0 }])}
            >
              Agregar servicio
            </button>

            <article className={styles.totalCard}>
              <strong>Total a cobrar</strong>
              <span>${total.toFixed(2)}</span>
            </article>

            <button className={styles.primaryButton} disabled={submitting} type="submit">
              Emitir factura
            </button>
          </form>
        </Panel>

        <Panel title="Registrar pago" subtitle="Cobro directo con soporte para pagos parciales.">
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
            }}
          >
            <Field label="Factura">
              <select name="invoiceId" required defaultValue="">
                <option value="" disabled>
                  Selecciona factura
                </option>
                {data.invoices.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.numero}  -  {item.appointment.patient.nombre}
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
            <button className={styles.secondaryButton} disabled={submitting} type="submit">
              Aplicar pago
            </button>
          </form>
        </Panel>
      </div>
    </div>
  );
}

function CashierReceiptsWorkspace({
  data,
  actions,
}: {
  data: DataBundle;
  actions: DashboardActions;
}) {
  return (
    <Panel title="Gestor de comprobantes" subtitle="Revision final antes de imprimir o generar PDF.">
      {data.invoices.length ? (
        <div className={styles.list}>
          {data.invoices.map((item) => (
            <div key={item.id} className={styles.invoiceRow}>
              <Row
                title={`${item.numero}  -  ${item.appointment.patient.nombre}`}
                subtitle={`${item.estado}  -  ${item.concepto ?? "Sin concepto"}`}
                meta={`$${Number(item.cantidadPago).toFixed(2)}`}
              />
              <button
                className={styles.secondaryButton}
                type="button"
                onClick={() => void actions.printInvoice(item.id)}
              >
                Generar PDF / Imprimir
              </button>
              <button
                className={styles.ghostButton}
                type="button"
                onClick={async () => {
                  const token = getStoredToken();
                  if (!token) return;
                  const preview = await apiRequest<{ html: string }>(
                    `/billing/invoices/${item.id}/preview`,
                    { token },
                  );
                  const popup = window.open("", "_blank");
                  if (popup) {
                    popup.document.write(preview.html);
                    popup.document.close();
                  }
                }}
              >
                Ver HTML
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="Sin comprobantes" text="Las facturas emitidas apareceran aqui." />
      )}
    </Panel>
  );
}
