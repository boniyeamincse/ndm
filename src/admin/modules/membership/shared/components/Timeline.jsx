export default function Timeline({ items, statusKey = 'new_status' }) {
  return (
    <ol className="ndm-timeline">
      {items.map((item, index) => (
        <li key={item.id || `${item.created_at}-${index}`} className="ndm-timeline__item">
          <span className="ndm-timeline__dot" data-status={item[statusKey]} />
          <div>
            <p className="ndm-timeline__title">{(item[statusKey] || '').replaceAll('_', ' ') || 'Updated'}</p>
            <p className="ndm-timeline__meta">
              {item.changed_by_user?.name || item.changed_by || 'System'}
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
