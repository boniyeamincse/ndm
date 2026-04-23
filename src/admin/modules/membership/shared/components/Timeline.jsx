function formatActor(actor) {
  if (!actor) return 'System';
  if (typeof actor === 'string' || typeof actor === 'number') return String(actor);
  if (typeof actor === 'object') {
    return actor.name || actor.full_name || actor.email || 'System';
  }
  return 'System';
}

export default function Timeline({ items, statusKey = 'new_status' }) {
  return (
    <ol className="ndm-timeline">
      {items.map((item, index) => (
        <li key={item.id || `${item.created_at}-${index}`} className="ndm-timeline__item">
          <span className="ndm-timeline__dot" data-status={item[statusKey]} />
          <div>
            <p className="ndm-timeline__title">{(item[statusKey] || '').replaceAll('_', ' ') || 'Updated'}</p>
            <p className="ndm-timeline__meta">
              {item.changed_by_user?.name || formatActor(item.changed_by)}
              {' · '}
              {item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'}
            </p>
            {item.note ? <p className="ndm-timeline__note">{item.note}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
