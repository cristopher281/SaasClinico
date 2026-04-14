import styles from "@/modules/operations/components/clinic-shell.module.css";

export function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelHead}>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

export function Metric({
  title,
  value,
  tone = "default",
}: {
  title: string;
  value: string;
  tone?: "default" | "accent" | "warning";
}) {
  return (
    <article className={tone === "accent" ? styles.metricAccent : tone === "warning" ? styles.metricWarning : styles.metric}>
      <span>{title}</span>
      <strong>{value}</strong>
    </article>
  );
}

export function Row({
  title,
  subtitle,
  meta,
  active = false,
  onClick,
}: {
  title: string;
  subtitle: string;
  meta?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const className = active ? styles.rowActive : styles.row;

  if (onClick) {
    return (
      <button className={className} onClick={onClick} type="button">
        <div>
          <strong>{title}</strong>
          <span>{subtitle}</span>
        </div>
        {meta ? <mark>{meta}</mark> : null}
      </button>
    );
  }

  return (
    <article className={className}>
      <div>
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
      {meta ? <mark>{meta}</mark> : null}
    </article>
  );
}

export function EmptyState({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <article className={styles.empty}>
      <strong>{title}</strong>
      <p>{text}</p>
    </article>
  );
}

export function Field({
  label,
  children,
  wide = false,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={wide ? styles.fieldWide : styles.field}>
      <span>{label}</span>
      {children}
    </label>
  );
}
