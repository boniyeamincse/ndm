import { useEffect, useState } from 'react';

export default function EditMemberModal({ member, busy, onClose, onSubmit }) {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    mobile: '',
    educational_institution: '',
    district_name: '',
    division_name: '',
  });

  useEffect(() => {
    if (!member) return;

    setForm({
      full_name: member.full_name || '',
      email: member.email || '',
      mobile: member.mobile || '',
      educational_institution: member.educational_institution || '',
      district_name: member.district || member.district_name || '',
      division_name: member.division || member.division_name || '',
    });
  }, [member]);

  if (!member) return null;

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="ndm-modal__overlay" onClick={onClose}>
      <div className="ndm-modal" onClick={(event) => event.stopPropagation()} data-testid="edit-member-modal">
        <h3>Edit Member</h3>
        <div className="ndm-form-grid">
          <label>
            Full Name
            <input className="ndm-input" value={form.full_name} onChange={(event) => updateField('full_name', event.target.value)} />
          </label>
          <label>
            Email
            <input className="ndm-input" value={form.email} onChange={(event) => updateField('email', event.target.value)} />
          </label>
          <label>
            Mobile
            <input className="ndm-input" value={form.mobile} onChange={(event) => updateField('mobile', event.target.value)} />
          </label>
          <label>
            Institution
            <input className="ndm-input" value={form.educational_institution} onChange={(event) => updateField('educational_institution', event.target.value)} />
          </label>
          <label>
            District
            <input className="ndm-input" value={form.district_name} onChange={(event) => updateField('district_name', event.target.value)} />
          </label>
          <label>
            Division
            <input className="ndm-input" value={form.division_name} onChange={(event) => updateField('division_name', event.target.value)} />
          </label>
        </div>

        <div className="ndm-modal__actions">
          <button type="button" className="ndm-btn ndm-btn--ghost" onClick={onClose} disabled={busy}>Cancel</button>
          <button type="button" className="ndm-btn ndm-btn--primary" onClick={() => onSubmit(form)} disabled={busy || !form.full_name.trim()}>
            {busy ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
