import SettingsFieldGroup from '../../shared/components/SettingsFieldGroup';
import SettingsFormPage from '../../shared/components/SettingsFormPage';
import SettingsSectionCard from '../../shared/components/SettingsSectionCard';
import { useNotificationSettings } from '../../shared/hooks/useSettings';

export default function NotificationSettingsPage() {
  return (
    <SettingsFormPage
      title="Notification Settings"
      subtitle="Control default notification delivery rules for key workflows."
      breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Settings' }, { label: 'Notification Settings' }]}
      hook={useNotificationSettings}
      renderSections={(form, updateField) => (
        <>
          <SettingsSectionCard title="Email Notifications">
            <SettingsFieldGroup title="Workflow Notifications" description="Enable or disable important email notifications.">
              <div className="stg-toggle-grid">
                <label className="ndm-checkbox-row"><input type="checkbox" checked={Boolean(form.email_membership_submitted)} onChange={(e) => updateField('email_membership_submitted', e.target.checked)} /><span>Membership application submitted</span></label>
                <label className="ndm-checkbox-row"><input type="checkbox" checked={Boolean(form.email_membership_approved)} onChange={(e) => updateField('email_membership_approved', e.target.checked)} /><span>Membership approved</span></label>
                <label className="ndm-checkbox-row"><input type="checkbox" checked={Boolean(form.email_membership_rejected)} onChange={(e) => updateField('email_membership_rejected', e.target.checked)} /><span>Membership rejected</span></label>
                <label className="ndm-checkbox-row"><input type="checkbox" checked={Boolean(form.email_notice_published)} onChange={(e) => updateField('email_notice_published', e.target.checked)} /><span>Notice published</span></label>
                <label className="ndm-checkbox-row"><input type="checkbox" checked={Boolean(form.email_profile_request_submitted)} onChange={(e) => updateField('email_profile_request_submitted', e.target.checked)} /><span>Profile request submitted</span></label>
                <label className="ndm-checkbox-row"><input type="checkbox" checked={Boolean(form.email_profile_request_reviewed)} onChange={(e) => updateField('email_profile_request_reviewed', e.target.checked)} /><span>Profile request reviewed</span></label>
              </div>
            </SettingsFieldGroup>
          </SettingsSectionCard>
          <SettingsSectionCard title="Future Channels">
            <SettingsFieldGroup title="Optional Channels" description="Placeholders for future notification channels.">
              <div className="stg-toggle-grid">
                <label className="ndm-checkbox-row"><input type="checkbox" checked={Boolean(form.sms_enabled)} onChange={(e) => updateField('sms_enabled', e.target.checked)} /><span>SMS enabled</span></label>
                <label className="ndm-checkbox-row"><input type="checkbox" checked={Boolean(form.push_enabled)} onChange={(e) => updateField('push_enabled', e.target.checked)} /><span>Push enabled</span></label>
              </div>
            </SettingsFieldGroup>
          </SettingsSectionCard>
        </>
      )}
    />
  );
}
