export default function InfoGrid({ items }) {
  return (
    <dl className="ndm-info-grid">
      {items.map((item) => (
        <div key={item.label} className="ndm-info-grid__item">
          <dt>{item.label}</dt>
          <dd>{item.value || '—'}</dd>
        </div>
      ))}
    </dl>
  );
}
