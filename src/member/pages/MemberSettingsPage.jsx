import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, BellRing, KeyRound, Save, Globe, Clock3 } from 'lucide-react';
import { memberApi } from '../../services/memberApi';

export default function MemberSettingsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [savingKey, setSavingKey] = useState('');
  const [account, setAccount] = useState({
    language: 'en',
    timezone: 'Asia/Dhaka',
  });
  const [notifications, setNotifications] = useState({
    notification_email_enabled: true,
    notification_sms_enabled: false,
    notification_push_enabled: false,
  });
  const [privacy, setPrivacy] = useState({
    show_email: false,
    show_phone: false,
    show_address: false,
    profile_visibility: 'members_only',
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const json = await memberApi.getMemberSettings();
        const data = json?.data || {};
        setAccount(prev => ({ ...prev, ...(data.account || {}) }));
        setPrivacy(prev => ({ ...prev, ...(data.privacy || {}) }));
        setNotifications(prev => ({ ...prev, ...(data.notifications || {}) }));
      } catch (err) {
        setError(err?.message || 'Failed to load settings.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const setFormMessage = (type, message) => {
    setError(type === 'error' ? message : '');
    setSuccess(type === 'success' ? message : '');
  };

  const saveSection = async (sectionKey, runner, successMessage) => {
    setSavingKey(sectionKey);
    setFormMessage('', '');
    try {
      await runner();
      setFormMessage('success', successMessage);
    } catch (err) {
      setFormMessage('error', err?.message || 'Could not save settings.');
    } finally {
      setSavingKey('');
    }
  };

  const updateAccountField = (key, value) => {
    setSuccess('');
    setAccount(prev => ({ ...prev, [key]: value }));
  };

  const updatePrivacyField = (key, value) => {
    setSuccess('');
    setPrivacy(prev => ({ ...prev, [key]: value }));
  };

  const updateNotificationField = (key, value) => {
    setSuccess('');
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const updatePasswordField = (key, value) => {
    setSuccess('');
    setPasswordForm(prev => ({ ...prev, [key]: value }));
  };

  const handlePasswordSave = async () => {
    await saveSection(
      'password',
      async () => {
        await memberApi.updateMemberPassword(passwordForm);
        localStorage.removeItem('ndm_token');
        localStorage.removeItem('ndm_user');
        window.dispatchEvent(new Event('auth-changed'));
        navigate('/login?reset=success', { replace: true });
      },
      'Password updated successfully.',
    );
  };

  if (loading) {
    return (
      <div className="member-panel">
        <div className="member-skeleton" style={{ width: '34%', marginBottom: '.8rem' }} />
        <div className="member-skeleton" style={{ width: '80%', marginBottom: '.5rem' }} />
        <div className="member-skeleton" style={{ width: '72%', marginBottom: '.5rem' }} />
        <div className="member-skeleton" style={{ width: '68%' }} />
      </div>
    );
  }

  return (
    <div className="member-panel">
      <div className="member-page-head">
        <div>
          <h1>Settings</h1>
          <p>Account, privacy, and notification preferences.</p>
        </div>
      </div>

      {error && <div className="member-inline-alert"><span>{error}</span></div>}
      {success && <div className="form-alert form-alert--success" style={{ marginBottom: '.9rem' }}><span>{success}</span></div>}

      <div className="member-grid">
        <article className="member-card">
          <p className="member-card__title"><Globe size={16} style={{ verticalAlign: 'text-bottom' }} /> Account</p>
          <p className="member-card__meta">Language and timezone preferences</p>
          <div className="form-group">
            <label htmlFor="settings-language">Language</label>
            <select id="settings-language" className="form-control" value={account.language || 'en'} onChange={e => updateAccountField('language', e.target.value)}>
              <option value="en">English</option>
              <option value="bn">Bangla</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="settings-timezone">Timezone</label>
            <input id="settings-timezone" className="form-control" value={account.timezone || 'Asia/Dhaka'} onChange={e => updateAccountField('timezone', e.target.value)} />
          </div>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => saveSection('account', () => memberApi.updateMemberAccountSettings(account), 'Account settings saved successfully.')} disabled={savingKey === 'account'}>
            <Save size={14} /> {savingKey === 'account' ? 'Saving...' : 'Save Account'}
          </button>
        </article>

        <article className="member-card">
          <p className="member-card__title"><ShieldCheck size={16} style={{ verticalAlign: 'text-bottom' }} /> Privacy</p>
          <p className="member-card__meta">Profile visibility and contact field exposure</p>
          <div className="form-group">
            <label htmlFor="settings-visibility">Profile Visibility</label>
            <select id="settings-visibility" className="form-control" value={privacy.profile_visibility || 'members_only'} onChange={e => updatePrivacyField('profile_visibility', e.target.value)}>
              <option value="public">Public</option>
              <option value="members_only">Members Only</option>
              <option value="private">Private</option>
            </select>
          </div>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>
            <input type="checkbox" checked={privacy.show_email} onChange={e => updatePrivacyField('show_email', e.target.checked)} /> Show Email
          </label>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>
            <input type="checkbox" checked={privacy.show_phone} onChange={e => updatePrivacyField('show_phone', e.target.checked)} /> Show Phone
          </label>
          <label style={{ display: 'block', marginBottom: '1rem' }}>
            <input type="checkbox" checked={privacy.show_address} onChange={e => updatePrivacyField('show_address', e.target.checked)} /> Show Address
          </label>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => saveSection('privacy', () => memberApi.updateMemberPrivacySettings(privacy), 'Privacy settings saved successfully.')} disabled={savingKey === 'privacy'}>
            <Save size={14} /> {savingKey === 'privacy' ? 'Saving...' : 'Save Privacy'}
          </button>
        </article>

        <article className="member-card">
          <p className="member-card__title"><BellRing size={16} style={{ verticalAlign: 'text-bottom' }} /> Notifications</p>
          <p className="member-card__meta">Email, SMS, and Push preferences</p>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>
            <input type="checkbox" checked={notifications.notification_email_enabled} onChange={e => updateNotificationField('notification_email_enabled', e.target.checked)} /> Email Notifications
          </label>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>
            <input type="checkbox" checked={notifications.notification_sms_enabled} onChange={e => updateNotificationField('notification_sms_enabled', e.target.checked)} /> SMS Notifications
          </label>
          <label style={{ display: 'block', marginBottom: '1rem' }}>
            <input type="checkbox" checked={notifications.notification_push_enabled} onChange={e => updateNotificationField('notification_push_enabled', e.target.checked)} /> Push Notifications
          </label>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => saveSection('notifications', () => memberApi.updateMemberNotificationSettings(notifications), 'Notification settings saved successfully.')} disabled={savingKey === 'notifications'}>
            <Save size={14} /> {savingKey === 'notifications' ? 'Saving...' : 'Save Notifications'}
          </button>
        </article>

        <article className="member-card">
          <p className="member-card__title"><KeyRound size={16} style={{ verticalAlign: 'text-bottom' }} /> Change Password</p>
          <p className="member-card__meta">This uses the dedicated member password endpoint.</p>
          <div className="form-group">
            <label htmlFor="current-password">Current Password</label>
            <input id="current-password" type="password" className="form-control" value={passwordForm.current_password} onChange={e => updatePasswordField('current_password', e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="new-password">New Password</label>
            <input id="new-password" type="password" className="form-control" value={passwordForm.password} onChange={e => updatePasswordField('password', e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input id="confirm-password" type="password" className="form-control" value={passwordForm.password_confirmation} onChange={e => updatePasswordField('password_confirmation', e.target.value)} />
          </div>
          <button type="button" className="btn btn-primary btn-sm" onClick={handlePasswordSave} disabled={savingKey === 'password'}>
            <Clock3 size={14} /> {savingKey === 'password' ? 'Saving...' : 'Update Password'}
          </button>
        </article>
      </div>
    </div>
  );
}
