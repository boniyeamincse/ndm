import SettingsFieldGroup from '../../shared/components/SettingsFieldGroup';
import SettingsFormPage from '../../shared/components/SettingsFormPage';
import SettingsSectionCard from '../../shared/components/SettingsSectionCard';
import { useSecuritySettings } from '../../shared/hooks/useSettings';

export default function SecuritySettingsPage() {
  return (
    <SettingsFormPage
      title="Security Settings"
      subtitle="Review admin authentication safeguards, session controls, and retention policies."
      breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Settings' }, { label: 'Security Settings' }]}
      hook={useSecuritySettings}
      extraAction={<button type="button" className="ndm-btn ndm-btn--ghost">Reset to Recommended Defaults</button>}
      renderSections={(form, updateField) => (
        <>
          <section className="stg-page-hero stg-page-hero--amber" aria-label="Security settings overview">
            <div className="stg-page-hero__content">
              <p className="stg-page-hero__eyebrow">Access Controls</p>
              <h2>Authentication & Sessions</h2>
              <p>Harden admin access with password, login, and retention policies tailored to your compliance needs.</p>
            </div>
            <div className="stg-page-hero__stats" role="list" aria-label="Security highlights">
              <div className="stg-page-stat" role="listitem">
                <span>Password Policy</span>
                <strong>{form.force_strong_passwords ? 'Strict' : 'Standard'}</strong>
              </div>
              <div className="stg-page-stat" role="listitem">
                <span>2FA</span>
                <strong>{form.require_2fa_for_admins ? 'Required' : 'Optional'}</strong>
              </div>
              <div className="stg-page-stat" role="listitem">
                <span>Session</span>
                <strong>{form.session_timeout} min</strong>
              </div>
            </div>
          </section>

          <div className="stg-callout stg-callout--warning">Security changes affect administrator access and session behavior. Review carefully before saving.</div>
          <SettingsSectionCard title="Authentication & Session">
            <SettingsFieldGroup title="Protection Rules" description="Configure baseline password and session policies.">
              <div className="ndm-form-grid">
                <label className="stg-field">
                  <span className="stg-field__label">Password Minimum Length</span>
                  <input type="number" className="ndm-input" value={form.password_min_length} onChange={(e) => updateField('password_min_length', Number(e.target.value))} />
                </label>
                <label className="stg-field">
                  <span className="stg-field__label">Session Timeout (minutes)</span>
                  <input type="number" className="ndm-input" value={form.session_timeout} onChange={(e) => updateField('session_timeout', Number(e.target.value))} />
                </label>
                <label className="stg-field">
                  <span className="stg-field__label">Login Attempt Limit</span>
                  <input type="number" className="ndm-input" value={form.login_attempt_limit} onChange={(e) => updateField('login_attempt_limit', Number(e.target.value))} />
                </label>
                <label className="stg-field">
                  <span className="stg-field__label">Audit Log Retention (days)</span>
                  <input type="number" className="ndm-input" value={form.audit_log_retention_days} onChange={(e) => updateField('audit_log_retention_days', Number(e.target.value))} />
                </label>
              </div>

              <div className="stg-option-grid">
                <label className="stg-option-card" htmlFor="force-strong-passwords">
                  <div>
                    <strong>Force strong passwords</strong>
                    <p>Require complex passwords for all administrator and staff accounts.</p>
                  </div>
                  <input id="force-strong-passwords" type="checkbox" checked={Boolean(form.force_strong_passwords)} onChange={(e) => updateField('force_strong_passwords', e.target.checked)} />
                </label>
                <label className="stg-option-card" htmlFor="require-2fa-admins">
                  <div>
                    <strong>Require 2FA for admins</strong>
                    <p>Add a second authentication factor for administrator logins.</p>
                  </div>
                  <input id="require-2fa-admins" type="checkbox" checked={Boolean(form.require_2fa_for_admins)} onChange={(e) => updateField('require_2fa_for_admins', e.target.checked)} />
                </label>
                <label className="stg-option-card" htmlFor="ip-restriction-enabled">
                  <div>
                    <strong>IP restriction</strong>
                    <p>Limit administrator sign-in to trusted IP ranges and known office networks.</p>
                  </div>
                  <input id="ip-restriction-enabled" type="checkbox" checked={Boolean(form.ip_restriction_enabled)} onChange={(e) => updateField('ip_restriction_enabled', e.target.checked)} />
                </label>
              </div>
            </SettingsFieldGroup>
          </SettingsSectionCard>
        </>
      )}
    />
  );
}
