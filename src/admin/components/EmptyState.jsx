export default function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="adm-empty">
      {Icon && <div className="adm-empty__icon"><Icon size={28} strokeWidth={1.5} /></div>}
      <p className="adm-empty__title">{title}</p>
      {subtitle && <p className="adm-empty__sub">{subtitle}</p>}
    </div>
  );
}
