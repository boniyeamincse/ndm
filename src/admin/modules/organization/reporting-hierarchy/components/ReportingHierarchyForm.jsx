import { useEffect, useState } from 'react';

const EMPTY = {
  subordinate_assignment_id: '',
  superior_assignment_id: '',
  committee_id: '',
  relation_type: 'direct',
  is_primary: true,
  is_active: true,
  start_date: '',
  end_date: '',
  note: '',
};

export default function ReportingHierarchyForm({ initialValues, busy, onCancel, onSubmit }) {
  const [form, setForm] = useState(EMPTY);
  useEffect(() => { setForm({ ...EMPTY, ...(initialValues || {}) }); }, [initialValues]);
  function updateField(name, value) { setForm((current) => ({ ...current, [name]: value })); }
  return (
    <form className="org-form" onSubmit={(event) => { event.preventDefault(); onSubmit(form); }}>
      <div className="ndm-form-grid">
        <label>Subordinate Assignment ID<input className="ndm-input" value={form.subordinate_assignment_id} onChange={(event) => updateField('subordinate_assignment_id', event.target.value)} /></label>
        <label>Superior Assignment ID<input className="ndm-input" value={form.superior_assignment_id} onChange={(event) => updateField('superior_assignment_id', event.target.value)} /></label>
        <label>Committee ID<input className="ndm-input" value={form.committee_id} onChange={(event) => updateField('committee_id', event.target.value)} /></label>
        <label>Relation Type<select className="ndm-input" value={form.relation_type} onChange={(event) => updateField('relation_type', event.target.value)}><option value="direct">Direct</option><option value="functional">Functional</option><option value="advisory">Advisory</option></select></label>
        <label>Start Date<input type="date" className="ndm-input" value={form.start_date} onChange={(event) => updateField('start_date', event.target.value)} /></label>
        <label>End Date<input type="date" className="ndm-input" value={form.end_date} onChange={(event) => updateField('end_date', event.target.value)} /></label>
        <label className="org-form__field org-form__field--wide">Note<textarea className="ndm-input" rows={4} value={form.note} onChange={(event) => updateField('note', event.target.value)} /></label>
      </div>
      <div className="org-form__toggles">
        <label className="ndm-checkbox-row"><input type="checkbox" checked={Boolean(form.is_primary)} onChange={(event) => updateField('is_primary', event.target.checked)} /> Primary Relation</label>
        <label className="ndm-checkbox-row"><input type="checkbox" checked={Boolean(form.is_active)} onChange={(event) => updateField('is_active', event.target.checked)} /> Active</label>
      </div>
      <div className="ndm-modal__actions org-form__actions">
        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={onCancel} disabled={busy}>Cancel</button>
        <button type="submit" className="ndm-btn ndm-btn--primary" disabled={busy || !form.subordinate_assignment_id || !form.superior_assignment_id}>{busy ? 'Saving...' : 'Save Relation'}</button>
      </div>
    </form>
  );
}
