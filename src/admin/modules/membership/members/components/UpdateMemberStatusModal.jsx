import { useEffect, useState } from 'react';

export default function UpdateMemberStatusModal({ member, targetStatus, busy, onClose, onSubmit }) {
  const [note, setNote] = useState('');
  const [revokeAccess, setRevokeAccess] = useState(false);

  useEffect(() => {
    setNote('');
    setRevokeAccess(false);
  }, [member?.id, targetStatus]);

  if (!member || !targetStatus) return null;

  return (
    <div className="ndm-modal__overlay" onClick={onClose}>
      <div className="ndm-modal" onClick={(event) => event.stopPropagation()} data-testid="member-status-modal">
        <h3>Update Member Status</h3>
        <p>{member.full_name} ({member.member_no})</p>
        <p>
          Change status to: <strong>{targetStatus}</strong>
        </p>

        <label>Status Note</label>
        <textarea
          className="ndm-input"
          rows={3}
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />

        <label className="ndm-checkbox-row">
          <input
            type="checkbox"
            checked={revokeAccess}
            onChange={(event) => setRevokeAccess(event.target.checked)}
          />
          Revoke linked user access
        </label>

        <div className="ndm-modal__actions">
          <button type="button" className="ndm-btn ndm-btn--ghost" onClick={onClose} disabled={busy}>Cancel</button>
          <button
            type="button"
            className="ndm-btn ndm-btn--primary"
            onClick={() => onSubmit({ status: targetStatus, note, revoke_access: revokeAccess })}
            disabled={busy}
          >
            {busy ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </div>
    </div>
  );
}
