import { useEffect, useState } from 'react';

const EMPTY = {
  name: '',
  code: '',
  short_name: '',
  hierarchy_rank: '',
  display_order: '',
  description: '',
  category: '',
  scope: '',
  is_leadership: false,
  is_active: true,
  committee_type_ids: [],
};

export default function PositionForm({ initialValues, busy, onCancel, onSubmit }) {
  const [form, setForm] = useState(EMPTY);
  const [committeeTypes, setCommitteeTypes] = useState('');

  useEffect(() => {
    const next = { ...EMPTY, ...(initialValues || {}) };
    setForm(next);
    setCommitteeTypes(Array.isArray(next.committee_type_ids) ? next.committee_type_ids.join(', ') : '');
  }, [initialValues]);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  return (
    <form className="org-form" onSubmit={(event) => {
      event.preventDefault();
      onSubmit({ ...form, committee_type_ids: committeeTypes.split(',').map((item) => item.trim()).filter(Boolean) });
    }}>
      <div className="ndm-form-grid">
        <label>Name<input className="ndm-input" value={form.name} onChange={(event) => updateField('name', event.target.value)} required /></label>
        <label>Code<input className="ndm-input" value={form.code} onChange={(event) => updateField('code', event.target.value)} /></label>
        <label>Short Name<input className="ndm-input" value={form.short_name} onChange={(event) => updateField('short_name', event.target.value)} /></label>
        <label>Hierarchy Rank<input type="number" className="ndm-input" value={form.hierarchy_rank} onChange={(event) => updateField('hierarchy_rank', event.target.value)} /></label>
        <label>Display Order<input type="number" className="ndm-input" value={form.display_order} onChange={(event) => updateField('display_order', event.target.value)} /></label>
        <label>Category<select className="ndm-input" value={form.category} onChange={(event) => updateField('category', event.target.value)}><option value="">Select</option><option value="leadership">Leadership</option><option value="executive">Executive</option><option value="general">General</option></select></label>
        <label>Scope<select className="ndm-input" value={form.scope} onChange={(event) => updateField('scope', event.target.value)}><option value="">Select</option><option value="global">Global</option><option value="committee_specific">Committee Specific</option></select></label>
        <label>Committee Type IDs<input className="ndm-input" value={committeeTypes} onChange={(event) => setCommitteeTypes(event.target.value)} placeholder="1,2,3" /></label>
        <label className="org-form__field org-form__field--wide">Description<textarea className="ndm-input" rows={4} value={form.description} onChange={(event) => updateField('description', event.target.value)} /></label>
      </div>
      <div className="org-form__toggles">
        <label className="ndm-checkbox-row"><input type="checkbox" checked={Boolean(form.is_leadership)} onChange={(event) => updateField('is_leadership', event.target.checked)} /> Leadership Position</label>
        <label className="ndm-checkbox-row"><input type="checkbox" checked={Boolean(form.is_active)} onChange={(event) => updateField('is_active', event.target.checked)} /> Active Position</label>
      </div>
      <div className="ndm-modal__actions org-form__actions">
        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={onCancel} disabled={busy}>Cancel</button>
        <button type="submit" className="ndm-btn ndm-btn--primary" disabled={busy || !form.name.trim()}>{busy ? 'Saving...' : 'Save Position'}</button>
      </div>
    </form>
  );
}
