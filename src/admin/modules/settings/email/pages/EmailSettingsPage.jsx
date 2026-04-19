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
          <section className="stg-page-hero stg-page-hero--sky" aria-label="Email settings overview">
            <div className="stg-page-hero__content">
              <p className="stg-page-hero__eyebrow">Delivery Infrastructure</p>
              <h2>Mailer Configuration</h2>
              <p>Configure transport, sender identity, and testing flow before enabling production campaigns.</p>
            </div>
            <div className="stg-page-hero__stats" role="list" aria-label="Email settings highlights">
              <div className="stg-page-stat" role="listitem">
                <span>Driver</span>
                <strong>{String(form.mail_driver || '').toUpperCase() || 'N/A'}</strong>
              </div>
              <div className="stg-page-stat" role="listitem">
                <span>Encryption</span>
                <strong>{String(form.encryption || '').toUpperCase() || 'N/A'}</strong>
              </div>
              <div className="stg-page-stat" role="listitem">
                <span>Queued</span>
                <strong>{form.queue_email ? 'Enabled' : 'Disabled'}</strong>
              </div>
            </div>
          </section>

          {emailActions.actionError ? <div className="stg-feedback stg-feedback--error">{emailActions.actionError}</div> : null}
          {emailActions.actionMessage ? <div className="stg-feedback">{emailActions.actionMessage}</div> : null}
          <SettingsSectionCard title="Mail Transport">
            <SettingsFieldGroup title="Connection" description="SMTP and sender configuration for transactional email.">
              <div className="ndm-form-grid">
                <label className="stg-field">
                  <span className="stg-field__label">Mail Driver</span>
                  <select className="ndm-input" value={form.mail_driver} onChange={(e) => updateField('mail_driver', e.target.value)}>
                    <option value="smtp">SMTP</option>
                    <option value="ses">SES</option>
                    <option value="mailgun">Mailgun</option>
                  </select>
                </label>
                <label className="stg-field">
                  <span className="stg-field__label">Host</span>
                  <input className="ndm-input" value={form.host} onChange={(e) => updateField('host', e.target.value)} />
                </label>
                <label className="stg-field">
                  <span className="stg-field__label">Port</span>
                  <input type="number" className="ndm-input" value={form.port} onChange={(e) => updateField('port', Number(e.target.value))} />
                </label>
                <label className="stg-field">
                  <span className="stg-field__label">Username</span>
                  <input className="ndm-input" value={form.username} onChange={(e) => updateField('username', e.target.value)} />
                </label>
                <label className="stg-field">
                  <span className="stg-field__label">Password</span>
                  <input type="password" className="ndm-input" value={form.password} onChange={(e) => updateField('password', e.target.value)} />
                </label>
                <label className="stg-field">
                  <span className="stg-field__label">Encryption</span>
                  <select className="ndm-input" value={form.encryption} onChange={(e) => updateField('encryption', e.target.value)}>
                    <option value="tls">TLS</option>
                    <option value="ssl">SSL</option>
                    <option value="none">None</option>
                  </select>
                </label>
                <label className="stg-field">
                  <span className="stg-field__label">From Name</span>
                  <input className="ndm-input" value={form.from_name} onChange={(e) => updateField('from_name', e.target.value)} />
                </label>
                <label className="stg-field">
                  <span className="stg-field__label">From Email</span>
                  <input className="ndm-input" value={form.from_email} onChange={(e) => updateField('from_email', e.target.value)} />
                </label>
                <label className="stg-field stg-field--wide">
                  <span className="stg-field__label">Test Email Address</span>
                  <input data-settings-test-email className="ndm-input" value={form.test_email_address} onChange={(e) => updateField('test_email_address', e.target.value)} />
                </label>
              </div>

              <div className="stg-option-grid">
                <label className="stg-option-card" htmlFor="queue-email-delivery">
                  <div>
                    <strong>Queue Email Delivery</strong>
                    <p>Send emails via background jobs to reduce request load and improve reliability.</p>
                  </div>
                  <input
                    id="queue-email-delivery"
                    type="checkbox"
                    checked={Boolean(form.queue_email)}
                    onChange={(e) => updateField('queue_email', e.target.checked)}
                  />
                </label>
              </div>
            </SettingsFieldGroup>
          </SettingsSectionCard>
        </>
      )}
    />
  );
}
