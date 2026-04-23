import { useEffect, useState } from 'react';
import { ShieldCheck, BellRing, KeyRound, Save } from 'lucide-react';
import { memberApi } from '../../services/memberApi';

export default function MemberSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    language: 'en',
    timezone: 'Asia/Dhaka',
    notification_email_enabled: true,
    notification_sms_enabled: false,
    notification_push_enabled: false,
    show_email: false,
    show_phone: false,
    show_address: false,
    profile_visibility: 'members_only',
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const json = await memberApi.getAccountSettings();
        const data = json?.data || {};
        setForm(prev => ({ ...prev, ...data }));
      } catch (err) {
        setError(err?.message || 'Failed to load settings.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const setField = (key, value) => {
    setSuccess('');
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const onSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await memberApi.updateAccountSettings(form);
      setSuccess('Settings saved successfully.');
    } catch (err) {
      setError(err?.message || 'Could not save settings.');
    } finally {
      setSaving(false);
    }
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
        <button type="button" className="btn btn-primary btn-sm" onClick={onSave} disabled={saving}>
          <Save size={14} /> {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {error && <div className="member-inline-alert"><span>{error}</span></div>}
      {success && <div className="form-alert form-alert--success" style={{ marginBottom: '.9rem' }}><span>{success}</span></div>}

      <div className="member-grid">
        <article className="member-card">
          <p className="member-card__title"><ShieldCheck size={16} style={{ verticalAlign: 'text-bottom' }} /> Privacy</p>
          <p className="member-card__meta">Profile visibility and contact field exposure</p>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>
            <input type="checkbox" checked={form.show_email} onChange={e => setField('show_email', e.target.checked)} /> Show Email
          </label>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>
            <input type="checkbox" checked={form.show_phone} onChange={e => setField('show_phone', e.target.checked)} /> Show Phone
          </label>
          <label style={{ display: 'block' }}>
            <input type="checkbox" checked={form.show_address} onChange={e => setField('show_address', e.target.checked)} /> Show Address
          </label>
        </article>

        <article className="member-card">
          <p className="member-card__title"><BellRing size={16} style={{ verticalAlign: 'text-bottom' }} /> Notifications</p>
          <p className="member-card__meta">Email, SMS, and Push preferences</p>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>
            <input type="checkbox" checked={form.notification_email_enabled} onChange={e => setField('notification_email_enabled', e.target.checked)} /> Email Notifications
          </label>
          <label style={{ display: 'block', marginBottom: '.5rem' }}>
            <input type="checkbox" checked={form.notification_sms_enabled} onChange={e => setField('notification_sms_enabled', e.target.checked)} /> SMS Notifications
          </label>
          <label style={{ display: 'block' }}>
            <input type="checkbox" checked={form.notification_push_enabled} onChange={e => setField('notification_push_enabled', e.target.checked)} /> Push Notifications
          </label>
        </article>

        <article className="member-card">
          <p className="member-card__title"><KeyRound size={16} style={{ verticalAlign: 'text-bottom' }} /> Change Password</p>
          <p className="member-card__meta">Use account security endpoint for password update.</p>
          <p>This section is ready for password form wiring in Phase 3 API expansion.</p>
        </article>
      </div>
    </div>
  );
}
