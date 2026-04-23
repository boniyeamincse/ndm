import { useEffect, useMemo, useState } from 'react';
import { Mail, Phone, Shield, User } from 'lucide-react';
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
    role: user.role || user.roleKey || 'Admin',
    roleKey: user.roleKey || 'admin',
  };
}

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
          name: user.name || member.full_name || profile.name,
          email: user.email || profile.email,
          phone: member.mobile || user.phone || profile.phone,
          role: user.role_name || user.role || profile.role,
          roleKey: user.role_type || profile.roleKey,
        };

        if (alive) {
          setProfile(nextProfile);
          localStorage.setItem('ndm_user', JSON.stringify({
            ...getStoredAdminUser(),
            ...user,
            name: nextProfile.name,
            email: nextProfile.email,
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
            </div>

            {loading ? <p className="adm-profile-card__note">Loading profile...</p> : null}
            {!loading && error ? <p className="adm-profile-card__error">{error}</p> : null}

            <div className="adm-profile-grid">
              <div className="adm-profile-field">
                <span className="adm-profile-field__label"><User size={14} /> Name</span>
                <strong>{profile.name || 'N/A'}</strong>
              </div>
              <div className="adm-profile-field">
                <span className="adm-profile-field__label"><Mail size={14} /> Email</span>
                <strong>{profile.email || 'N/A'}</strong>
              </div>
              <div className="adm-profile-field">
                <span className="adm-profile-field__label"><Phone size={14} /> Phone</span>
                <strong>{profile.phone || 'N/A'}</strong>
              </div>
              <div className="adm-profile-field">
                <span className="adm-profile-field__label"><Shield size={14} /> Role</span>
                <strong>{profile.role || profile.roleKey || 'Admin'}</strong>
              </div>
            </div>
          </section>
        </PageSection>
      </PageContainer>
    </AdminContentWrapper>
  );
}
