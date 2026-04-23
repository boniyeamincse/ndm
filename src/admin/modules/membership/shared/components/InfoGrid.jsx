function formatInfoValue(value) {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (Array.isArray(value)) {
    const parts = value
      .map((entry) => {
        if (entry === null || entry === undefined) return null;
        if (typeof entry === 'string' || typeof entry === 'number') return String(entry);
        if (typeof entry === 'object') {
          return entry.name || entry.full_name || entry.title || entry.label || entry.email || null;
        }
        return null;
      })
      .filter(Boolean);

    return parts.length ? parts.join(', ') : '—';
  }

  if (typeof value === 'object') {
    return value.name || value.full_name || value.title || value.label || value.email || '—';
  }

  return '—';
}

export default function InfoGrid({ items }) {
  return (
    <dl className="ndm-info-grid">
      {items.map((item) => (
        <div key={item.label} className="ndm-info-grid__item">
          <dt>{item.label}</dt>
          <dd>{formatInfoValue(item.value)}</dd>
        </div>
      ))}
    </dl>
  );
}
