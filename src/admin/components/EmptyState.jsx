export default function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="adm-empty">
      {icon && <div className="adm-empty__icon">{icon}</div>}
      <p className="adm-empty__title">{title}</p>
      {subtitle && <p className="adm-empty__sub">{subtitle}</p>}
    </div>
  );
}
