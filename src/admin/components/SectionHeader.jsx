export default function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="adm-section-header">
      <div>
        <h3 className="adm-section-title">{title}</h3>
        {subtitle && <p className="adm-section-sub">{subtitle}</p>}
      </div>
      {action && <div className="adm-section-action">{action}</div>}
    </div>
  );
}
