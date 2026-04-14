import { useEffect, useState } from 'react';

const EMPTY = {
  member_id: '',
  committee_id: '',
  position_id: '',
  assignment_type: '',
  is_primary: false,
  is_leadership: false,
  appointed_by: '',
  approved_by: '',
  assigned_at: '',
  approved_at: '',
  start_date: '',
  end_date: '',
  status: 'active',
  is_active: true,
  note: '',
};

export default function CommitteeAssignmentForm({ initialValues, busy, onCancel, onSubmit }) {
  const [form, setForm] = useState(EMPTY);
  useEffect(() => {
    setForm({ ...EMPTY, ...(initialValues || {}) });
  }, [initialValues]);
  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }
  return (
    <form className="org-form" onSubmit={(event) => { event.preventDefault(); onSubmit(form); }}>
      <div className="ndm-form-grid">
        <label>Member ID<input className="ndm-input" value={form.member_id} onChange={(event) => updateField('member_id', event.target.value)} /></label>
        <label>Committee ID<input className="ndm-input" value={form.committee_id} onChange={(event) => updateField('committee_id', event.target.value)} /></label>
        <label>Position ID<input className="ndm-input" value={form.position_id} onChange={(event) => updateField('position_id', event.target.value)} /></label>
        <label>Assignment Type<select className="ndm-input" value={form.assignment_type} onChange={(event) => updateField('assignment_type', event.target.value)}><option value="">Select</option><option value="office_bearer">Office Bearer</option><option value="general_member">General Member</option><option value="observer">Observer</option></select></label>
        <label>Appointed By<input className="ndm-input" value={form.appointed_by} onChange={(event) => updateField('appointed_by', event.target.value)} /></label>
        <label>Approved By<input className="ndm-input" value={form.approved_by} onChange={(event) => updateField('approved_by', event.target.value)} /></label>
        <label>Assigned At<input type="date" className="ndm-input" value={form.assigned_at} onChange={(event) => updateField('assigned_at', event.target.value)} /></label>
        <label>Approved At<input type="date" className="ndm-input" value={form.approved_at} onChange={(event) => updateField('approved_at', event.target.value)} /></label>
        <label>Start Date<input type="date" className="ndm-input" value={form.start_date} onChange={(event) => updateField('start_date', event.target.value)} /></label>
        <label>End Date<input type="date" className="ndm-input" value={form.end_date} onChange={(event) => updateField('end_date', event.target.value)} /></label>
        <label>Status<select className="ndm-input" value={form.status} onChange={(event) => updateField('status', event.target.value)}><option value="active">Active</option><option value="inactive">Inactive</option><option value="completed">Completed</option></select></label>
        <label className="org-form__field org-form__field--wide">Note<textarea className="ndm-input" rows={4} value={form.note} onChange={(event) => updateField('note', event.target.value)} /></label>
      </div>
      <div className="org-form__toggles">
        <label className="ndm-checkbox-row"><input type="checkbox" checked={Boolean(form.is_primary)} onChange={(event) => updateField('is_primary', event.target.checked)} /> Primary Assignment</label>
        <label className="ndm-checkbox-row"><input type="checkbox" checked={Boolean(form.is_leadership)} onChange={(event) => updateField('is_leadership', event.target.checked)} /> Leadership Assignment</label>
        <label className="ndm-checkbox-row"><input type="checkbox" checked={Boolean(form.is_active)} onChange={(event) => updateField('is_active', event.target.checked)} /> Active</label>
      </div>
      <div className="ndm-modal__actions org-form__actions">
        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={onCancel} disabled={busy}>Cancel</button>
        <button type="submit" className="ndm-btn ndm-btn--primary" disabled={busy || !form.member_id || !form.committee_id || !form.position_id}>{busy ? 'Saving...' : 'Save Assignment'}</button>
      </div>
    </form>
  );
}
