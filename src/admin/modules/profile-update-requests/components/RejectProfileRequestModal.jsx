import { useState } from 'react';

export default function RejectProfileRequestModal({ open, busy, request, onClose, onSubmit }) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [reviewNote, setReviewNote] = useState('');
  if (!open || !request) return null;

  return (
    <div className="ndm-modal__overlay" onClick={onClose}>
      <div className="ndm-modal" onClick={(event) => event.stopPropagation()}>
        <h3>Reject Request</h3>
        <p>Please provide a rejection reason. This is required before the request can be rejected.</p>
        <label>
          Rejection reason
          <textarea className="ndm-input" rows={3} required value={rejectionReason} onChange={(event) => setRejectionReason(event.target.value)} />
        </label>
        <label>
          Review note
          <textarea className="ndm-input" rows={3} value={reviewNote} onChange={(event) => setReviewNote(event.target.value)} />
        </label>
        <div className="ndm-modal__actions">
          <button type="button" className="ndm-btn ndm-btn--ghost" onClick={onClose}>Cancel</button>
          <button type="button" className="ndm-btn ndm-btn--danger" disabled={busy || !rejectionReason.trim()} onClick={() => onSubmit({ rejection_reason: rejectionReason, review_note: reviewNote })}>{busy ? 'Rejecting...' : 'Reject Request'}</button>
        </div>
      </div>
    </div>
  );
}
