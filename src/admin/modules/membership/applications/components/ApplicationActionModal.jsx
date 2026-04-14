import { useEffect, useState } from 'react';

const CONTENT = {
  review: { title: 'Mark Under Review', field: 'remarks', label: 'Remarks (optional)', required: false, tone: 'primary' },
  approve: { title: 'Approve Application', field: 'remarks', label: 'Approval note (optional)', required: false, tone: 'success' },
  reject: { title: 'Reject Application', field: 'rejection_reason', label: 'Rejection reason', required: true, tone: 'danger' },
  hold: { title: 'Put On Hold', field: 'remarks', label: 'Hold reason', required: true, tone: 'warning' },
};

export default function ApplicationActionModal({ action, entity, busy, onClose, onSubmit }) {
  const config = CONTENT[action];
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue('');
  }, [action, entity?.id]);

  if (!action || !config) return null;

  return (
    <div className="ndm-modal__overlay" onClick={onClose}>
      <div className="ndm-modal" onClick={(event) => event.stopPropagation()} data-testid="application-action-modal">
        <h3>{config.title}</h3>
        <p>
          <strong>{entity?.application_no}</strong> · {entity?.full_name}
        </p>
        <label>{config.label}</label>
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="ndm-input"
          rows={4}
          required={config.required}
          data-testid="application-action-input"
        />
        <div className="ndm-modal__actions">
          <button type="button" className="ndm-btn ndm-btn--ghost" onClick={onClose} disabled={busy}>Cancel</button>
          <button
            type="button"
            className={`ndm-btn ndm-btn--${config.tone}`}
            onClick={() => onSubmit(action, { [config.field]: value })}
            disabled={busy || (config.required && !value.trim())}
          >
            {busy ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
