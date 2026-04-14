export default function ContentEmptyState({ message = 'No content found.', action }) {
  return (
    <div className="ndm-state ndm-state--empty cnt-empty-state" data-testid="content-empty">
      <p>{message}</p>
      {action && (
        <button type="button" className="ndm-btn ndm-btn--primary" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}
