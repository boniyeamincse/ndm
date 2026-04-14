export function LoadingSkeleton({ rows = 6 }) {
  return (
    <div className="ndm-state ndm-state--loading" data-testid="loading-state">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="ndm-skeleton" />
      ))}
    </div>
  );
}

export function EmptyState({ title, subtitle }) {
  return (
    <div className="ndm-state ndm-state--empty" data-testid="empty-state">
      <h3>{title}</h3>
      <p>{subtitle}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="ndm-state ndm-state--error" data-testid="error-state">
      <h3>Something went wrong</h3>
      <p>{message}</p>
      {onRetry ? (
        <button type="button" className="ndm-btn ndm-btn--danger" onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </div>
  );
}
