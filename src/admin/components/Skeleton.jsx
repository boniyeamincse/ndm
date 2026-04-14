export function SkeletonCard({ height = 120 }) {
  return <div className="adm-skeleton" style={{ height }} />;
}

export function SkeletonText({ width = '100%', height = 16 }) {
  return <div className="adm-skeleton adm-skeleton--inline" style={{ width, height }} />;
}

export function SkeletonStatCards() {
  return (
    <div className="adm-stats-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="adm-stat-card">
          <div className="adm-stat-card__icon">
            <SkeletonCard height={40} />
          </div>
          <div className="adm-stat-card__body">
            <SkeletonText width="60%" height={28} />
            <SkeletonText width="80%" height={14} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonList({ count, rows = 5 }) {
  const n = count ?? rows;
  return (
    <div className="adm-skeleton-list">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="adm-skeleton-list__item">
          <div className="adm-skeleton adm-skeleton-list__dot" />
          <div className="adm-skeleton adm-skeleton-list__line" />
        </div>
      ))}
    </div>
  );
}
