import { useEffect, useRef, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, GraduationCap, MapPin, ImagePlus, FileText, Camera, ArrowRight, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import BdAddressSelect from '../components/BdAddressSelect';
import './ProfileSetup.css';

export default function ProfileSetup() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  useScrollReveal();

  const user = JSON.parse(localStorage.getItem('ndm_user') || '{}');

  const [form, setForm] = useState({
    name: user?.name && user.name !== 'New Member' ? user.name : '',
    email: user?.email || '',
    phone: '',
    gender: '',
    dob: '',
    blood_group: '',
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
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState('');
  const photoInputRef = useRef(null);
  const redirectTimeoutRef = useRef(null);

  useEffect(() => () => {
    if (redirectTimeoutRef.current) {
      window.clearTimeout(redirectTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    if (!form.photo) {
      setPhotoPreviewUrl('');
      return;
    }

    const objectUrl = URL.createObjectURL(form.photo);
    setPhotoPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [form.photo]);

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

  const handlePhotoRemove = () => {
    setFieldErrors(fe => ({ ...fe, photo: undefined }));
    setApiError(null);
    setForm(f => ({ ...f, photo: null }));

    if (photoInputRef.current) {
      photoInputRef.current.value = '';
    }
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
      if (form.gender) body.append('gender', form.gender);
      if (form.dob) body.append('date_of_birth', form.dob);
      if (form.blood_group) body.append('blood_group', form.blood_group);
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
        const nextUser = {
          ...user,
          full_name: form.name.trim() || user?.full_name,
          email: form.email.trim() || user?.email,
          membership_status: json.data?.status || user?.membership_status || 'pending',
        };

        localStorage.setItem('ndm_user', JSON.stringify(nextUser));
        window.dispatchEvent(new Event('auth-changed'));
        setSubmitted(true);
        redirectTimeoutRef.current = window.setTimeout(() => {
          navigate('/member/dashboard', { replace: true });
        }, 1200);
      } else if (res.status === 422) {
        const errs = json.errors || {};
        setFieldErrors({
          name: errs.full_name?.[0],
          email: errs.email?.[0],
          phone: errs.mobile?.[0],
          gender: errs.gender?.[0],
          dob: errs.date_of_birth?.[0],
          blood_group: errs.blood_group?.[0],
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

  const completion = useMemo(() => {
    const fields = [
      { id: 'Personal', items: [form.name, form.phone, form.gender, form.dob, form.blood_group].map(v => !!v?.toString().trim()) },
      { id: 'Academic', items: [form.university, form.dept, form.year].map(v => !!v?.toString().trim()) },
      { id: 'Address', items: [form.address.division, form.address.district, form.address.upazila, form.address.union, form.address_line, form.village_area, form.post_office].map(v => !!v?.toString().trim()) },
      { id: 'Media', items: [form.photo, form.why].map(v => !!v) }
    ];

    const allItems = fields.flatMap(f => f.items);
    const filledCount = allItems.filter(v => v).length;
    const totalCount = allItems.length;
    const percentage = Math.round((filledCount / totalCount) * 100);

    return {
      percentage,
      sections: fields.map(f => ({
        id: f.id,
        isDone: f.items.every(v => v),
        count: f.items.filter(v => v).length,
        total: f.items.length
      }))
    };
  }, [form]);

  if (submitted) {
    return (
      <main>
        <section className="page-hero">
          <div className="container">
            <h1>{lang === 'en' ? 'Registration Complete' : 'রেজিস্ট্রেশন সম্পূর্ণ'}</h1>
          </div>
        </section>
        <section className="section-pad">
          <div className="container profile-setup-wrap">
            <div className="join-success reveal">
              <div className="section-icon" style={{ width: 80, height: 80, background: '#ecfdf5', color: '#10b981', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                <CheckCircle2 size={40} />
              </div>
              <h3>{lang === 'en' ? 'Profile submitted successfully!' : 'প্রোফাইল সফলভাবে জমা হয়েছে!'}</h3>
              <p style={{ maxWidth: 500, margin: '0 auto 2rem', color: '#6b7280' }}>
                {lang === 'en'
                  ? 'Thank you. Your profile details have been submitted for review. Our administrative team will verify your information shortly. Redirecting you to your dashboard...'
                  : 'ধন্যবাদ। আপনার প্রোফাইল তথ্য পর্যালোচনার জন্য জমা হয়েছে। আমাদের প্রশাসনিক দল শীঘ্রই আপনার তথ্য যাচাই করবে। আপনাকে ড্যাশবোর্ডে নেওয়া হচ্ছে...'}
              </p>
              <Link to="/member/dashboard" className="btn btn-primary btn-lg">
                {lang === 'en' ? 'Go to Dashboard' : 'ড্যাশবোর্ডে যান'}
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

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
          <div className="setup-layout">
            <div className="join-form-wrap reveal">
              <form onSubmit={handleSubmit} className="join-form" noValidate>
                {(apiError || fieldErrors._contact) && (
                  <div className="form-alert form-alert--error">
                    <AlertCircle size={16} />
                    <span>{fieldErrors._contact || apiError}</span>
                  </div>
                )}

                {/* SECTION: Personal Information */}
                <div className="form-section">
                  <div className="section-header">
                    <div className="section-icon"><User size={20} /></div>
                    <div className="section-title">
                      <h3>{lang === 'en' ? 'Personal Information' : 'ব্যক্তিগত তথ্য'}</h3>
                      <p>{lang === 'en' ? 'Basic identification details' : 'মৌলিক পরিচিতি তথ্য'}</p>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="profile-name">{t('join_fname')} *</label>
                      <input id="profile-name" name="name" type="text" className="form-control" value={form.name} onChange={handleChange} required />
                      {fieldErrors.name && <span className="field-error"><AlertCircle size={12} /> {fieldErrors.name}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="profile-email">{t('join_email')}</label>
                      <input id="profile-email" name="email" type="email" className="form-control" value={form.email} onChange={handleChange} />
                      {fieldErrors.email && <span className="field-error"><AlertCircle size={12} /> {fieldErrors.email}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="profile-phone">{t('join_phone')}</label>
                      <input id="profile-phone" name="phone" type="tel" className="form-control" value={form.phone} onChange={handleChange} />
                      {fieldErrors.phone && <span className="field-error"><AlertCircle size={12} /> {fieldErrors.phone}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="profile-gender">{lang === 'en' ? 'Gender' : 'লিঙ্গ'}</label>
                      <select id="profile-gender" name="gender" className="form-control" value={form.gender} onChange={handleChange}>
                        <option value="">{lang === 'en' ? 'Select Gender' : 'লিঙ্গ বেছে নিন'}</option>
                        <option value="male">{lang === 'en' ? 'Male' : 'পুরুষ'}</option>
                        <option value="female">{lang === 'en' ? 'Female' : 'নারী'}</option>
                        <option value="other">{lang === 'en' ? 'Other' : 'অন্যান্য'}</option>
                      </select>
                      {fieldErrors.gender && <span className="field-error"><AlertCircle size={12} /> {fieldErrors.gender}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="profile-dob">{lang === 'en' ? 'Date of Birth' : 'জন্ম তারিখ'}</label>
                      <input id="profile-dob" name="dob" type="date" className="form-control" value={form.dob} onChange={handleChange} />
                      {fieldErrors.dob && <span className="field-error"><AlertCircle size={12} /> {fieldErrors.dob}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="profile-blood">{lang === 'en' ? 'Blood Group' : 'রক্তের গ্রুপ'}</label>
                      <select id="profile-blood" name="blood_group" className="form-control" value={form.blood_group} onChange={handleChange}>
                        <option value="">{lang === 'en' ? 'Select' : 'নির্বাচন করুন'}</option>
                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                      {fieldErrors.blood_group && <span className="field-error"><AlertCircle size={12} /> {fieldErrors.blood_group}</span>}
                    </div>
                  </div>
                </div>

                {/* SECTION: Academic Information */}
                <div className="form-section">
                  <div className="section-header">
                    <div className="section-icon"><GraduationCap size={20} /></div>
                    <div className="section-title">
                      <h3>{lang === 'en' ? 'Academic Details' : 'একাডেমিক তথ্য'}</h3>
                      <p>{lang === 'en' ? 'Your educational background' : 'আপনার শিক্ষা সংক্রান্ত তথ্য'}</p>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="profile-uni">{t('join_university')}</label>
                      <input id="profile-uni" name="university" type="text" className="form-control" value={form.university} onChange={handleChange} />
                      {fieldErrors.university && <span className="field-error"><AlertCircle size={12} /> {fieldErrors.university}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="profile-dept">{t('join_dept')}</label>
                      <input id="profile-dept" name="dept" type="text" className="form-control" value={form.dept} onChange={handleChange} />
                      {fieldErrors.dept && <span className="field-error"><AlertCircle size={12} /> {fieldErrors.dept}</span>}
                    </div>
                  </div>

                  <div className="form-group" style={{ maxWidth: 'calc(50% - 0.75rem)' }}>
                    <label htmlFor="profile-year">{t('join_year')}</label>
                    <select id="profile-year" name="year" className="form-control" value={form.year} onChange={handleChange}>
                      <option value="">{lang === 'en' ? 'Select year' : 'বছর বেছে নিন'}</option>
                      {['join_year_1', 'join_year_2', 'join_year_3', 'join_year_4', 'join_year_masters'].map(k => (
                        <option key={k} value={k}>{t(k)}</option>
                      ))}
                    </select>
                    {fieldErrors.year && <span className="field-error"><AlertCircle size={12} /> {fieldErrors.year}</span>}
                  </div>
                </div>

                {/* SECTION: Address Information */}
                <div className="form-section">
                  <div className="section-header">
                    <div className="section-icon"><MapPin size={20} /></div>
                    <div className="section-title">
                      <h3>{lang === 'en' ? 'Address Information' : 'ঠিকানা তথ্য'}</h3>
                      <p>{lang === 'en' ? 'Where are you from?' : 'আপনার বর্তমান বা স্থায়ী ঠিকানা'}</p>
                    </div>
                  </div>

                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
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

                  <div className="form-row" style={{ marginTop: '1.5rem' }}>
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
                      {fieldErrors.address_line && <span className="field-error"><AlertCircle size={12} /> {fieldErrors.address_line}</span>}
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
                      {fieldErrors.village_area && <span className="field-error"><AlertCircle size={12} /> {fieldErrors.village_area}</span>}
                    </div>
                  </div>

                  <div className="form-group" style={{ maxWidth: 'calc(50% - 0.75rem)' }}>
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
                    {fieldErrors.post_office && <span className="field-error"><AlertCircle size={12} /> {fieldErrors.post_office}</span>}
                  </div>
                </div>

                {/* SECTION: Media & Motivation */}
                <div className="form-section" style={{ borderBottom: 'none' }}>
                  <div className="section-header">
                    <div className="section-icon"><ImagePlus size={20} /></div>
                    <div className="section-title">
                      <h3>{lang === 'en' ? 'Photo & Motivation' : 'ছবি এবং বর্ণনা'}</h3>
                      <p>{lang === 'en' ? 'Help us know you better' : 'আমাদের আপনাকে চিনতে সাহায্য করুন'}</p>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>{lang === 'en' ? 'Profile Photo' : 'প্রোফাইল ছবি'}</label>
                    <div className="photo-upload-container">
                      {!form.photo ? (
                        <div className="photo-placeholder" style={{ cursor: 'pointer' }} onClick={() => photoInputRef.current?.click()}>
                          <Camera size={40} style={{ color: '#9ca3af', marginBottom: '1rem' }} />
                          <p style={{ fontWeight: 600, color: '#4b5563' }}>
                            {lang === 'en' ? 'Click to upload photo' : 'ছবি আপলোড করতে ক্লিক করুন'}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                            JPG, PNG or WEBP (Max 5MB)
                          </p>
                        </div>
                      ) : (
                        <div className="photo-preview-card">
                          <div className="photo-preview-image-wrap">
                            {photoPreviewUrl && <img src={photoPreviewUrl} alt="Preview" className="photo-preview-image" />}
                          </div>
                          <div className="photo-preview-meta">
                            <span className="photo-preview-name">{form.photo.name}</span>
                            <span className="photo-preview-size">{(form.photo.size / (1024 * 1024)).toFixed(2)} MB</span>
                          </div>
                          <div className="photo-action-btns">
                            <button type="button" className="photo-change-btn" onClick={() => photoInputRef.current?.click()}>
                              {lang === 'en' ? 'Change' : 'পরিবর্তন'}
                            </button>
                            <button type="button" className="photo-remove-btn" onClick={handlePhotoRemove}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                      <input
                        id="profile-photo"
                        name="photo"
                        type="file"
                        ref={photoInputRef}
                        style={{ display: 'none' }}
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handlePhotoChange}
                      />
                    </div>
                    {fieldErrors.photo && <span className="field-error"><AlertCircle size={12} /> {fieldErrors.photo}</span>}
                  </div>

                  <div className="form-group" style={{ marginTop: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <FileText size={18} style={{ color: 'var(--clr-primary)' }} />
                      <label style={{ margin: 0 }}>{t('join_why_join')}</label>
                    </div>
                    <textarea 
                      id="profile-why" 
                      name="why" 
                      className="form-control" 
                      rows={4} 
                      value={form.why} 
                      onChange={handleChange} 
                      placeholder={lang === 'en' ? 'Briefly describe your interest in joining...' : 'সংক্ষেপে লিখুন কেন আপনি যোগদান করতে আগ্রহী...'}
                    />
                    {fieldErrors.why && <span className="field-error"><AlertCircle size={12} /> {fieldErrors.why}</span>}
                  </div>
                </div>

                <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #f3f4f6' }}>
                  <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', height: '56px', borderRadius: '14px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                    {loading
                      ? (lang === 'en' ? 'Saving Your Profile...' : 'প্রোফাইল সংরক্ষণ হচ্ছে...')
                      : <>{lang === 'en' ? 'Submit Profile for Review' : 'পর্যালোচনার জন্য জমা দিন'} <ArrowRight size={20} /></>}
                  </button>
                  <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#9ca3af', marginTop: '1rem' }}>
                    {lang === 'en' ? 'By submitting, you agree to our membership terms and conditions.' : 'জমা দেওয়ার মাধ্যমে, আপনি আমাদের সদস্যপদ শর্তাবলীতে সম্মত হচ্ছেন।'}
                  </p>
                </div>
              </form>
            </div>

            <div className="completion-sidebar reveal">
              <div className="completion-card">
                <h4>{lang === 'en' ? 'Completion Status' : 'সম্পন্ন করার স্থিতি'}</h4>
                
                <div className="circle-graph">
                  <svg width="160" height="160" viewBox="0 0 160 160">
                    <circle className="circle-bg" cx="80" cy="80" r="70" />
                    <circle 
                      className="circle-progress" 
                      cx="80" cy="80" r="70" 
                      strokeDasharray={440}
                      strokeDashoffset={440 - (440 * completion.percentage) / 100}
                    />
                  </svg>
                  <div className="percentage-text">
                    <span className="value">{completion.percentage}%</span>
                    <span className="label">{lang === 'en' ? 'Complete' : 'সম্পূর্ণ'}</span>
                  </div>
                </div>

                <div className="completion-checklist">
                  {completion.sections.map(section => (
                    <div key={section.id} className={`check-item ${section.isDone ? 'check-item--done' : ''}`}>
                      <div className="check-icon">
                        {section.isDone ? <CheckCircle2 size={14} /> : <div className="check-dot" />}
                      </div>
                      <span className="check-label">
                        {lang === 'en' ? section.id : (
                          section.id === 'Personal' ? 'ব্যক্তিগত' :
                          section.id === 'Academic' ? 'একাডেমিক' :
                          section.id === 'Address' ? 'ঠিকানা' : 'মিডিয়া'
                        )}
                      </span>
                      <small style={{ marginLeft: 'auto', color: '#9ca3af' }}>{section.count}/{section.total}</small>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '1.5rem', textAlign: 'left', fontSize: '0.8rem', color: '#6b7280' }}>
                  {completion.percentage < 100 
                    ? (lang === 'en' ? 'Fill all fields for 100% completion.' : '১০০% সম্পন্ন করার জন্য সব ঘর পূরণ করুন।')
                    : (lang === 'en' ? 'Excellent! Your profile is complete.' : 'চমৎকার! আপনার প্রোফাইল সম্পূর্ণ।')
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
