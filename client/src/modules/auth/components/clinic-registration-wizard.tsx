"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { resolveDefaultAppRoute } from "@/modules/operations/model/module-routes";
import { apiRequest } from "@/shared/api/http";
import { setStoredToken } from "@/shared/auth/token-storage";
import { AuthResponse } from "@/shared/types/clinical";
import styles from "@/modules/auth/components/auth-panel.module.css";

type WizardStep = 1 | 2 | 3;

type FormState = {
  clinicName: string;
  taxId: string;
  logoName: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
  confirmPassword: string;
};

const initialState: FormState = {
  clinicName: "",
  taxId: "",
  logoName: "",
  adminName: "",
  adminEmail: "",
  adminPassword: "",
  confirmPassword: "",
};

export function ClinicRegistrationWizard() {
  const router = useRouter();
  const [step, setStep] = useState<WizardStep>(1);
  const [form, setForm] = useState<FormState>(initialState);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isPasswordValid = useMemo(
    () => form.adminPassword.length >= 8 && form.adminPassword === form.confirmPassword,
    [form.adminPassword, form.confirmPassword],
  );

  function updateField(key: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    updateField("logoName", file?.name ?? "");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isPasswordValid) {
      setMessage("La contrasena debe coincidir y tener al menos 8 caracteres.");
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const response = await apiRequest<AuthResponse>("/auth/register-clinic", {
        method: "POST",
        body: {
          clinicName: form.clinicName,
          taxId: form.taxId,
          logoUrl: form.logoName,
          adminName: form.adminName,
          adminEmail: form.adminEmail,
          adminPassword: form.adminPassword,
        },
      });

      setStoredToken(response.access_token);
      router.push(resolveDefaultAppRoute(response.role ?? "admin"));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo registrar la clinica.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.brand}>
          <div className={styles.brandHeader}>
            <span className={styles.eyebrow}>Onboarding B2B</span>
            <span className={styles.status}>Alta de tenant y admin maestro</span>
          </div>
          <h1>Registra tu clinica sin mezclarlo con el login del personal.</h1>
          <p>
            Este flujo es exclusivo para la activacion de una nueva clinica. Al finalizar,
            se crea el tenant y las credenciales del administrador maestro.
          </p>

          <div className={styles.featureList}>
            <div className={styles.featureCard}>
              <strong>Paso 1</strong>
              <span>Datos base de la clinica y branding inicial</span>
            </div>
            <div className={styles.featureCard}>
              <strong>Paso 2</strong>
              <span>Credenciales del administrador principal</span>
            </div>
            <div className={styles.featureCard}>
              <strong>Paso 3</strong>
              <span>Revision antes de activar el tenant</span>
            </div>
          </div>
        </div>

        <div className={styles.formWrap}>
          <div className={styles.formHeader}>
            <h2>Registro de clinica</h2>
            <p>Paso {step} de 3</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {step === 1 ? (
              <>
                <label>
                  Nombre de la clinica
                  <input
                    value={form.clinicName}
                    onChange={(event) => updateField("clinicName", event.target.value)}
                    placeholder="Clinica Central"
                    required
                  />
                </label>
                <label>
                  NIT / RUC
                  <input
                    value={form.taxId}
                    onChange={(event) => updateField("taxId", event.target.value)}
                    placeholder="J0310000000001"
                  />
                </label>
                <label>
                  Logo institucional
                  <input type="file" accept="image/*" onChange={handleLogoChange} />
                </label>
                {form.logoName ? <p>Archivo seleccionado: {form.logoName}</p> : null}
                <button
                  className={styles.submit}
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!form.clinicName.trim()}
                >
                  Continuar con administrador
                </button>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <label>
                  Nombre del administrador maestro
                  <input
                    value={form.adminName}
                    onChange={(event) => updateField("adminName", event.target.value)}
                    placeholder="Laura Martinez"
                    required
                  />
                </label>
                <label>
                  Correo del administrador
                  <input
                    type="email"
                    value={form.adminEmail}
                    onChange={(event) => updateField("adminEmail", event.target.value)}
                    placeholder="admin@clinica.com"
                    required
                  />
                </label>
                <label>
                  Contrasena inicial
                  <input
                    type="password"
                    value={form.adminPassword}
                    onChange={(event) => updateField("adminPassword", event.target.value)}
                    placeholder="Minimo 8 caracteres"
                    required
                  />
                </label>
                <label>
                  Confirmar contrasena
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(event) => updateField("confirmPassword", event.target.value)}
                    placeholder="Repite la contrasena"
                    required
                  />
                </label>
                <button className={styles.toggle} type="button" onClick={() => setStep(1)}>
                  Volver a datos de la clinica
                </button>
                <button
                  className={styles.submit}
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!form.adminName || !form.adminEmail || !isPasswordValid}
                >
                  Revisar alta del tenant
                </button>
              </>
            ) : null}

            {step === 3 ? (
              <>
                <div className={styles.featureCard}>
                  <strong>{form.clinicName}</strong>
                  <span>NIT/RUC: {form.taxId || "Pendiente"}</span>
                  <span>Logo: {form.logoName || "Se cargara despues en configuracion"}</span>
                </div>
                <div className={styles.featureCard}>
                  <strong>{form.adminName}</strong>
                  <span>{form.adminEmail}</span>
                  <span>Rol inicial: Administrador maestro</span>
                </div>
                <p>
                  Nota actual: el backend ya recibe NIT/RUC y una referencia de logo
                  para inicializar la clinica. La carga binaria real del archivo puede
                  completarse en la siguiente fase.
                </p>
                {message ? <div className={styles.error}>{message}</div> : null}
                <button className={styles.toggle} type="button" onClick={() => setStep(2)}>
                  Volver a credenciales
                </button>
                <button className={styles.submit} disabled={submitting} type="submit">
                  {submitting ? "Creando clinica..." : "Crear clinica y entrar"}
                </button>
              </>
            ) : null}
          </form>

          <Link className={styles.toggle} href="/login">
            Ya existe la clinica? Ir al login universal
          </Link>
        </div>
      </section>
    </main>
  );
}
