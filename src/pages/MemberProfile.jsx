import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, GraduationCap, Briefcase, FileEdit, AlertCircle, CheckCircle2, Camera, Upload } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { memberApi } from '../services/memberApi';
import './MemberProfile.css';

export default function MemberProfile() {
  const { t, lang } = useLang();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('ndm_user') || '{}'));
  const [member, setMember] = useState(null);
  const [fetching, setFetching] = useState(true);

  useScrollReveal('.reveal', [fetching]);
  const [requestingUpdate, setRequestingUpdate] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [idCard, setIdCard] = useState(null);
  const [idCardBusy, setIdCardBusy] = useState(false);
  const [idCardError, setIdCardError] = useState('');

  // Photo upload
  const photoInputRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [photoSuccess, setPhotoSuccess] = useState('');

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setPhotoError(lang === 'en' ? 'Only JPG, PNG, or WebP images are allowed.' : 'শুধুমাত্র JPG, PNG বা WebP ছবি গ্রহণযোগ্য।');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setPhotoError(lang === 'en' ? 'Image must be smaller than 2 MB.' : 'ছবির আকার ২ MB-এর বেশি হওয়া যাবে না।');
      return;
    }

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhotoError('');
    setPhotoSuccess('');
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) return;
    setPhotoUploading(true);
    setPhotoError('');
    setPhotoSuccess('');

    try {
      const json = await memberApi.uploadMyProfilePhoto(photoFile);
      const freshPhotoUrl = json?.data?.photo_url;

      if (!freshPhotoUrl) {
        throw new Error(lang === 'en' ? 'Upload completed but no photo URL was returned.' : 'আপলোড সম্পন্ন হয়েছে, কিন্তু ছবির লিংক পাওয়া যায়নি।');
      }

      const bustUrl = `${freshPhotoUrl}${freshPhotoUrl.includes('?') ? '&' : '?'}t=${Date.now()}`;

      setMember(prev => (prev ? { ...prev, photo_url: bustUrl } : prev));
      setUser(prev => {
        const nextUser = {
          ...prev,
          profile_photo_url: bustUrl,
          photo_url: bustUrl,
        };
        localStorage.setItem('ndm_user', JSON.stringify(nextUser));
        window.dispatchEvent(new Event('auth-changed'));
        return nextUser;
      });

      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }

      setPhotoPreview(null);
      setPhotoFile(null);
      setPhotoSuccess(lang === 'en' ? 'Profile photo updated!' : 'প্রোফাইল ফটো আপডেট হয়েছে!');
    } catch (err) {
      setPhotoError(err?.message || (lang === 'en' ? 'Upload failed. Please try again.' : 'আপলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।'));
    } finally {
      setPhotoUploading(false);
    }
  };

  const handlePhotoDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handlePhotoSelect({ target: { files: [file] } });
  };

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const [profileJson, idCardJson] = await Promise.all([
          memberApi.getMeProfile(),
          memberApi.getMemberIdCard().catch(() => null),
        ]);

        if (profileJson?.data) {
          setUser(profileJson.data.user);
          setMember(profileJson.data.member);
          // Also update local storage to keep it sync
          localStorage.setItem('ndm_user', JSON.stringify(profileJson.data.user));
        }

        if (idCardJson?.data) {
          setIdCard(idCardJson.data);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setFetching(false);
      }
    }
    fetchProfile();
  }, []);

  // Example of what we might want to request updates for
  const [updateForm, setUpdateForm] = useState({
    reason: '',
    changes: ''
  });

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');

    try {
      const res = await fetch('/api/v1/me/profile-update-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ndm_token')}`
        },
        body: JSON.stringify({
          request_type: 'other',
          requested_changes: {
            details: updateForm.changes
          },
          submitted_note: updateForm.reason
        })
      });

      const json = await res.json();
      if (res.ok) {
        setUpdateSuccess(true);
        setRequestingUpdate(false);
      } else {
        setError(json.message || 'Failed to submit update request.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setBusy(false);
    }
  };

  const InfoField = ({ icon: Icon, label, value }) => (
    <div className="profile-field">
      <span className="profile-field__label">
        {Icon && <Icon size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />}
        {label}
      </span>
      <span className="profile-field__value">{value || '-'}</span>
    </div>
  );

  if (fetching) {
    return (
      <main>
        <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
          <p>{lang === 'en' ? 'Loading profile...' : 'প্রোফাইল লোড হচ্ছে...'}</p>
        </div>
      </main>
    );
  }

  const getGeoName = (field) => {
    if (!member) return null;
    return lang === 'bn' ? member[`${field}_name_bn`] : member[`${field}_name_en`];
  };

  const currentPhoto = photoPreview || member?.photo_url || user?.profile_photo_url || user?.profile_photo_data_url || null;

  const handleIdCardDownload = async () => {
    setIdCardBusy(true);
    setIdCardError('');
    try {
      const blob = await memberApi.downloadMemberIdCard();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${member?.member_no || 'member-id-card'}.svg`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setIdCardError(err?.message || 'Could not download member ID card.');
    } finally {
      setIdCardBusy(false);
    }
  };

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">{t('nav_home')}</Link><span>/</span>
            <Link to="/member/dashboard">{t('nav_dashboard')}</Link><span>/</span>
            <span>{lang === 'en' ? 'My Profile' : 'আমার প্রোফাইল'}</span>
          </div>
          <h1>{lang === 'en' ? 'Member Profile' : 'সদস্য প্রোফাইল'}</h1>
          <p>{lang === 'en' ? 'View and manage your membership details.' : 'আপনার সদস্যপদ তথ্য দেখুন এবং পরিচালনা করুন।'}</p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container profile-view-wrap">
          <div className="profile-card card reveal">
            <div className="profile-card__header">
              <div className="profile-card__title">
                <User size={24} />
                <span>{lang === 'en' ? 'Personal Information' : 'ব্যক্তিগত তথ্য'}</span>
              </div>
              <span className={`status-badge status-badge--${member?.status || 'pending'}`}>
                {member?.status || 'Pending'}
              </span>
            </div>

            {/* ── Photo Upload ── */}
            <div className="profile-photo-section">
              <div
                className={`profile-photo-drop${photoPreview ? ' has-preview' : ''}`}
                onDragOver={e => e.preventDefault()}
                onDrop={handlePhotoDrop}
                onClick={() => photoInputRef.current?.click()}
                title={lang === 'en' ? 'Click or drag to change photo' : 'ফটো পরিবর্তন করতে ক্লিক বা ড্র্যাগ করুন'}
              >
                {currentPhoto ? (
                  <img
                    src={currentPhoto}
                    alt="Profile"
                    className="profile-photo-img"
                  />
                ) : (
                  <div className="profile-photo-placeholder">
                    <User size={48} />
                  </div>
                )}
                <div className="profile-photo-overlay">
                  <Camera size={20} />
                  <span>{lang === 'en' ? 'Change Photo' : 'ফটো পরিবর্তন'}</span>
                </div>
              </div>

              <div className="profile-photo-meta">
                <p className="profile-photo-name">{member?.full_name || user?.name}</p>
                <p className="profile-photo-id">{member?.member_no ? `# ${member.member_no}` : ''}</p>

                {photoFile && (
                  <button
                    className="btn btn-primary profile-photo-upload-btn"
                    onClick={handlePhotoUpload}
                    disabled={photoUploading}
                  >
                    {photoUploading
                      ? <><span className="profile-photo-spinner" /> {lang === 'en' ? 'Uploading...' : 'আপলোড হচ্ছে...'}</>
                      : <><Upload size={16} /> {lang === 'en' ? 'Save Photo' : 'ফটো সেভ করুন'}</>}
                  </button>
                )}

                {photoError && (
                  <div className="form-alert form-alert--error profile-photo-msg">
                    <AlertCircle size={14} /><span>{photoError}</span>
                  </div>
                )}
                {photoSuccess && (
                  <div className="form-alert form-alert--success profile-photo-msg">
                    <CheckCircle2 size={14} /><span>{photoSuccess}</span>
                  </div>
                )}

                <p className="profile-photo-hint">
                  {lang === 'en' ? 'JPG, PNG or WebP · max 2 MB' : 'JPG, PNG বা WebP · সর্বোচ্চ ২ MB'}
                </p>
              </div>
            </div>

            <input
              ref={photoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="profile-photo-input"
              onChange={handlePhotoSelect}
            />

            <div className="profile-grid">
              <InfoField label={lang === 'en' ? 'Full Name' : 'পূর্ণ নাম'} value={member?.full_name || user?.name} />
              <InfoField label={lang === 'en' ? 'Email' : 'ইমেইল'} value={user?.email} icon={Mail} />
              <InfoField label={lang === 'en' ? 'Mobile' : 'মোবাইল'} value={member?.mobile || user?.phone} icon={Phone} />
              <InfoField label={lang === 'en' ? 'Gender' : 'লিঙ্গ'} value={member?.gender} />
              <InfoField label={lang === 'en' ? 'Blood Group' : 'রক্তের গ্রুপ'} value={member?.blood_group} />
            </div>
          </div>

          <div className="profile-card card reveal">
            <div className="profile-card__header">
              <div className="profile-card__title">
                <MapPin size={24} />
                <span>{lang === 'en' ? 'Address Information' : 'ঠিকানা তথ্য'}</span>
              </div>
            </div>

            <div className="profile-grid">
              <InfoField label={lang === 'en' ? 'Division' : 'বিভাগ'} value={getGeoName('division')} />
              <InfoField label={lang === 'en' ? 'District' : 'জেলা'} value={getGeoName('district')} />
              <InfoField label={lang === 'en' ? 'Upazila' : 'উপজেলা'} value={getGeoName('upazila')} />
              <InfoField label={lang === 'en' ? 'Union' : 'ইউনিয়ন'} value={getGeoName('union')} />
              <InfoField label={lang === 'en' ? 'Village / Area' : 'গ্রাম / এলাকা'} value={member?.village_area} />
              <InfoField label={lang === 'en' ? 'Post Office' : 'ডাকঘর'} value={member?.post_office} />
              <InfoField label={lang === 'en' ? 'Address Line' : 'ঠিকানা লাইন'} value={member?.address_line} />
            </div>
          </div>

          <div className="profile-card card reveal">
            <div className="profile-card__header">
              <div className="profile-card__title">
                <GraduationCap size={24} />
                <span>{lang === 'en' ? 'Academic & Professional' : 'একাডেমিক এবং পেশাগত'}</span>
              </div>
            </div>

            <div className="profile-grid">
              <InfoField label={lang === 'en' ? 'Institution' : 'শিক্ষা প্রতিষ্ঠান'} value={member?.educational_institution} icon={GraduationCap} />
              <InfoField label={lang === 'en' ? 'Department' : 'বিভাগ'} value={member?.department} />
              <InfoField label={lang === 'en' ? 'Academic Year' : 'শিক্ষাবর্ষ'} value={member?.academic_year ? t(member.academic_year) : '-'} />
              <InfoField label={lang === 'en' ? 'Occupation' : 'পেশা'} value={member?.occupation} icon={Briefcase} />
            </div>
          </div>

          <div className="profile-card card reveal">
            <div className="profile-card__header">
              <div className="profile-card__title">
                <Briefcase size={24} />
                <span>{lang === 'en' ? 'Member ID Card' : 'সদস্য আইডি কার্ড'}</span>
              </div>
              <button type="button" className="btn btn-outline btn-sm" onClick={handleIdCardDownload} disabled={idCardBusy || !idCard}>
                {idCardBusy ? (lang === 'en' ? 'Preparing...' : 'প্রস্তুত হচ্ছে...') : (lang === 'en' ? 'Download Card' : 'কার্ড ডাউনলোড')}
              </button>
            </div>

            {idCardError && (
              <div className="form-alert form-alert--error" style={{ marginBottom: '1rem' }}>
                <AlertCircle size={16} />
                <span>{idCardError}</span>
              </div>
            )}

            {idCard?.svg ? (
              <div className="profile-id-card-preview" dangerouslySetInnerHTML={{ __html: idCard.svg }} />
            ) : (
              <div className="profile-id-card-empty">
                {lang === 'en' ? 'Member ID card preview is not available yet.' : 'সদস্য আইডি কার্ড প্রিভিউ এখনো উপলব্ধ নয়।'}
              </div>
            )}
          </div>

          <div className="update-request-section reveal">
            <div className="update-request-header">
              <h3>{lang === 'en' ? 'Need to Update Your Profile?' : 'প্রোফাইল আপডেট করতে চান?'}</h3>
              <p>
                {lang === 'en' 
                  ? 'All profile changes require administrative review. Please submit a request detailing the changes you need.'
                  : 'প্রোফাইলের সকল পরিবর্তন প্রশাসনিক পর্যালোচনার প্রয়োজন। অনুগ্রহ করে আপনার প্রয়োজনীয় পরিবর্তনের বিবরণ দিয়ে একটি অনুরোধ জমা দিন।'}
              </p>
            </div>

            {updateSuccess ? (
              <div className="form-alert form-alert--success">
                <CheckCircle2 size={16} />
                <span>{lang === 'en' ? 'Update request submitted successfully! An admin will review it soon.' : 'আপডেট অনুরোধ সফলভাবে জমা হয়েছে! একজন এডমিন শীঘ্রই এটি পর্যালোচনা করবেন।'}</span>
              </div>
            ) : requestingUpdate ? (
              <form onSubmit={handleUpdateSubmit} className="update-request-form">
                {error && (
                  <div className="form-alert form-alert--error" style={{ marginBottom: '1rem' }}>
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}
                <div className="form-group">
                  <label>{lang === 'en' ? 'Describe the changes needed' : 'প্রয়োজনীয় পরিবর্তনগুলো বর্ণনা করুন'}</label>
                  <textarea 
                    className="form-control" 
                    rows={4} 
                    required 
                    value={updateForm.changes}
                    onChange={e => setUpdateForm(f => ({ ...f, changes: e.target.value }))}
                    placeholder={lang === 'en' ? 'e.g., Update mobile number to 017...' : 'যেমন: মোবাইল নম্বর পরিবর্তন করে ০১৭... করতে চাই'}
                  />
                </div>
                <div className="form-group">
                  <label>{lang === 'en' ? 'Reason for update' : 'আপডেটের কারণ'}</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    required 
                    value={updateForm.reason}
                    onChange={e => setUpdateForm(f => ({ ...f, reason: e.target.value }))}
                    placeholder={lang === 'en' ? 'Reason for this change' : 'এই পরিবর্তনের কারণ'}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary" disabled={busy}>
                    {busy ? (lang === 'en' ? 'Submitting...' : 'জমা হচ্ছে...') : (lang === 'en' ? 'Submit Request' : 'অনুরোধ জমা দিন')}
                  </button>
                  <button type="button" className="btn btn-outline" onClick={() => setRequestingUpdate(false)}>
                    {lang === 'en' ? 'Cancel' : 'বাতিল'}
                  </button>
                </div>
              </form>
            ) : (
              <button className="btn btn-primary" onClick={() => setRequestingUpdate(true)}>
                <FileEdit size={18} style={{ marginRight: '8px' }} />
                {lang === 'en' ? 'Request Profile Update' : 'প্রোফাইল আপডেটের অনুরোধ করুন'}
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
