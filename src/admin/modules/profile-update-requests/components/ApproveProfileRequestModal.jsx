import { useState } from 'react';

export default function ApproveProfileRequestModal({ open, busy, request, onClose, onSubmit }) {
  const [reviewNote, setReviewNote] = useState('');
  if (!open || !request) return null;

  return (
    <div className="ndm-modal__overlay" onClick={onClose}>
      <div className="ndm-modal" onClick={(event) => event.stopPropagation()}>
        <h3>Approve Request</h3>
        <p>Approving this request will apply the approved changes to the member or user profile data.</p>
        <label>
          Review note
          <textarea className="ndm-input" rows={4} value={reviewNote} onChange={(event) => setReviewNote(event.target.value)} />
        </label>
        <div className="ndm-modal__actions">
          <button type="button" className="ndm-btn ndm-btn--ghost" onClick={onClose}>Cancel</button>
          <button type="button" className="ndm-btn ndm-btn--primary" disabled={busy} onClick={() => onSubmit({ review_note: reviewNote })}>{busy ? 'Approving...' : 'Approve Request'}</button>
        </div>
      </div>
    </div>
  );
}
