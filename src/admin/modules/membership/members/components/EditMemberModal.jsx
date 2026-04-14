import { useEffect, useState } from 'react';
import { X, User, Phone, GraduationCap, MapPin, AlertCircle } from 'lucide-react';

const EMPTY_FORM = {
  full_name: '',
  gender: '',
  date_of_birth: '',
  blood_group: '',
  father_name: '',
  mother_name: '',
  bio: '',
  email: '',
  mobile: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  educational_institution: '',
  department: '',
  academic_year: '',
  occupation: '',
  address_line: '',
  village_area: '',
  post_office: '',
  union_name: '',
  upazila_name: '',
  district_name: '',
  division_name: '',
};

function FormSection({ icon: Icon, title, children }) {
  return (
    <div className="mem-form-section">
      <h4 className="mem-form-section__title">{Icon ? <Icon size={15} /> : null} {title}</h4>
      <div className="ndm-form-grid mem-form-section__grid">{children}</div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="mem-field">
      <span className="mem-field__label">{label}{required ? <span className="mem-field__required">*</span> : null}</span>
      {children}
    </label>
  );
}

export default function EditMemberModal({ member, busy, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!member) return;
    setErrors({});
    setForm({
      full_name: member.full_name || '',
      gender: member.gender || '',
      date_of_birth: member.date_of_birth || '',
      blood_group: member.blood_group || '',
      father_name: member.father_name || '',
      mother_name: member.mother_name || '',
      bio: member.bio || '',
      email: member.email || '',
      mobile: member.mobile || '',
      emergency_contact_name: member.emergency_contact?.name || '',
      emergency_contact_phone: member.emergency_contact?.phone || '',
      educational_institution: member.educational_institution || '',
      department: member.department || '',
      academic_year: member.academic_year || '',
      occupation: member.occupation || '',
      address_line: member.address?.address_line || member.address_line || '',
      village_area: member.address?.village_area || member.village_area || '',
      post_office: member.address?.post_office || member.post_office || '',
      union_name: member.address?.union_name || member.union_name || '',
      upazila_name: member.address?.upazila_name || member.upazila_name || '',
      district_name: member.address?.district_name || member.district_name || member.district || '',
      division_name: member.address?.division_name || member.division_name || member.division || '',
    });
  }, [member?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!member) return null;

  function set(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.full_name.trim()) errs.full_name = 'Full name is required.';
    if (!form.mobile.trim()) errs.mobile = 'Mobile is required.';
    return errs;
  }

  function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit(form);
  }

  const inp = (name) => ({
    className: `ndm-input${errors[name] ? ' ndm-input--error' : ''}`,
    value: form[name],
    onChange: (e) => set(name, e.target.value),
  });

  const sel = (name) => ({
    className: 'ndm-input',
    value: form[name],
    onChange: (e) => set(name, e.target.value),
  });

  return (
    <div className="ndm-modal__overlay" role="dialog" aria-modal="true" aria-labelledby="edit-member-title" onClick={onClose}>
      <div className="ndm-modal ndm-modal--lg" onClick={(e) => e.stopPropagation()} data-testid="edit-member-modal">
        <div className="mem-modal-header">
          <div>
            <h3 id="edit-member-title">Edit Member</h3>
            <p className="mem-modal-header__sub">{member.full_name} · {member.member_no}</p>
          </div>
          <button type="button" className="mem-modal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="mem-modal-body">
          <FormSection icon={User} title="Personal Information">
            <Field label="Full Name" required>
              <input {...inp('full_name')} placeholder="Enter full name" />
              {errors.full_name ? <span className="mem-field__error"><AlertCircle size={12} />{errors.full_name}</span> : null}
            </Field>
            <Field label="Gender">
              <select {...sel('gender')}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </Field>
            <Field label="Date of Birth">
              <input type="date" {...inp('date_of_birth')} />
            </Field>
            <Field label="Blood Group">
              <select {...sel('blood_group')}>
                <option value="">Select blood group</option>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </Field>
            <Field label="Father's Name"><input {...inp('father_name')} placeholder="Father's full name" /></Field>
            <Field label="Mother's Name"><input {...inp('mother_name')} placeholder="Mother's full name" /></Field>
            <Field label="Bio">
              <textarea {...inp('bio')} className="ndm-input" rows={3} placeholder="Short bio or description..." style={{ height: 'auto', gridColumn: '1/-1' }} />
            </Field>
          </FormSection>

          <FormSection icon={Phone} title="Contact Information">
            <Field label="Email"><input type="email" {...inp('email')} placeholder="email@example.com" /></Field>
            <Field label="Mobile" required>
              <input {...inp('mobile')} placeholder="01XXXXXXXXX" />
              {errors.mobile ? <span className="mem-field__error"><AlertCircle size={12} />{errors.mobile}</span> : null}
            </Field>
            <Field label="Emergency Contact Name"><input {...inp('emergency_contact_name')} placeholder="Guardian / next-of-kin name" /></Field>
            <Field label="Emergency Contact Phone"><input {...inp('emergency_contact_phone')} placeholder="01XXXXXXXXX" /></Field>
          </FormSection>

          <FormSection icon={GraduationCap} title="Academic / Professional">
            <Field label="Educational Institution"><input {...inp('educational_institution')} placeholder="University / College name" /></Field>
            <Field label="Department"><input {...inp('department')} placeholder="Department or faculty" /></Field>
            <Field label="Academic Year"><input {...inp('academic_year')} placeholder="e.g. 3rd Year" /></Field>
            <Field label="Occupation"><input {...inp('occupation')} placeholder="Student / Professional / Other" /></Field>
          </FormSection>

          <FormSection icon={MapPin} title="Address">
            <Field label="Address Line"><input {...inp('address_line')} placeholder="House, road, area" /></Field>
            <Field label="Village / Area"><input {...inp('village_area')} placeholder="Village or area" /></Field>
            <Field label="Post Office"><input {...inp('post_office')} placeholder="Post office name" /></Field>
            <Field label="Union"><input {...inp('union_name')} placeholder="Union name" /></Field>
            <Field label="Upazila"><input {...inp('upazila_name')} placeholder="Upazila name" /></Field>
            <Field label="District"><input {...inp('district_name')} placeholder="District name" /></Field>
            <Field label="Division"><input {...inp('division_name')} placeholder="Division name" /></Field>
          </FormSection>
        </div>

        <div className="ndm-modal__actions">
          <button type="button" className="ndm-btn ndm-btn--ghost" onClick={onClose} disabled={busy}>Cancel</button>
          <button type="button" className="ndm-btn ndm-btn--primary" onClick={handleSubmit} disabled={busy}>
            {busy ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
