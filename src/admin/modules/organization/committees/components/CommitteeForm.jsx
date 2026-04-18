import { useEffect, useMemo, useState } from 'react';
import { BD_GEO } from '../../../../../data/bd-geo';

const EMPTY_FORM = {
  name: '',
  committee_type_id: '',
  parent_id: '',
  code: '',
  division_id: '',
  district_id: '',
  upazila_id: '',
  union_id: '',
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

export default function CommitteeForm({ initialValues, committeeTypeOptions = [], busy, onCancel, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);

  const districtOptions = useMemo(() => {
    const division = BD_GEO.find((entry) => String(entry.id) === String(form.division_id));
    return division?.districts || [];
  }, [form.division_id]);

  const upazilaOptions = useMemo(() => {
    const district = districtOptions.find((entry) => String(entry.id) === String(form.district_id));
    return district?.upazilas || [];
  }, [districtOptions, form.district_id]);

  const unionOptions = useMemo(() => {
    const upazila = upazilaOptions.find((entry) => String(entry.id) === String(form.upazila_id));
    return upazila?.unions || [];
  }, [upazilaOptions, form.upazila_id]);

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
            Committee Type
            <select className="ndm-input" value={form.committee_type_id || ''} onChange={(event) => updateField('committee_type_id', event.target.value)} required>
              <option value="">Select Committee Type</option>
              {committeeTypeOptions.map((type) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
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
            <select
              className="ndm-input"
              value={form.division_id || ''}
              onChange={(event) => {
                const value = event.target.value;
                setForm((current) => ({
                  ...current,
                  division_id: value,
                  district_id: '',
                  upazila_id: '',
                  union_id: '',
                }));
              }}
            >
              <option value="">Select Division</option>
              {BD_GEO.map((division) => (
                <option key={division.id} value={division.id}>{division.name}</option>
              ))}
            </select>
          </label>
          <label>
            District
            <select
              className="ndm-input"
              value={form.district_id || ''}
              onChange={(event) => {
                const value = event.target.value;
                setForm((current) => ({
                  ...current,
                  district_id: value,
                  upazila_id: '',
                  union_id: '',
                }));
              }}
              disabled={!form.division_id}
            >
              <option value="">Select District</option>
              {districtOptions.map((district) => (
                <option key={district.id} value={district.id}>{district.name}</option>
              ))}
            </select>
          </label>
          <label>
            Upazila
            <select
              className="ndm-input"
              value={form.upazila_id || ''}
              onChange={(event) => {
                const value = event.target.value;
                setForm((current) => ({
                  ...current,
                  upazila_id: value,
                  union_id: '',
                }));
              }}
              disabled={!form.district_id}
            >
              <option value="">Select Upazila</option>
              {upazilaOptions.map((upazila) => (
                <option key={upazila.id} value={upazila.id}>{upazila.name}</option>
              ))}
            </select>
          </label>
          <label>
            Union
            <select
              className="ndm-input"
              value={form.union_id || ''}
              onChange={(event) => updateField('union_id', event.target.value)}
              disabled={!form.upazila_id}
            >
              <option value="">Select Union</option>
              {unionOptions.map((union) => (
                <option key={union.id} value={union.id}>{union.name}</option>
              ))}
            </select>
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
