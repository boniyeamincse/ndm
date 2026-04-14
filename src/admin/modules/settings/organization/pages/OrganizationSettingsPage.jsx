import SettingsFieldGroup from '../../shared/components/SettingsFieldGroup';
import SettingsFormPage from '../../shared/components/SettingsFormPage';
import SettingsSectionCard from '../../shared/components/SettingsSectionCard';
import { useOrganizationSettings } from '../../shared/hooks/useSettings';

export default function OrganizationSettingsPage() {
  return (
    <SettingsFormPage
      title="Organization Settings"
      subtitle="Manage branding, public contact information, and organization identity."
      breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Settings' }, { label: 'Organization Settings' }]}
      hook={useOrganizationSettings}
      renderSections={(form, updateField) => (
        <>
          <SettingsSectionCard title="Branding">
            <SettingsFieldGroup title="Identity" description="Manage organization naming and visual assets.">
              <div className="ndm-form-grid">
                <label>Organization Name<input className="ndm-input" value={form.organization_name} onChange={(e) => updateField('organization_name', e.target.value)} /></label>
                <label>Short Name<input className="ndm-input" value={form.short_name} onChange={(e) => updateField('short_name', e.target.value)} /></label>
                <label className="stg-field--wide">Organization Slogan<input className="ndm-input" value={form.organization_slogan} onChange={(e) => updateField('organization_slogan', e.target.value)} /></label>
                <label>Logo URL<input className="ndm-input" value={form.logo_url} onChange={(e) => updateField('logo_url', e.target.value)} /></label>
                <label>Favicon URL<input className="ndm-input" value={form.favicon_url} onChange={(e) => updateField('favicon_url', e.target.value)} /></label>
              </div>
              <div className="stg-media-preview-grid">
                <div><span>Logo Preview</span>{form.logo_url ? <img className="stg-media-preview" src={form.logo_url} alt="Logo preview" /> : null}</div>
                <div><span>Favicon Preview</span>{form.favicon_url ? <img className="stg-media-preview stg-media-preview--small" src={form.favicon_url} alt="Favicon preview" /> : null}</div>
              </div>
            </SettingsFieldGroup>
          </SettingsSectionCard>
          <SettingsSectionCard title="Contact & Footer">
            <SettingsFieldGroup title="Public Info" description="Control how the organization is represented in public-facing content.">
              <div className="ndm-form-grid">
                <label>Contact Email<input className="ndm-input" value={form.contact_email} onChange={(e) => updateField('contact_email', e.target.value)} /></label>
                <label>Contact Phone<input className="ndm-input" value={form.contact_phone} onChange={(e) => updateField('contact_phone', e.target.value)} /></label>
                <label>Website<input className="ndm-input" value={form.website} onChange={(e) => updateField('website', e.target.value)} /></label>
                <label className="stg-field--wide">Address<textarea className="ndm-input" rows={3} value={form.address} onChange={(e) => updateField('address', e.target.value)} /></label>
                <label className="stg-field--wide">Footer Text<input className="ndm-input" value={form.footer_text} onChange={(e) => updateField('footer_text', e.target.value)} /></label>
                <label className="stg-field--wide">Registration Terms<textarea className="ndm-input" rows={4} value={form.registration_terms} onChange={(e) => updateField('registration_terms', e.target.value)} /></label>
              </div>
            </SettingsFieldGroup>
          </SettingsSectionCard>
        </>
      )}
    />
  );
}
