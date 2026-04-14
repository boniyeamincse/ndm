import { useEffect, useState } from 'react';

const EMPTY_FORM = {
  name: '',
  committee_type_id: '',
  parent_id: '',
  code: '',
  division_name: '',
  district_name: '',
  upazila_name: '',
  union_name: '',
  address_line: '',
  office_phone: '',
  office_email: '',
  description: '',
  start_date: '',
  end_date: '',
  is_current: true,
  formed_by: '',
  approved_by: '',
  formed_at: '',
  approved_at: '',
  notes: '',
};

export default function CommitteeForm({ initialValues, busy, onCancel, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    setForm({ ...EMPTY_FORM, ...(initialValues || {}) });
  }, [initialValues]);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <form className="org-form" onSubmit={handleSubmit}>
      <section className="org-form__section">
        <h3>Basic Information</h3>
        <div className="ndm-form-grid">
          <label>
            Name
            <input className="ndm-input" value={form.name} onChange={(event) => updateField('name', event.target.value)} required />
          </label>
          <label>
            Committee Type ID
            <input className="ndm-input" value={form.committee_type_id} onChange={(event) => updateField('committee_type_id', event.target.value)} />
          </label>
          <label>
            Parent ID
            <input className="ndm-input" value={form.parent_id} onChange={(event) => updateField('parent_id', event.target.value)} />
          </label>
          <label>
            Code
            <input className="ndm-input" value={form.code} onChange={(event) => updateField('code', event.target.value)} />
          </label>
        </div>
      </section>

      <section className="org-form__section">
        <h3>Location Information</h3>
        <div className="ndm-form-grid">
          <label>
            Division
            <input className="ndm-input" value={form.division_name} onChange={(event) => updateField('division_name', event.target.value)} />
          </label>
          <label>
            District
            <input className="ndm-input" value={form.district_name} onChange={(event) => updateField('district_name', event.target.value)} />
          </label>
          <label>
            Upazila
            <input className="ndm-input" value={form.upazila_name} onChange={(event) => updateField('upazila_name', event.target.value)} />
          </label>
          <label>
            Union
            <input className="ndm-input" value={form.union_name} onChange={(event) => updateField('union_name', event.target.value)} />
          </label>
          <label className="org-form__field org-form__field--wide">
            Address
            <input className="ndm-input" value={form.address_line} onChange={(event) => updateField('address_line', event.target.value)} />
          </label>
        </div>
      </section>

      <section className="org-form__section">
        <h3>Dates & Approval</h3>
        <div className="ndm-form-grid">
          <label>
            Start Date
            <input type="date" className="ndm-input" value={form.start_date} onChange={(event) => updateField('start_date', event.target.value)} />
          </label>
          <label>
            End Date
            <input type="date" className="ndm-input" value={form.end_date} onChange={(event) => updateField('end_date', event.target.value)} />
          </label>
          <label>
            Formed By
            <input className="ndm-input" value={form.formed_by} onChange={(event) => updateField('formed_by', event.target.value)} />
          </label>
          <label>
            Approved By
            <input className="ndm-input" value={form.approved_by} onChange={(event) => updateField('approved_by', event.target.value)} />
          </label>
          <label>
            Formed At
            <input type="date" className="ndm-input" value={form.formed_at} onChange={(event) => updateField('formed_at', event.target.value)} />
          </label>
          <label>
            Approved At
            <input type="date" className="ndm-input" value={form.approved_at} onChange={(event) => updateField('approved_at', event.target.value)} />
          </label>
        </div>
      </section>

      <section className="org-form__section">
        <h3>Office Contact & Notes</h3>
        <div className="ndm-form-grid">
          <label>
            Office Phone
            <input className="ndm-input" value={form.office_phone} onChange={(event) => updateField('office_phone', event.target.value)} />
          </label>
          <label>
            Office Email
            <input className="ndm-input" value={form.office_email} onChange={(event) => updateField('office_email', event.target.value)} />
          </label>
          <label className="org-form__field org-form__field--wide">
            Description
            <textarea className="ndm-input" rows={4} value={form.description} onChange={(event) => updateField('description', event.target.value)} />
          </label>
          <label className="org-form__field org-form__field--wide">
            Notes
            <textarea className="ndm-input" rows={4} value={form.notes} onChange={(event) => updateField('notes', event.target.value)} />
          </label>
        </div>
        <label className="ndm-checkbox-row">
          <input type="checkbox" checked={Boolean(form.is_current)} onChange={(event) => updateField('is_current', event.target.checked)} />
          Mark as current committee
        </label>
      </section>

      <div className="ndm-modal__actions org-form__actions">
        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={onCancel} disabled={busy}>Cancel</button>
        <button type="submit" className="ndm-btn ndm-btn--primary" disabled={busy || !form.name.trim()}>
          {busy ? 'Saving...' : 'Save Committee'}
        </button>
      </div>
    </form>
  );
}
