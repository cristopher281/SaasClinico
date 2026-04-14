"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { resolveDefaultAppRoute } from "@/modules/operations/model/module-routes";
import { apiRequest } from "@/shared/api/http";
import { setStoredToken } from "@/shared/auth/token-storage";
import { AuthResponse } from "@/shared/types/clinical";
import styles from "./auth-panel.module.css";

export function AuthPanel() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await apiRequest<AuthResponse>("/auth/login", {
        method: "POST",
        body: {
          email: formData.get("email"),
          password: formData.get("password"),
        },
      });

      setStoredToken(response.access_token);
      router.push(resolveDefaultAppRoute(response.role));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo iniciar sesion.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.brand}>
          <div className={styles.brandHeader}>
            <span className={styles.eyebrow}>Acceso universal</span>
            <span className={styles.status}>El backend decide el modulo segun el rol</span>
          </div>
          <h1>Un solo login para todo el personal.</h1>
          <p>
            El sistema no pregunta el rol. Email y contrasena bastan para que el
            backend devuelva el JWT con `clinicId` y `role`, y el frontend redirija
            automaticamente al modulo correcto.
          </p>

          <div className={styles.featureList}>
            <div className={styles.featureCard}>
              <strong>Administrador</strong>
              <span>Clinica, staff y reportes globales</span>
            </div>
            <div className={styles.featureCard}>
              <strong>Recepcion</strong>
              <span>Agenda global y pacientes sin friccion</span>
            </div>
            <div className={styles.featureCard}>
              <strong>Doctor y Caja</strong>
              <span>Atencion clinica y cobro desde el mismo ecosistema</span>
            </div>
          </div>
        </div>

        <div className={styles.formWrap}>
          <div className={styles.formHeader}>
            <h2>Iniciar sesion</h2>
            <p>El acceso es unico. La interfaz se adapta despues de autenticarte.</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label>
              Correo
              <input type="email" name="email" placeholder="correo@clinica.com" required />
            </label>
            <label>
              Contrasena
              <input type="password" name="password" placeholder="Tu contrasena" required />
            </label>

            {message ? <div className={styles.error}>{message}</div> : null}

            <button className={styles.submit} disabled={submitting} type="submit">
              {submitting ? "Validando acceso..." : "Entrar al sistema"}
            </button>
          </form>

          <Link className={styles.toggle} href="/registro-clinica">
            Registrar una clinica nueva
          </Link>
        </div>
      </section>
    </main>
  );
}
