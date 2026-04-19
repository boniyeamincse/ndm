import SettingsFieldGroup from '../../shared/components/SettingsFieldGroup';
import SettingsFormPage from '../../shared/components/SettingsFormPage';
import SettingsSectionCard from '../../shared/components/SettingsSectionCard';
import { useGeneralSettings } from '../../shared/hooks/useSettings';

export default function GeneralSettingsPage() {
  return (
    <SettingsFormPage
      title="General Settings"
      subtitle="Configure core application defaults and dashboard behavior."
      breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Settings' }, { label: 'General Settings' }]}
      hook={useGeneralSettings}
      renderSections={(form, updateField) => (
        <>
          <section className="stg-general-hero" aria-label="General settings overview">
            <div className="stg-general-hero__content">
              <p className="stg-general-hero__eyebrow">Control Center</p>
              <h2>General Settings</h2>
              <p>
                Manage localization, default dashboard behavior, and platform runtime preferences from one place.
              </p>
            </div>
            <div className="stg-general-hero__stats" role="list" aria-label="General settings highlights">
              <div className="stg-general-stat" role="listitem">
                <span className="stg-general-stat__label">Language</span>
                <strong>{form.default_language === 'bn' ? 'Bangla' : 'English'}</strong>
              </div>
              <div className="stg-general-stat" role="listitem">
                <span className="stg-general-stat__label">Timezone</span>
                <strong>{form.default_timezone || 'Not set'}</strong>
              </div>
              <div className="stg-general-stat" role="listitem">
                <span className="stg-general-stat__label">Maintenance</span>
                <strong>{form.maintenance_mode ? 'Enabled' : 'Disabled'}</strong>
              </div>
            </div>
          </section>

          <SettingsSectionCard title="Application Defaults">
            <div className="stg-general-grid">
              <SettingsFieldGroup title="Platform Identity" description="Set core identity and localization used across the application.">
                <div className="ndm-form-grid">
                  <label className="stg-field">
                    <span className="stg-field__label">Application Name</span>
                    <input
                      className="ndm-input"
                      value={form.application_name}
                      onChange={(e) => updateField('application_name', e.target.value)}
                      placeholder="National Democratic Movement"
                    />
                  </label>
                  <label className="stg-field">
                    <span className="stg-field__label">Default Language</span>
                    <select className="ndm-input" value={form.default_language} onChange={(e) => updateField('default_language', e.target.value)}>
                      <option value="en">English</option>
                      <option value="bn">Bangla</option>
                    </select>
                  </label>
                  <label className="stg-field stg-field--wide">
                    <span className="stg-field__label">Default Timezone</span>
                    <input
                      className="ndm-input"
                      value={form.default_timezone}
                      onChange={(e) => updateField('default_timezone', e.target.value)}
                      placeholder="Asia/Dhaka"
                    />
                  </label>
                </div>
              </SettingsFieldGroup>

              <SettingsFieldGroup title="Display & Data Defaults" description="Define how data and analytics appear to administrators by default.">
                <div className="ndm-form-grid">
                  <label className="stg-field">
                    <span className="stg-field__label">Date Format</span>
                    <input className="ndm-input" value={form.date_format} onChange={(e) => updateField('date_format', e.target.value)} placeholder="YYYY-MM-DD" />
                  </label>
                  <label className="stg-field">
                    <span className="stg-field__label">Time Format</span>
                    <select className="ndm-input" value={form.time_format} onChange={(e) => updateField('time_format', e.target.value)}>
                      <option value="12h">12 Hour</option>
                      <option value="24h">24 Hour</option>
                    </select>
                  </label>
                  <label className="stg-field">
                    <span className="stg-field__label">Pagination Size</span>
                    <input
                      type="number"
                      min="5"
                      step="5"
                      className="ndm-input"
                      value={form.pagination_size}
                      onChange={(e) => updateField('pagination_size', Number(e.target.value))}
                    />
                  </label>
                  <label className="stg-field">
                    <span className="stg-field__label">Dashboard Default Period</span>
                    <select className="ndm-input" value={form.dashboard_default_period} onChange={(e) => updateField('dashboard_default_period', e.target.value)}>
                      <option value="7d">7 days</option>
                      <option value="30d">30 days</option>
                      <option value="90d">90 days</option>
                    </select>
                  </label>
                </div>
              </SettingsFieldGroup>

              <SettingsFieldGroup title="Runtime Mode" description="Enable maintenance mode when you need temporary downtime for updates.">
                <label className="stg-toggle-card" htmlFor="general-maintenance-mode">
                  <div className="stg-toggle-card__content">
                    <strong>Maintenance Mode</strong>
                    <p>
                      When enabled, users see a maintenance notice while administrators continue to access this panel.
                    </p>
                  </div>
                  <div className="stg-toggle-card__control">
                    <input
                      id="general-maintenance-mode"
                      type="checkbox"
                      checked={Boolean(form.maintenance_mode)}
                      onChange={(e) => updateField('maintenance_mode', e.target.checked)}
                    />
                  </div>
                </label>
              </SettingsFieldGroup>
            </div>
          </SettingsSectionCard>
        </>
      )}
    />
  );
}
