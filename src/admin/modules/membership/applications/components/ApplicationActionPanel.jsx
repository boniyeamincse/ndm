export default function ApplicationActionPanel({ entity, onAction }) {
  return (
    <div className="ndm-action-panel" data-testid="application-action-panel">
      <h4>Workflow Actions</h4>
      <div className="ndm-action-panel__grid">
        <button type="button" className="ndm-btn ndm-btn--primary" onClick={() => onAction('review', entity)}>
          Review
        </button>
        <button type="button" className="ndm-btn ndm-btn--success" onClick={() => onAction('approve', entity)}>
          Approve
        </button>
        <button type="button" className="ndm-btn ndm-btn--danger" onClick={() => onAction('reject', entity)}>
          Reject
        </button>
        <button type="button" className="ndm-btn ndm-btn--warning" onClick={() => onAction('hold', entity)}>
          Hold
        </button>
      </div>
    </div>
  );
}
