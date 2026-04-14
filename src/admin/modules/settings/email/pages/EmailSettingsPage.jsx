import SettingsFieldGroup from '../../shared/components/SettingsFieldGroup';
import SettingsFormPage from '../../shared/components/SettingsFormPage';
import SettingsSectionCard from '../../shared/components/SettingsSectionCard';
import { useEmailSettings, useEmailSettingsActions } from '../../shared/hooks/useSettings';

export default function EmailSettingsPage() {
  const emailActions = useEmailSettingsActions();

  return (
    <SettingsFormPage
      title="Email Settings"
      subtitle="Configure mail transport, sender identity, and delivery behavior."
      breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Settings' }, { label: 'Email Settings' }]}
      hook={useEmailSettings}
      extraAction={(form) => (
        <button
          type="button"
          className="ndm-btn ndm-btn--ghost"
          disabled={emailActions.busyAction === 'send-test-email'}
          onClick={() => emailActions.sendTestEmail({ test_email_address: form.test_email_address || 'admin@ndm.test' })}
        >
          Send Test Email
        </button>
      )}
      renderSections={(form, updateField) => (
        <>
          {emailActions.actionError ? <div className="stg-feedback stg-feedback--error">{emailActions.actionError}</div> : null}
          {emailActions.actionMessage ? <div className="stg-feedback">{emailActions.actionMessage}</div> : null}
          <SettingsSectionCard title="Mail Transport">
            <SettingsFieldGroup title="Connection" description="SMTP and sender configuration for transactional email.">
              <div className="ndm-form-grid">
                <label>Mail Driver<select className="ndm-input" value={form.mail_driver} onChange={(e) => updateField('mail_driver', e.target.value)}><option value="smtp">SMTP</option><option value="ses">SES</option><option value="mailgun">Mailgun</option></select></label>
                <label>Host<input className="ndm-input" value={form.host} onChange={(e) => updateField('host', e.target.value)} /></label>
                <label>Port<input type="number" className="ndm-input" value={form.port} onChange={(e) => updateField('port', Number(e.target.value))} /></label>
                <label>Username<input className="ndm-input" value={form.username} onChange={(e) => updateField('username', e.target.value)} /></label>
                <label>Password<input type="password" className="ndm-input" value={form.password} onChange={(e) => updateField('password', e.target.value)} /></label>
                <label>Encryption<select className="ndm-input" value={form.encryption} onChange={(e) => updateField('encryption', e.target.value)}><option value="tls">TLS</option><option value="ssl">SSL</option><option value="none">None</option></select></label>
                <label>From Name<input className="ndm-input" value={form.from_name} onChange={(e) => updateField('from_name', e.target.value)} /></label>
                <label>From Email<input className="ndm-input" value={form.from_email} onChange={(e) => updateField('from_email', e.target.value)} /></label>
                <label className="ndm-checkbox-row"><input type="checkbox" checked={Boolean(form.queue_email)} onChange={(e) => updateField('queue_email', e.target.checked)} /><span>Queue email delivery</span></label>
                <label>Test Email Address<input data-settings-test-email className="ndm-input" value={form.test_email_address} onChange={(e) => updateField('test_email_address', e.target.value)} /></label>
              </div>
            </SettingsFieldGroup>
          </SettingsSectionCard>
        </>
      )}
    />
  );
}
