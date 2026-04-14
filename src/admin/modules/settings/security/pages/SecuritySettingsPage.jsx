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
          <div className="stg-callout stg-callout--warning">Security changes affect administrator access and session behavior. Review carefully before saving.</div>
          <SettingsSectionCard title="Authentication & Session">
            <SettingsFieldGroup title="Protection Rules" description="Configure baseline password and session policies.">
              <div className="ndm-form-grid">
                <label className="ndm-checkbox-row"><input type="checkbox" checked={Boolean(form.force_strong_passwords)} onChange={(e) => updateField('force_strong_passwords', e.target.checked)} /><span>Force strong passwords</span></label>
                <label>Password Minimum Length<input type="number" className="ndm-input" value={form.password_min_length} onChange={(e) => updateField('password_min_length', Number(e.target.value))} /></label>
                <label>Session Timeout (minutes)<input type="number" className="ndm-input" value={form.session_timeout} onChange={(e) => updateField('session_timeout', Number(e.target.value))} /></label>
                <label>Login Attempt Limit<input type="number" className="ndm-input" value={form.login_attempt_limit} onChange={(e) => updateField('login_attempt_limit', Number(e.target.value))} /></label>
                <label className="ndm-checkbox-row"><input type="checkbox" checked={Boolean(form.require_2fa_for_admins)} onChange={(e) => updateField('require_2fa_for_admins', e.target.checked)} /><span>2FA required for admins placeholder</span></label>
                <label className="ndm-checkbox-row"><input type="checkbox" checked={Boolean(form.ip_restriction_enabled)} onChange={(e) => updateField('ip_restriction_enabled', e.target.checked)} /><span>IP restriction placeholder</span></label>
                <label>Audit Log Retention (days)<input type="number" className="ndm-input" value={form.audit_log_retention_days} onChange={(e) => updateField('audit_log_retention_days', Number(e.target.value))} /></label>
              </div>
            </SettingsFieldGroup>
          </SettingsSectionCard>
        </>
      )}
    />
  );
}
