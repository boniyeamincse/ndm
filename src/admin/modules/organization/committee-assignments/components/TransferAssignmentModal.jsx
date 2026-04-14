import { useEffect, useState } from 'react';

const EMPTY = {
  target_committee_id: '',
  target_position_id: '',
  transfer_mode: 'replace',
  effective_date: '',
  note: '',
  keep_old_assignment_active: false,
  is_primary: false,
};

export default function TransferAssignmentModal({ assignment, busy, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => { setForm(EMPTY); }, [assignment]);
  if (!assignment) return null;

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  return (
    <div className="ndm-modal__overlay" onClick={onClose}>
      <div className="ndm-modal" onClick={(event) => event.stopPropagation()}>
        <h3>Transfer Assignment</h3>
        <p>{assignment.assignment_no}</p>
        <div className="ndm-form-grid">
          <label>Target Committee ID<input className="ndm-input" value={form.target_committee_id} onChange={(event) => updateField('target_committee_id', event.target.value)} /></label>
          <label>Target Position ID<input className="ndm-input" value={form.target_position_id} onChange={(event) => updateField('target_position_id', event.target.value)} /></label>
          <label>Transfer Mode<select className="ndm-input" value={form.transfer_mode} onChange={(event) => updateField('transfer_mode', event.target.value)}><option value="replace">Replace</option><option value="parallel">Parallel</option><option value="temporary">Temporary</option></select></label>
          <label>Effective Date<input type="date" className="ndm-input" value={form.effective_date} onChange={(event) => updateField('effective_date', event.target.value)} /></label>
          <label className="org-form__field org-form__field--wide">Note<textarea className="ndm-input" rows={4} value={form.note} onChange={(event) => updateField('note', event.target.value)} /></label>
        </div>
        <div className="org-form__toggles">
          <label className="ndm-checkbox-row"><input type="checkbox" checked={Boolean(form.keep_old_assignment_active)} onChange={(event) => updateField('keep_old_assignment_active', event.target.checked)} /> Keep old assignment active</label>
          <label className="ndm-checkbox-row"><input type="checkbox" checked={Boolean(form.is_primary)} onChange={(event) => updateField('is_primary', event.target.checked)} /> Set new assignment as primary</label>
        </div>
        <div className="ndm-modal__actions">
          <button type="button" className="ndm-btn ndm-btn--ghost" onClick={onClose} disabled={busy}>Cancel</button>
          <button type="button" className="ndm-btn ndm-btn--primary" onClick={() => onSubmit(form)} disabled={busy || !form.target_committee_id || !form.target_position_id}>{busy ? 'Transferring...' : 'Confirm Transfer'}</button>
        </div>
      </div>
    </div>
  );
}
