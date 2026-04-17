import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import BdAddressSelect from '../components/BdAddressSelect';
import './ProfileSetup.css';

export default function ProfileSetup() {
  const { t, lang } = useLang();
  useScrollReveal();

  const user = JSON.parse(localStorage.getItem('ndm_user') || '{}');

  const [form, setForm] = useState({
    name: user?.name && user.name !== 'New Member' ? user.name : '',
    email: user?.email || '',
    phone: '',
    university: '',
    dept: '',
    year: '',
    address: { division: '', district: '', upazila: '', union: '' },
    address_line: '',
    village_area: '',
    post_office: '',
    photo: null,
    why: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = e => {
    setFieldErrors(fe => ({ ...fe, [e.target.name]: undefined }));
    setApiError(null);
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handlePhotoChange = e => {
    const file = e.target.files?.[0] || null;
    setFieldErrors(fe => ({ ...fe, photo: undefined }));
    setApiError(null);

    if (!file) {
      setForm(f => ({ ...f, photo: null }));
      return;
    }

    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setFieldErrors(fe => ({
        ...fe,
        photo: lang === 'en' ? 'Photo must be 5MB or smaller.' : 'ছবির সাইজ ৫MB বা তার কম হতে হবে।',
      }));
      e.target.value = '';
      setForm(f => ({ ...f, photo: null }));
      return;
    }

    setForm(f => ({ ...f, photo: file }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setApiError(null);
    setFieldErrors({});

    try {
      const body = new FormData();
      body.append('full_name', form.name.trim());

      if (form.email.trim()) body.append('email', form.email.trim());
      if (form.phone.trim()) body.append('mobile', form.phone.trim());
      if (form.university.trim()) body.append('educational_institution', form.university.trim());
      if (form.dept.trim()) body.append('department', form.dept.trim());
      if (form.year) body.append('academic_year', form.year);
      if (form.address.division) body.append('division_id', form.address.division);
      if (form.address.district) body.append('district_id', form.address.district);
      if (form.address.upazila) body.append('upazila_id', form.address.upazila);
      if (form.address.union) body.append('union_id', form.address.union);
      if (form.address_line.trim()) body.append('address_line', form.address_line.trim());
      if (form.village_area.trim()) body.append('village_area', form.village_area.trim());
      if (form.post_office.trim()) body.append('post_office', form.post_office.trim());
      if (form.why.trim()) body.append('motivation', form.why.trim());
      if (form.photo) body.append('photo', form.photo);

      const res = await fetch('/api/v1/membership/apply', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body,
      });

      const json = await res.json();

      if (res.ok && json.success !== false) {
        setSubmitted(true);
      } else if (res.status === 422) {
        const errs = json.errors || {};
        setFieldErrors({
          name: errs.full_name?.[0],
          email: errs.email?.[0],
          phone: errs.mobile?.[0],
          university: errs.educational_institution?.[0],
          dept: errs.department?.[0],
          year: errs.academic_year?.[0],
          division: errs.division_id?.[0],
          district: errs.district_id?.[0],
          upazila: errs.upazila_id?.[0],
          union: errs.union_id?.[0],
          address_line: errs.address_line?.[0],
          village_area: errs.village_area?.[0],
          post_office: errs.post_office?.[0],
          photo: errs.photo?.[0],
          why: errs.motivation?.[0],
          _contact: errs.contact?.[0],
        });
        setApiError(json.message || (lang === 'en' ? 'Please fix the errors below.' : 'নিচের ত্রুটিগুলো ঠিক করুন।'));
      } else {
        setApiError(
          json.message ||
            (lang === 'en'
              ? 'Could not save profile details. Please try again.'
              : 'প্রোফাইল তথ্য সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।'),
        );
      }
    } catch {
      setApiError(
        lang === 'en'
          ? 'Network error. Please check your connection and try again.'
          : 'নেটওয়ার্ক ত্রুটি। আপনার সংযোগ পরীক্ষা করুন এবং আবার চেষ্টা করুন।',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">{t('nav_home')}</Link><span>/</span>
            <span>{lang === 'en' ? 'Profile Setup' : 'প্রোফাইল সেটআপ'}</span>
          </div>
          <h1>{lang === 'en' ? 'Complete Your Profile' : 'আপনার প্রোফাইল সম্পূর্ণ করুন'}</h1>
          <p>
            {lang === 'en'
              ? 'One last step. Fill your member details to complete registration.'
              : 'আরও একটি ধাপ। রেজিস্ট্রেশন সম্পূর্ণ করতে আপনার সদস্য তথ্য পূরণ করুন।'}
          </p>
        </div>
      </section>

      <section className="section-pad" style={{ background: 'var(--clr-light)' }}>
        <div className="container profile-setup-wrap">
          <div className="join-form-wrap reveal">
            {submitted ? (
              <div className="join-success">
                <CheckCircle2 size={48} color="var(--clr-primary)" />
                <h3>{lang === 'en' ? 'Profile submitted successfully!' : 'প্রোফাইল সফলভাবে জমা হয়েছে!'}</h3>
                <p>
                  {lang === 'en'
                    ? 'Thank you. Your profile details have been submitted for review.'
                    : 'ধন্যবাদ। আপনার প্রোফাইল তথ্য পর্যালোচনার জন্য জমা হয়েছে।'}
                </p>
                <Link to="/member/dashboard" className="btn btn-primary">
                  {lang === 'en' ? 'Go to Dashboard' : 'ড্যাশবোর্ডে যান'}
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="join-form" noValidate>
                {(apiError || fieldErrors._contact) && (
                  <div className="form-alert form-alert--error">
                    <AlertCircle size={16} />
                    <span>{fieldErrors._contact || apiError}</span>
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="profile-name">{t('join_fname')} *</label>
                    <input id="profile-name" name="name" type="text" className="form-control" value={form.name} onChange={handleChange} required />
                    {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="profile-email">{t('join_email')}</label>
                    <input id="profile-email" name="email" type="email" className="form-control" value={form.email} onChange={handleChange} />
                    {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="profile-phone">{t('join_phone')}</label>
                    <input id="profile-phone" name="phone" type="tel" className="form-control" value={form.phone} onChange={handleChange} />
                    {fieldErrors.phone && <span className="field-error">{fieldErrors.phone}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="profile-uni">{t('join_university')}</label>
                    <input id="profile-uni" name="university" type="text" className="form-control" value={form.university} onChange={handleChange} />
                    {fieldErrors.university && <span className="field-error">{fieldErrors.university}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="profile-dept">{t('join_dept')}</label>
                    <input id="profile-dept" name="dept" type="text" className="form-control" value={form.dept} onChange={handleChange} />
                    {fieldErrors.dept && <span className="field-error">{fieldErrors.dept}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="profile-year">{t('join_year')}</label>
                    <select id="profile-year" name="year" className="form-control" value={form.year} onChange={handleChange}>
                      <option value="">{lang === 'en' ? 'Select year' : 'বছর বেছে নিন'}</option>
                      {['join_year_1', 'join_year_2', 'join_year_3', 'join_year_4', 'join_year_masters'].map(k => (
                        <option key={k} value={k}>{t(k)}</option>
                      ))}
                    </select>
                    {fieldErrors.year && <span className="field-error">{fieldErrors.year}</span>}
                  </div>
                </div>

                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label style={{ display:'block', marginBottom:'.5rem', fontWeight:600, fontSize:'.875rem' }}>
                    {lang === 'en' ? 'Address' : 'ঠিকানা'} *
                  </label>
                  <BdAddressSelect
                    value={form.address}
                    onChange={addr => setForm(f => ({ ...f, address: addr }))}
                    errors={{
                      division: fieldErrors.division,
                      district: fieldErrors.district,
                      upazila:  fieldErrors.upazila,
                      union:    fieldErrors.union,
                    }}
                    lang={lang}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="profile-address-line">{lang === 'en' ? 'Address Line' : 'ঠিকানা লাইন'}</label>
                    <input
                      id="profile-address-line"
                      name="address_line"
                      type="text"
                      className="form-control"
                      value={form.address_line}
                      onChange={handleChange}
                      placeholder={lang === 'en' ? 'House / Road / Area details' : 'বাড়ি / রোড / এলাকার বিস্তারিত'}
                    />
                    {fieldErrors.address_line && <span className="field-error">{fieldErrors.address_line}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="profile-village-area">{lang === 'en' ? 'Village / Area' : 'গ্রাম / এলাকা'}</label>
                    <input
                      id="profile-village-area"
                      name="village_area"
                      type="text"
                      className="form-control"
                      value={form.village_area}
                      onChange={handleChange}
                      placeholder={lang === 'en' ? 'Village or local area' : 'গ্রাম বা স্থানীয় এলাকা'}
                    />
                    {fieldErrors.village_area && <span className="field-error">{fieldErrors.village_area}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="profile-post-office">{lang === 'en' ? 'Post Office' : 'ডাকঘর'}</label>
                  <input
                    id="profile-post-office"
                    name="post_office"
                    type="text"
                    className="form-control"
                    value={form.post_office}
                    onChange={handleChange}
                    placeholder={lang === 'en' ? 'Post office name' : 'ডাকঘরের নাম'}
                  />
                  {fieldErrors.post_office && <span className="field-error">{fieldErrors.post_office}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="profile-photo">
                    {lang === 'en' ? 'Photo (max 5MB)' : 'ছবি (সর্বোচ্চ ৫MB)'}
                  </label>
                  <input
                    id="profile-photo"
                    name="photo"
                    type="file"
                    className="form-control"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                  />
                  {form.photo && (
                    <small style={{ color: '#6b7280' }}>
                      {lang === 'en' ? 'Selected:' : 'নির্বাচিত:'} {form.photo.name}
                    </small>
                  )}
                  {fieldErrors.photo && <span className="field-error">{fieldErrors.photo}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="profile-why">{t('join_why_join')}</label>
                  <textarea id="profile-why" name="why" className="form-control" value={form.why} onChange={handleChange} />
                  {fieldErrors.why && <span className="field-error">{fieldErrors.why}</span>}
                </div>

                <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
                  {loading
                    ? (lang === 'en' ? 'Saving...' : 'সংরক্ষণ হচ্ছে...')
                    : <>{lang === 'en' ? 'Save Profile' : 'প্রোফাইল সংরক্ষণ করুন'} <ArrowRight size={18} /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
