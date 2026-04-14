import { useEffect, useState } from 'react';

export default function CommitteeStatusModal({ committee, busy, onClose, onSubmit }) {
  const [status, setStatus] = useState('inactive');
  const [note, setNote] = useState('');

  useEffect(() => {
    setStatus(committee?.status || 'inactive');
    setNote('');
  }, [committee]);

  if (!committee) return null;

  return (
    <div className="ndm-modal__overlay" onClick={onClose}>
      <div className="ndm-modal" onClick={(event) => event.stopPropagation()}>
        <h3>Change Committee Status</h3>
        <p>{committee.name}</p>
        <label>
          Status
          <select className="ndm-input" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="dissolved">Dissolved</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <label>
          Note
          <textarea className="ndm-input" rows={4} value={note} onChange={(event) => setNote(event.target.value)} />
        </label>
        <div className="ndm-modal__actions">
          <button type="button" className="ndm-btn ndm-btn--ghost" onClick={onClose} disabled={busy}>Cancel</button>
          <button type="button" className="ndm-btn ndm-btn--primary" onClick={() => onSubmit({ status, note })} disabled={busy}>
            {busy ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </div>
    </div>
  );
}
