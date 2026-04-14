export default function SectionCard({ title, subtitle, children }) {
  return (
    <section className="ndm-section-card">
      {(title || subtitle) ? (
        <header className="ndm-section-card__header">
          {title ? <h3>{title}</h3> : null}
          {subtitle ? <p>{subtitle}</p> : null}
        </header>
      ) : null}
      <div className="ndm-section-card__body">{children}</div>
    </section>
  );
}
