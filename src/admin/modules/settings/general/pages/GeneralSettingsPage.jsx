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
        <SettingsSectionCard title="Application Defaults">
          <SettingsFieldGroup title="Localization" description="Set language, timezone, and display formats.">
            <div className="ndm-form-grid">
              <label>Application Name<input className="ndm-input" value={form.application_name} onChange={(e) => updateField('application_name', e.target.value)} /></label>
              <label>Default Language<select className="ndm-input" value={form.default_language} onChange={(e) => updateField('default_language', e.target.value)}><option value="en">English</option><option value="bn">Bangla</option></select></label>
              <label>Default Timezone<input className="ndm-input" value={form.default_timezone} onChange={(e) => updateField('default_timezone', e.target.value)} /></label>
              <label>Date Format<input className="ndm-input" value={form.date_format} onChange={(e) => updateField('date_format', e.target.value)} /></label>
              <label>Time Format<select className="ndm-input" value={form.time_format} onChange={(e) => updateField('time_format', e.target.value)}><option value="12h">12 Hour</option><option value="24h">24 Hour</option></select></label>
              <label>Pagination Size<input type="number" className="ndm-input" value={form.pagination_size} onChange={(e) => updateField('pagination_size', Number(e.target.value))} /></label>
              <label>Dashboard Default Period<select className="ndm-input" value={form.dashboard_default_period} onChange={(e) => updateField('dashboard_default_period', e.target.value)}><option value="7d">7 days</option><option value="30d">30 days</option><option value="90d">90 days</option></select></label>
              <label className="ndm-checkbox-row"><input type="checkbox" checked={Boolean(form.maintenance_mode)} onChange={(e) => updateField('maintenance_mode', e.target.checked)} /><span>Maintenance mode placeholder</span></label>
            </div>
          </SettingsFieldGroup>
        </SettingsSectionCard>
      )}
    />
  );
}
