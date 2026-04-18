import { useEffect, useState } from 'react';
import { committeeTypesService } from '../../committee-types/services/committeeTypesService';

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
  source_committee_name: '',
  source_committee_type_name: '',
};

export default function PositionForm({ initialValues, busy, onCancel, onSubmit }) {
  const [form, setForm] = useState(EMPTY);
  const [committeeTypeOptions, setCommitteeTypeOptions] = useState([]);

  useEffect(() => {
    const next = { ...EMPTY, ...(initialValues || {}) };
    setForm(next);
  }, [initialValues]);

  useEffect(() => {
    let active = true;

    async function loadCommitteeTypes() {
      try {
        const result = await committeeTypesService.list({ is_active: true, per_page: 100, sort_by: 'hierarchy_order', sort_dir: 'asc' });
        if (active) {
          setCommitteeTypeOptions(result.items);
        }
      } catch {
        if (active) {
          setCommitteeTypeOptions([]);
        }
      }
    }

    loadCommitteeTypes();

    return () => {
      active = false;
    };
  }, []);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function toggleCommitteeType(typeId) {
    setForm((current) => {
      const nextIds = current.committee_type_ids.map(String);
      const lookupId = String(typeId);

      return {
        ...current,
        committee_type_ids: nextIds.includes(lookupId)
          ? nextIds.filter((item) => item !== lookupId)
          : [...nextIds, lookupId],
      };
    });
  }

  return (
    <form className="org-form" onSubmit={(event) => {
      event.preventDefault();
      onSubmit({ ...form, committee_type_ids: form.committee_type_ids.map(String).filter(Boolean) });
    }}>
      <section className="org-form__section">
        <div className="ndm-form-grid">
          <label className="org-form__field"><span>Name</span><input className="ndm-input" value={form.name} onChange={(event) => updateField('name', event.target.value)} required /></label>
          <label className="org-form__field"><span>Code</span><input className="ndm-input" value={form.code} onChange={(event) => updateField('code', event.target.value)} /></label>
          <label className="org-form__field"><span>Short Name</span><input className="ndm-input" value={form.short_name} onChange={(event) => updateField('short_name', event.target.value)} /></label>
          <label className="org-form__field"><span>Hierarchy Rank</span><input type="number" className="ndm-input" value={form.hierarchy_rank} onChange={(event) => updateField('hierarchy_rank', event.target.value)} /></label>
          <label className="org-form__field"><span>Display Order</span><input type="number" className="ndm-input" value={form.display_order} onChange={(event) => updateField('display_order', event.target.value)} /></label>
          <label className="org-form__field"><span>Category</span><select className="ndm-input" value={form.category} onChange={(event) => updateField('category', event.target.value)}><option value="">Select</option><option value="leadership">Leadership</option><option value="executive">Executive</option><option value="general">General</option></select></label>
          <label className="org-form__field"><span>Scope</span><select className="ndm-input" value={form.scope} onChange={(event) => updateField('scope', event.target.value)}><option value="">Select</option><option value="global">Global</option><option value="committee_specific">Committee Specific</option></select></label>
          <label className="org-form__field org-form__field--wide"><span>Description</span><textarea className="ndm-input" rows={4} value={form.description} onChange={(event) => updateField('description', event.target.value)} /></label>
        </div>
      </section>

      <section className="org-form__section">
        <div className="org-form__field">
          <span>Committee Type Mapping</span>
          {form.source_committee_name ? <span className="org-lookup-field__description">Creating this position for {form.source_committee_name}{form.source_committee_type_name ? ` (${form.source_committee_type_name})` : ''}.</span> : null}
          <div className="org-selection-grid">
            {committeeTypeOptions.map((type) => {
              const checked = form.committee_type_ids.map(String).includes(String(type.id));
              return (
                <label key={type.id} className={`org-selection-chip${checked ? ' org-selection-chip--active' : ''}`}>
                  <input type="checkbox" checked={checked} onChange={() => toggleCommitteeType(type.id)} />
                  <span>{type.name}</span>
                </label>
              );
            })}
          </div>
          {!committeeTypeOptions.length ? <span className="ndm-help">Committee type options are loading or unavailable. You can still save without mapping, but committee-specific usage will be limited.</span> : null}
        </div>
      </section>

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
