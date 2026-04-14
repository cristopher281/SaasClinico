import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  const layers = [
    "Cliente web en Next.js",
    "Frontend modular por rol",
    "Backend NestJS por dominios",
    "Base de datos PostgreSQL multi-tenant",
  ];

  return (
    <main className={styles.shell}>
      <section className={styles.hero}>
        <div className={styles.copy}>
          <span className={styles.kicker}>SaaS Clinico</span>
          <h1>Arquitectura clinica por capas, no solo una pantalla bonita.</h1>
          <p>
            El sistema ahora esta organizado para seguir el diagrama objetivo:
            cliente, frontend modular, backend de dominios y base de datos
            compartida para operacion clinica multi-especialidad.
          </p>
          <div className={styles.layerList}>
            {layers.map((layer) => (
              <span key={layer} className={styles.layerPill}>
                {layer}
              </span>
            ))}
          </div>
          <div className={styles.actions}>
            <Link href="/login" className={styles.primary}>
              Entrar al panel
            </Link>
            <Link href="/registro-clinica" className={styles.secondary}>
              Registrar clinica
            </Link>
            <a
              className={styles.secondary}
              href="http://localhost:3000/api/health"
              target="_blank"
              rel="noreferrer"
            >
              Ver API viva
            </a>
          </div>
        </div>
        <div className={styles.card}>
          <h2>Modulos operativos</h2>
          <ul>
            <li>Recepcion: pacientes, citas e historial</li>
            <li>Doctor: consulta, receta y laboratorio</li>
            <li>Caja: facturacion, pagos y ticket</li>
            <li>Resumen: supervision global de la clinica</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
