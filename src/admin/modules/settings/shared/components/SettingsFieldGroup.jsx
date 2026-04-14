export default function SettingsFieldGroup({ title, description, children }) {
  return (
    <section className="stg-field-group">
      <div className="stg-field-group__head">
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </div>
      <div className="stg-field-group__body">{children}</div>
    </section>
  );
}
