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
          <section className="stg-page-hero stg-page-hero--violet" aria-label="Notification settings overview">
            <div className="stg-page-hero__content">
              <p className="stg-page-hero__eyebrow">Alert Policies</p>
              <h2>Workflow Notifications</h2>
              <p>Define which events trigger communication so members and admins get timely updates.</p>
            </div>
            <div className="stg-page-hero__stats" role="list" aria-label="Notification highlights">
              <div className="stg-page-stat" role="listitem">
                <span>Email Rules</span>
                <strong>
                  {[
                    form.email_membership_submitted,
                    form.email_membership_approved,
                    form.email_membership_rejected,
                    form.email_notice_published,
                    form.email_profile_request_submitted,
                    form.email_profile_request_reviewed,
                  ].filter(Boolean).length}
                </strong>
              </div>
              <div className="stg-page-stat" role="listitem">
                <span>SMS</span>
                <strong>{form.sms_enabled ? 'Enabled' : 'Disabled'}</strong>
              </div>
              <div className="stg-page-stat" role="listitem">
                <span>Push</span>
                <strong>{form.push_enabled ? 'Enabled' : 'Disabled'}</strong>
              </div>
            </div>
          </section>

          <SettingsSectionCard title="Email Notifications">
            <SettingsFieldGroup title="Workflow Notifications" description="Enable or disable important email notifications.">
              <div className="stg-option-grid">
                <label className="stg-option-card" htmlFor="email-membership-submitted"><div><strong>Membership application submitted</strong><p>Notify when a new membership application enters review.</p></div><input id="email-membership-submitted" type="checkbox" checked={Boolean(form.email_membership_submitted)} onChange={(e) => updateField('email_membership_submitted', e.target.checked)} /></label>
                <label className="stg-option-card" htmlFor="email-membership-approved"><div><strong>Membership approved</strong><p>Send confirmation to approved applicants.</p></div><input id="email-membership-approved" type="checkbox" checked={Boolean(form.email_membership_approved)} onChange={(e) => updateField('email_membership_approved', e.target.checked)} /></label>
                <label className="stg-option-card" htmlFor="email-membership-rejected"><div><strong>Membership rejected</strong><p>Send outcome and guidance when an application is rejected.</p></div><input id="email-membership-rejected" type="checkbox" checked={Boolean(form.email_membership_rejected)} onChange={(e) => updateField('email_membership_rejected', e.target.checked)} /></label>
                <label className="stg-option-card" htmlFor="email-notice-published"><div><strong>Notice published</strong><p>Notify subscribers when a new notice goes live.</p></div><input id="email-notice-published" type="checkbox" checked={Boolean(form.email_notice_published)} onChange={(e) => updateField('email_notice_published', e.target.checked)} /></label>
                <label className="stg-option-card" htmlFor="email-profile-request-submitted"><div><strong>Profile request submitted</strong><p>Alert moderators about incoming profile update requests.</p></div><input id="email-profile-request-submitted" type="checkbox" checked={Boolean(form.email_profile_request_submitted)} onChange={(e) => updateField('email_profile_request_submitted', e.target.checked)} /></label>
                <label className="stg-option-card" htmlFor="email-profile-request-reviewed"><div><strong>Profile request reviewed</strong><p>Inform users when profile requests are resolved.</p></div><input id="email-profile-request-reviewed" type="checkbox" checked={Boolean(form.email_profile_request_reviewed)} onChange={(e) => updateField('email_profile_request_reviewed', e.target.checked)} /></label>
              </div>
            </SettingsFieldGroup>
          </SettingsSectionCard>
          <SettingsSectionCard title="Future Channels">
            <SettingsFieldGroup title="Optional Channels" description="Placeholders for future notification channels.">
              <div className="stg-option-grid">
                <label className="stg-option-card" htmlFor="sms-enabled"><div><strong>SMS enabled</strong><p>Allow SMS alerts once provider integrations are configured.</p></div><input id="sms-enabled" type="checkbox" checked={Boolean(form.sms_enabled)} onChange={(e) => updateField('sms_enabled', e.target.checked)} /></label>
                <label className="stg-option-card" htmlFor="push-enabled"><div><strong>Push enabled</strong><p>Enable push notifications for future web and mobile clients.</p></div><input id="push-enabled" type="checkbox" checked={Boolean(form.push_enabled)} onChange={(e) => updateField('push_enabled', e.target.checked)} /></label>
              </div>
            </SettingsFieldGroup>
          </SettingsSectionCard>
        </>
      )}
    />
  );
}
