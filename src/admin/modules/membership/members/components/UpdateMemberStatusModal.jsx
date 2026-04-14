import { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const STATUS_LABELS = {
  active: { label: 'Active', btnClass: 'ndm-btn--success', warn: false },
  inactive: { label: 'Inactive', btnClass: 'ndm-btn--warning', warn: false },
  suspended: { label: 'Suspended', btnClass: 'ndm-btn--danger', warn: true },
  resigned: { label: 'Resigned', btnClass: 'ndm-btn--ghost', warn: false },
  removed: { label: 'Removed', btnClass: 'ndm-btn--danger', warn: true },
};

const WARN_TEXT = {
  suspended: 'Suspending a member will restrict their access to the platform. This can be reversed later.',
  removed: 'Removing a member is a serious action. The member record will be marked as removed and account access disabled.',
};

export default function UpdateMemberStatusModal({ member, targetStatus, busy, onClose, onSubmit }) {
  const [note, setNote] = useState('');
  const [revokeAccess, setRevokeAccess] = useState(false);

  useEffect(() => {
    setNote('');
    setRevokeAccess(false);
  }, [member?.id, targetStatus]);

  if (!member || !targetStatus) return null;

  const cfg = STATUS_LABELS[targetStatus] || { label: targetStatus, btnClass: 'ndm-btn--primary', warn: false };

  return (
    <div className="ndm-modal__overlay" role="dialog" aria-modal="true" aria-labelledby="status-modal-title" onClick={onClose}>
      <div className="ndm-modal" onClick={(e) => e.stopPropagation()} data-testid="member-status-modal">
        <div className="mem-modal-header">
          <div>
            <h3 id="status-modal-title">Update Member Status</h3>
            <p className="mem-modal-header__sub">{member.full_name} · {member.member_no}</p>
          </div>
          <button type="button" className="mem-modal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <p className="mem-modal-confirm-text">
          Change status to: <strong className={`mem-status-label mem-status-label--${targetStatus}`}>{cfg.label}</strong>
        </p>

        {cfg.warn && WARN_TEXT[targetStatus] ? (
          <div className="mem-warn-callout" role="alert">
            <AlertTriangle size={16} />
            <span>{WARN_TEXT[targetStatus]}</span>
          </div>
        ) : null}

        <div className="mem-modal-field">
          <label htmlFor="status-note" className="mem-modal-label">Note (optional)</label>
          <textarea
            id="status-note"
            className="ndm-input"
            rows={3}
            placeholder="Reason or context for this status change..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {member.user_id ? (
          <label className="ndm-checkbox-row">
            <input type="checkbox" checked={revokeAccess} onChange={(e) => setRevokeAccess(e.target.checked)} />
            Revoke linked user account access
          </label>
        ) : null}

        <div className="ndm-modal__actions">
          <button type="button" className="ndm-btn ndm-btn--ghost" onClick={onClose} disabled={busy}>Cancel</button>
          <button
            type="button"
            className={`ndm-btn ${cfg.btnClass}`}
            onClick={() => onSubmit({ status: targetStatus, note, revoke_access: revokeAccess })}
            disabled={busy}
          >
            {busy ? 'Updating...' : `Set ${cfg.label}`}
          </button>
        </div>
      </div>
    </div>
  );
}
