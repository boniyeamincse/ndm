import { useRef, useState } from 'react';
import SettingsFieldGroup from '../../shared/components/SettingsFieldGroup';
import SettingsFormPage from '../../shared/components/SettingsFormPage';
import SettingsSectionCard from '../../shared/components/SettingsSectionCard';
import { useOrganizationSettings } from '../../shared/hooks/useSettings';

const MAX_UPLOAD_SIZE = 2 * 1024 * 1024;

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}

export default function OrganizationSettingsPage() {
  const logoInputRef = useRef(null);
  const faviconInputRef = useRef(null);
  const [uploadError, setUploadError] = useState('');

  async function handleAssetUpload(event, field, label, updateField) {
    const file = event.target.files?.[0];
    if (!file) return;

    event.target.value = '';

    if (!file.type.startsWith('image/')) {
      setUploadError(`${label} must be an image file.`);
      return;
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      setUploadError(`${label} must be 2MB or smaller.`);
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      updateField(field, dataUrl);
      setUploadError('');
    } catch {
      setUploadError(`Unable to upload ${label.toLowerCase()} right now.`);
    }
  }

  return (
    <SettingsFormPage
      title="Organization Settings"
      subtitle="Manage branding, public contact information, and organization identity."
      breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Settings' }, { label: 'Organization Settings' }]}
      hook={useOrganizationSettings}
      renderSections={(form, updateField) => (
        <>
          <section className="stg-page-hero stg-page-hero--emerald" aria-label="Organization settings overview">
            <div className="stg-page-hero__content">
              <p className="stg-page-hero__eyebrow">Brand Governance</p>
              <h2>Organization Profile</h2>
              <p>Keep your public identity, contact details, and footer content aligned across all channels.</p>
            </div>
            <div className="stg-page-hero__stats" role="list" aria-label="Organization highlights">
              <div className="stg-page-stat" role="listitem">
                <span>Name</span>
                <strong>{form.short_name || form.organization_name || 'Not set'}</strong>
              </div>
              <div className="stg-page-stat" role="listitem">
                <span>Contact</span>
                <strong>{form.contact_email || 'Not set'}</strong>
              </div>
              <div className="stg-page-stat" role="listitem">
                <span>Website</span>
                <strong>{form.website || 'Not set'}</strong>
              </div>
            </div>
          </section>

          <SettingsSectionCard title="Branding">
            <SettingsFieldGroup title="Identity" description="Manage organization naming and visual assets.">
              {uploadError ? <div className="stg-feedback stg-feedback--error">{uploadError}</div> : null}
              <div className="ndm-form-grid">
                <label className="stg-field">
                  <span className="stg-field__label">Organization Name</span>
                  <input className="ndm-input" value={form.organization_name} onChange={(e) => updateField('organization_name', e.target.value)} />
                </label>
                <label className="stg-field">
                  <span className="stg-field__label">Short Name</span>
                  <input className="ndm-input" value={form.short_name} onChange={(e) => updateField('short_name', e.target.value)} />
                </label>
                <label className="stg-field stg-field--wide">
                  <span className="stg-field__label">Organization Slogan</span>
                  <input className="ndm-input" value={form.organization_slogan} onChange={(e) => updateField('organization_slogan', e.target.value)} />
                </label>
                <label className="stg-field">
                  <span className="stg-field__label">Logo URL</span>
                  <input className="ndm-input" value={form.logo_url} onChange={(e) => updateField('logo_url', e.target.value)} placeholder="/images/logo/logo.jpeg or uploaded image" />
                </label>
                <label className="stg-field">
                  <span className="stg-field__label">Favicon URL</span>
                  <input className="ndm-input" value={form.favicon_url} onChange={(e) => updateField('favicon_url', e.target.value)} placeholder="/favicon.svg or uploaded image" />
                </label>
                <div className="stg-upload-actions stg-field--wide">
                  <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => logoInputRef.current?.click()}>
                    Upload Logo
                  </button>
                  <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => faviconInputRef.current?.click()}>
                    Upload Favicon
                  </button>
                  <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => updateField('logo_url', '/images/logo/logo.jpeg')}>
                    Use Default Logo Path
                  </button>
                </div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="stg-upload-input"
                  onChange={(event) => handleAssetUpload(event, 'logo_url', 'Logo', updateField)}
                />
                <input
                  ref={faviconInputRef}
                  type="file"
                  accept="image/*,.ico,.svg"
                  className="stg-upload-input"
                  onChange={(event) => handleAssetUpload(event, 'favicon_url', 'Favicon', updateField)}
                />
              </div>
              <div className="stg-media-preview-grid">
                <div className="stg-media-preview-card">
                  <span>Logo Preview</span>
                  {form.logo_url ? <img className="stg-media-preview" src={form.logo_url} alt="Logo preview" /> : null}
                </div>
                <div className="stg-media-preview-card">
                  <span>Favicon Preview</span>
                  {form.favicon_url ? <img className="stg-media-preview stg-media-preview--small" src={form.favicon_url} alt="Favicon preview" /> : null}
                </div>
              </div>
            </SettingsFieldGroup>
          </SettingsSectionCard>
          <SettingsSectionCard title="Contact & Footer">
            <SettingsFieldGroup title="Public Info" description="Control how the organization is represented in public-facing content.">
              <div className="ndm-form-grid">
                <label className="stg-field">
                  <span className="stg-field__label">Contact Email</span>
                  <input className="ndm-input" value={form.contact_email} onChange={(e) => updateField('contact_email', e.target.value)} />
                </label>
                <label className="stg-field">
                  <span className="stg-field__label">Contact Phone</span>
                  <input className="ndm-input" value={form.contact_phone} onChange={(e) => updateField('contact_phone', e.target.value)} />
                </label>
                <label className="stg-field stg-field--wide">
                  <span className="stg-field__label">Website</span>
                  <input className="ndm-input" value={form.website} onChange={(e) => updateField('website', e.target.value)} />
                </label>
                <label className="stg-field stg-field--wide">
                  <span className="stg-field__label">Address</span>
                  <textarea className="ndm-input" rows={3} value={form.address} onChange={(e) => updateField('address', e.target.value)} />
                </label>
                <label className="stg-field stg-field--wide">
                  <span className="stg-field__label">Footer Text</span>
                  <input className="ndm-input" value={form.footer_text} onChange={(e) => updateField('footer_text', e.target.value)} />
                </label>
                <label className="stg-field stg-field--wide">
                  <span className="stg-field__label">Registration Terms</span>
                  <textarea className="ndm-input" rows={4} value={form.registration_terms} onChange={(e) => updateField('registration_terms', e.target.value)} />
                </label>
              </div>
            </SettingsFieldGroup>
          </SettingsSectionCard>
        </>
      )}
    />
  );
}
