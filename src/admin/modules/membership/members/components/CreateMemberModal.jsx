import { useEffect, useState } from 'react';
import { X, User, Phone, GraduationCap, MapPin, AlertCircle, CheckCircle } from 'lucide-react';

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

function FormSection({ icon: Icon, title, children, count, total }) {
  const progress = Math.round(((count || 0) / (total || 1)) * 100);
  return (
    <div className="mem-create-section">
      <div className="mem-create-section__header">
        <div className="mem-create-section__title">
          {Icon && <Icon size={18} />}
          <span>{title}</span>
        </div>
      </div>
      <div className="ndm-form-grid mem-create-section__grid">{children}</div>
    </div>
  );
}

function Field({ label, required, children, error }) {
  return (
    <label className="mem-create-field">
      <span className="mem-create-field__label">
        {label}
        {required && <span className="mem-create-field__required">*</span>}
      </span>
      <div className="mem-create-field__input-wrapper">
        {children}
        {error && <span className="mem-create-field__error"><AlertCircle size={12} />{error}</span>}
      </div>
    </label>
  );
}

export default function CreateMemberModal({ open, busy, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!open) return;
    setForm(EMPTY_FORM);
    setErrors({});
    setSuccessMessage('');
  }, [open]);

  function set(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.full_name.trim()) errs.full_name = 'Full name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    if (!form.mobile.trim()) errs.mobile = 'Mobile is required.';
    
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Please enter a valid email.';
    }
    
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

  if (!open) return null;

  return (
    <div className="ndm-modal__overlay" role="dialog" aria-modal="true" aria-labelledby="create-member-title" onClick={onClose}>
      <div className="ndm-modal ndm-modal--lg mem-create-modal" onClick={(e) => e.stopPropagation()} data-testid="create-member-modal">
        {/* Header */}
        <div className="mem-create-modal__header">
          <div className="mem-create-modal__header-content">
            <h3 id="create-member-title" className="mem-create-modal__title">Add New Member</h3>
            <p className="mem-create-modal__subtitle">Create a new member record directly in the system</p>
          </div>
          <button type="button" className="mem-create-modal__close" onClick={onClose} aria-label="Close" disabled={busy}>
            <X size={20} />
          </button>
        </div>

        {successMessage && (
          <div className="mem-create-modal__success">
            <CheckCircle size={16} />
            {successMessage}
          </div>
        )}

        {/* Form */}
        <div className="mem-create-modal__body">
          <FormSection icon={User} title="Personal Information">
            <Field label="Full Name" required error={errors.full_name}>
              <input {...inp('full_name')} placeholder="Enter full name" />
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
          </FormSection>

          <FormSection icon={null} title="Family Information">
            <Field label="Father's Name">
              <input {...inp('father_name')} placeholder="Father's full name" />
            </Field>
            <Field label="Mother's Name">
              <input {...inp('mother_name')} placeholder="Mother's full name" />
            </Field>
            <Field label="Bio">
              <textarea 
                {...inp('bio')} 
                className="ndm-input mem-create-field__textarea" 
                rows={2} 
                placeholder="Short bio or description..."
                style={{ gridColumn: '1/-1' }} 
              />
            </Field>
          </FormSection>

          <FormSection icon={Phone} title="Contact Information">
            <Field label="Email" required error={errors.email}>
              <input type="email" {...inp('email')} placeholder="email@example.com" />
            </Field>
            <Field label="Mobile" required error={errors.mobile}>
              <input {...inp('mobile')} placeholder="01XXXXXXXXX" />
            </Field>
            <Field label="Emergency Contact Name">
              <input {...inp('emergency_contact_name')} placeholder="Guardian / next-of-kin name" />
            </Field>
            <Field label="Emergency Contact Phone">
              <input {...inp('emergency_contact_phone')} placeholder="01XXXXXXXXX" />
            </Field>
          </FormSection>

          <FormSection icon={GraduationCap} title="Academic / Professional">
            <Field label="Educational Institution">
              <input {...inp('educational_institution')} placeholder="University / College name" />
            </Field>
            <Field label="Department">
              <input {...inp('department')} placeholder="Department or faculty" />
            </Field>
            <Field label="Academic Year">
              <input {...inp('academic_year')} placeholder="e.g. 3rd Year" />
            </Field>
            <Field label="Occupation">
              <input {...inp('occupation')} placeholder="Student / Professional / Other" />
            </Field>
          </FormSection>

          <FormSection icon={MapPin} title="Address">
            <Field label="Address Line">
              <input {...inp('address_line')} placeholder="House, road, area" />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', gridColumn: '1/-1' }}>
              <Field label="Village / Area">
                <input {...inp('village_area')} placeholder="Village or area" />
              </Field>
              <Field label="Post Office">
                <input {...inp('post_office')} placeholder="Post office name" />
              </Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', gridColumn: '1/-1' }}>
              <Field label="Union">
                <input {...inp('union_name')} placeholder="Union name" />
              </Field>
              <Field label="Upazila">
                <input {...inp('upazila_name')} placeholder="Upazila name" />
              </Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', gridColumn: '1/-1' }}>
              <Field label="District">
                <input {...inp('district_name')} placeholder="District name" />
              </Field>
              <Field label="Division">
                <input {...inp('division_name')} placeholder="Division name" />
              </Field>
            </div>
          </FormSection>
        </div>

        {/* Footer */}
        <div className="mem-create-modal__footer">
          <button 
            type="button" 
            className="ndm-btn ndm-btn--ghost" 
            onClick={onClose} 
            disabled={busy}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="ndm-btn ndm-btn--primary mem-create-modal__submit" 
            onClick={handleSubmit} 
            disabled={busy}
          >
            {busy ? (
              <>
                <span className="mem-create-modal__spinner"></span>
                Creating...
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                Create Member
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
