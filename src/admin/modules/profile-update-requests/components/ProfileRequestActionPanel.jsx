export default function ProfileRequestActionPanel({ request, onApprove, onReject, onBack }) {
  return (
    <aside className="ndm-action-panel cnt-action-panel">
      <h4>Review Actions</h4>
      <div className="ndm-action-panel__grid">
        {request.status === 'pending' ? <button type="button" className="ndm-btn ndm-btn--primary" onClick={onApprove}>Approve Request</button> : null}
        {request.status === 'pending' ? <button type="button" className="ndm-btn ndm-btn--danger" onClick={onReject}>Reject Request</button> : null}
        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={onBack}>Back to List</button>
      </div>
    </aside>
  );
}
