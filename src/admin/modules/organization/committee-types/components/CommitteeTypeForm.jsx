import { useEffect, useState } from 'react';

const EMPTY = {
  name: '',
  slug: '',
  code: '',
  hierarchy_order: '',
  description: '',
  is_active: true,
};

export default function CommitteeTypeForm({ initialValues, busy, onCancel, onSubmit }) {
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
        <label>Name<input className="ndm-input" value={form.name} onChange={(event) => updateField('name', event.target.value)} required /></label>
        <label>Slug<input className="ndm-input" value={form.slug} onChange={(event) => updateField('slug', event.target.value)} /></label>
        <label>Code<input className="ndm-input" value={form.code} onChange={(event) => updateField('code', event.target.value)} /></label>
        <label>Hierarchy Order<input type="number" className="ndm-input" value={form.hierarchy_order} onChange={(event) => updateField('hierarchy_order', event.target.value)} /></label>
        <label className="org-form__field org-form__field--wide">Description<textarea className="ndm-input" rows={4} value={form.description} onChange={(event) => updateField('description', event.target.value)} /></label>
      </div>
      <label className="ndm-checkbox-row"><input type="checkbox" checked={Boolean(form.is_active)} onChange={(event) => updateField('is_active', event.target.checked)} /> Active type</label>
      <div className="ndm-modal__actions org-form__actions">
        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={onCancel} disabled={busy}>Cancel</button>
        <button type="submit" className="ndm-btn ndm-btn--primary" disabled={busy || !form.name.trim()}>{busy ? 'Saving...' : 'Save Type'}</button>
      </div>
    </form>
  );
}
