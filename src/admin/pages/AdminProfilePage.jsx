import { useEffect, useMemo, useRef, useState } from 'react';
import { Camera, Mail, Phone, Save, Shield, User } from 'lucide-react';
import AdminContentWrapper, { PageContainer, PageSection } from '../components/AdminContentWrapper';
import AdminPageHeader from '../components/AdminPageHeader';
import { adminApi } from '../services/adminApi';
import { getStoredAdminUser } from '../mock/layoutMock';

function getFallbackProfile() {
  const user = getStoredAdminUser();
  return {
    name: user.name || 'Admin User',
    email: user.email || 'admin@ndm.local',
    phone: user.phone || user.mobile || '',
    full_name: user.name || '',
    address_line: '',
    bio: '',
    photo_url: '',
    role: user.role || user.roleKey || 'Admin',
    roleKey: user.roleKey || 'admin',
  };
}

export default function AdminProfilePage() {
  const photoInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [profile, setProfile] = useState(() => getFallbackProfile());

  useEffect(() => {
    let alive = true;

    async function loadProfile() {
      setLoading(true);
      setError('');

      try {
        const payload = await adminApi.request('/me/profile');
        const data = payload?.data || payload || {};
        const user = data.user || {};
        const member = data.member || {};

        const nextProfile = {
          name: user.name || member.full_name || '',
          full_name: member.full_name || user.name || '',
          email: user.email || '',
          phone: member.mobile || user.phone || '',
          address_line: member.address_line || '',
          bio: member.bio || '',
          photo_url: user.profile_photo_url || '',
          role: Array.isArray(user.roles) && user.roles.length ? user.roles[0] : 'Admin',
          roleKey: Array.isArray(user.roles) && user.roles.length ? user.roles[0] : 'admin',
        };

        if (alive) {
          setProfile(nextProfile);
          localStorage.setItem('ndm_user', JSON.stringify({
            ...getStoredAdminUser(),
            ...user,
            name: nextProfile.name,
            email: nextProfile.email,
            phone: nextProfile.phone,
            role: nextProfile.role,
            roleKey: nextProfile.roleKey,
          }));
        }
      } catch (err) {
        if (alive) {
          setError(err?.message || 'Could not load profile from server. Showing local profile data.');
          setProfile(getFallbackProfile());
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      alive = false;
    };
  }, []);

  function updateField(field, value) {
    setProfile((current) => ({ ...current, [field]: value }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setFeedback('');

    try {
      await adminApi.request('/me/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name: profile.name,
          full_name: profile.full_name,
          phone: profile.phone,
          address_line: profile.address_line,
          bio: profile.bio,
        }),
      });

      localStorage.setItem('ndm_user', JSON.stringify({
        ...getStoredAdminUser(),
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
      }));

      setFeedback('Profile updated successfully.');
    } catch (err) {
      setError(err?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  }

  async function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const token = localStorage.getItem('ndm_token');
    if (!token) {
      setError('Please sign in again to upload a profile photo.');
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);

    setUploadingPhoto(true);
    setError('');
    setFeedback('');

    try {
      const response = await fetch('/api/v1/me/profile/photo', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.message || `Photo upload failed (${response.status})`);
      }

      const photoUrl = payload?.data?.photo_url || '';
      setProfile((current) => ({ ...current, photo_url: photoUrl }));
      setFeedback('Profile photo updated successfully.');
    } catch (err) {
      setError(err?.message || 'Failed to upload profile photo.');
    } finally {
      setUploadingPhoto(false);
    }
  }

  const initials = useMemo(() => (
    String(profile.name || 'AU')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
  ), [profile.name]);

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title="Admin Profile"
          subtitle="View your account identity and contact details."
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'User' },
            { label: 'Profile' },
          ]}
        />

        <PageSection>
          <section className="adm-profile-card">
            <div className="adm-profile-card__header">
              <div className="adm-profile-card__avatar" aria-hidden="true">{initials}</div>
              <div>
                <h2 className="adm-profile-card__title">{profile.name || 'Admin User'}</h2>
                <p className="adm-profile-card__sub">Signed in administrator account</p>
              </div>
              <div className="adm-profile-card__media">
                {profile.photo_url ? <img src={profile.photo_url} alt="Profile" className="adm-profile-photo" /> : null}
                <button
                  type="button"
                  className="ndm-btn ndm-btn--ghost"
                  onClick={() => photoInputRef.current?.click()}
                  disabled={uploadingPhoto}
                >
                  <Camera size={14} />
                  <span>{uploadingPhoto ? 'Uploading...' : 'Change Photo'}</span>
                </button>
                <input ref={photoInputRef} type="file" accept="image/*" className="adm-profile-photo-input" onChange={handlePhotoChange} />
              </div>
            </div>

            {loading ? <p className="adm-profile-card__note">Loading profile...</p> : null}
            {!loading && error ? <p className="adm-profile-card__error">{error}</p> : null}
            {!loading && feedback ? <p className="adm-profile-card__success">{feedback}</p> : null}

            {!loading ? (
              <form className="adm-profile-form" onSubmit={handleSave}>
                <div className="adm-profile-grid">
                  <label className="adm-profile-field">
                    <span className="adm-profile-field__label"><User size={14} /> Name</span>
                    <input className="ndm-input" value={profile.name || ''} onChange={(event) => updateField('name', event.target.value)} />
                  </label>
                  <label className="adm-profile-field">
                    <span className="adm-profile-field__label"><Mail size={14} /> Email (read only)</span>
                    <input className="ndm-input" value={profile.email || ''} readOnly disabled />
                  </label>
                  <label className="adm-profile-field">
                    <span className="adm-profile-field__label"><Phone size={14} /> Phone</span>
                    <input className="ndm-input" value={profile.phone || ''} onChange={(event) => updateField('phone', event.target.value)} />
                  </label>
                  <div className="adm-profile-field">
                    <span className="adm-profile-field__label"><Shield size={14} /> Role</span>
                    <strong>{profile.role || profile.roleKey || 'Admin'}</strong>
                  </div>
                  <label className="adm-profile-field adm-profile-field--wide">
                    <span className="adm-profile-field__label">Address</span>
                    <input className="ndm-input" value={profile.address_line || ''} onChange={(event) => updateField('address_line', event.target.value)} />
                  </label>
                  <label className="adm-profile-field adm-profile-field--wide">
                    <span className="adm-profile-field__label">Bio</span>
                    <textarea className="ndm-input" rows={4} value={profile.bio || ''} onChange={(event) => updateField('bio', event.target.value)} />
                  </label>
                </div>
                <div className="adm-profile-form__actions">
                  <button type="submit" className="ndm-btn ndm-btn--primary" disabled={saving}>
                    <Save size={14} />
                    <span>{saving ? 'Saving...' : 'Save Profile'}</span>
                  </button>
                </div>
              </form>
            ) : null}
          </section>
        </PageSection>
      </PageContainer>
    </AdminContentWrapper>
  );
}
