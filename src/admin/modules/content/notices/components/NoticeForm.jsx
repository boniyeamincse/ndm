import { useEffect, useMemo, useState } from 'react';
import ContentEditorWrapper from '../../shared/components/ContentEditorWrapper';
import TagInput from '../../shared/components/TagInput';
import NoticeAttachmentsUploader from './NoticeAttachmentsUploader';
import AudienceRulesBuilder from './AudienceRulesBuilder';
import { slugify } from '../../shared/utils/contentFormatters';

const EMPTY_FORM = {
  title: '',
  slug: '',
  summary: '',
  content: '',
  notice_type: 'circular',
  priority: 'normal',
  visibility: 'public',
  audience_type: 'all',
  committee_id: '',
  author_id: '',
  approver_id: '',
  featured_image_url: '',
  featured_image_alt: '',
  publish_at: '',
  expires_at: '',
  is_pinned: false,
  requires_acknowledgement: false,
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  attachments: [],
  audience_rules: [],
  tags: [],
  status: 'draft',
};

export default function NoticeForm({ initialValues, busy, onCancel, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [queuedFiles, setQueuedFiles] = useState([]);

  useEffect(() => {
    setForm({ ...EMPTY_FORM, ...(initialValues || {}) });
    setQueuedFiles([]);
  }, [initialValues]);

  const slugPreview = useMemo(() => form.slug || slugify(form.title), [form.slug, form.title]);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event, intent = 'draft') {
    event.preventDefault();
    onSubmit({
      ...form,
      slug: slugPreview,
      attachments: [...(form.attachments || []), ...queuedFiles],
      status: intent === 'publish' ? 'published' : intent === 'review' ? 'pending_review' : form.status,
    });
  }

  return (
    <form className="cnt-form" onSubmit={(event) => handleSubmit(event, 'draft')}>
      <section className="cnt-form__section">
        <div className="cnt-form__section-head">
          <h3>Main Content</h3>
          <p>Prepare the title, summary, and official notice body.</p>
        </div>
        <div className="ndm-form-grid">
          <label className="cnt-form__field cnt-form__field--wide">
            Title
            <input className="ndm-input" value={form.title} onChange={(event) => updateField('title', event.target.value)} required />
          </label>
          <label className="cnt-form__field cnt-form__field--wide">
            Slug
            <input className="ndm-input" value={form.slug} onChange={(event) => updateField('slug', event.target.value)} placeholder={slugify(form.title)} />
            <span className="cnt-form__hint">Preview: /notices/{slugPreview || 'notice-slug'}</span>
          </label>
          <label className="cnt-form__field cnt-form__field--wide">
            Summary
            <textarea className="ndm-input" rows={3} value={form.summary} onChange={(event) => updateField('summary', event.target.value)} />
          </label>
        </div>
        <ContentEditorWrapper label="Notice Content" value={form.content} onChange={(value) => updateField('content', value)} required />
      </section>

      <section className="cnt-form__section">
        <div className="cnt-form__section-head">
          <h3>Priority & Type</h3>
          <p>Define urgency, type, and acknowledgement requirements.</p>
        </div>
        <div className="ndm-form-grid">
          <label className="cnt-form__field">
            Notice Type
            <select className="ndm-input" value={form.notice_type} onChange={(event) => updateField('notice_type', event.target.value)}>
              <option value="circular">Circular</option>
              <option value="advisory">Advisory</option>
              <option value="deadline">Deadline</option>
              <option value="event">Event</option>
              <option value="announcement">Announcement</option>
            </select>
          </label>
          <label className="cnt-form__field">
            Priority
            <select className="ndm-input" value={form.priority} onChange={(event) => updateField('priority', event.target.value)}>
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
              <option value="critical">Critical</option>
            </select>
          </label>
          <label className="ndm-checkbox-row">
            <input type="checkbox" checked={Boolean(form.requires_acknowledgement)} onChange={(event) => updateField('requires_acknowledgement', event.target.checked)} />
            <span>Acknowledgement required</span>
          </label>
          <label className="ndm-checkbox-row">
            <input type="checkbox" checked={Boolean(form.is_pinned)} onChange={(event) => updateField('is_pinned', event.target.checked)} />
            <span>Pin notice</span>
          </label>
        </div>
      </section>

      <section className="cnt-form__section">
        <div className="cnt-form__section-head">
          <h3>Audience / Visibility</h3>
          <p>Control who can see the notice and how it is targeted.</p>
        </div>
        <div className="ndm-form-grid">
          <label className="cnt-form__field">
            Visibility
            <select className="ndm-input" value={form.visibility} onChange={(event) => updateField('visibility', event.target.value)}>
              <option value="public">Public</option>
              <option value="members_only">Members Only</option>
              <option value="internal">Internal</option>
            </select>
          </label>
          <label className="cnt-form__field">
            Audience Type
            <select className="ndm-input" value={form.audience_type} onChange={(event) => updateField('audience_type', event.target.value)}>
              <option value="all">All</option>
              <option value="committee_specific">Committee Specific</option>
              <option value="leadership_only">Leadership Only</option>
              <option value="members_only">Members Only</option>
              <option value="custom">Custom</option>
            </select>
          </label>
          {(form.audience_type === 'committee_specific' || form.audience_type === 'custom') ? (
            <label className="cnt-form__field">
              Committee ID
              <input className="ndm-input" value={form.committee_id} onChange={(event) => updateField('committee_id', event.target.value)} />
            </label>
          ) : null}
          <label className="cnt-form__field">
            Author ID
            <input className="ndm-input" value={form.author_id} onChange={(event) => updateField('author_id', event.target.value)} />
          </label>
          <label className="cnt-form__field">
            Approver ID
            <input className="ndm-input" value={form.approver_id} onChange={(event) => updateField('approver_id', event.target.value)} />
          </label>
        </div>
        {form.audience_type === 'custom' ? <AudienceRulesBuilder rules={form.audience_rules || []} onChange={(rules) => updateField('audience_rules', rules)} /> : null}
      </section>

      <section className="cnt-form__section">
        <div className="cnt-form__section-head">
          <h3>Publishing & Expiry</h3>
          <p>Configure timing and expiration windows.</p>
        </div>
        <div className="ndm-form-grid">
          <label className="cnt-form__field">
            Publish At
            <input type="datetime-local" className="ndm-input" value={form.publish_at || ''} onChange={(event) => updateField('publish_at', event.target.value)} />
          </label>
          <label className="cnt-form__field">
            Expires At
            <input type="datetime-local" className="ndm-input" value={form.expires_at || ''} onChange={(event) => updateField('expires_at', event.target.value)} />
          </label>
        </div>
      </section>

      <section className="cnt-form__section">
        <div className="cnt-form__section-head">
          <h3>Attachments</h3>
          <p>Upload supporting files for internal or public distribution.</p>
        </div>
        <NoticeAttachmentsUploader files={queuedFiles} onFilesChange={setQueuedFiles} />
      </section>

      <section className="cnt-form__section">
        <div className="cnt-form__section-head">
          <h3>Featured Image</h3>
          <p>Optional visual for cards and public previews.</p>
        </div>
        <div className="ndm-form-grid">
          <label className="cnt-form__field cnt-form__field--wide">
            Featured Image URL
            <input className="ndm-input" value={form.featured_image_url || ''} onChange={(event) => updateField('featured_image_url', event.target.value)} />
          </label>
          <label className="cnt-form__field cnt-form__field--wide">
            Image Alt Text
            <input className="ndm-input" value={form.featured_image_alt || ''} onChange={(event) => updateField('featured_image_alt', event.target.value)} />
          </label>
        </div>
      </section>

      <section className="cnt-form__section">
        <div className="cnt-form__section-head">
          <h3>SEO / Meta</h3>
          <p>Prepare metadata for search and public feeds.</p>
        </div>
        <div className="ndm-form-grid">
          <label className="cnt-form__field cnt-form__field--wide">
            Meta Title
            <input className="ndm-input" value={form.meta_title} onChange={(event) => updateField('meta_title', event.target.value)} />
          </label>
          <label className="cnt-form__field cnt-form__field--wide">
            Meta Description
            <textarea className="ndm-input" rows={3} value={form.meta_description} onChange={(event) => updateField('meta_description', event.target.value)} />
          </label>
          <label className="cnt-form__field cnt-form__field--wide">
            Meta Keywords
            <input className="ndm-input" value={form.meta_keywords} onChange={(event) => updateField('meta_keywords', event.target.value)} />
          </label>
        </div>
      </section>

      <section className="cnt-form__section">
        <TagInput tags={form.tags || []} onChange={(tags) => updateField('tags', tags)} />
      </section>

      <div className="ndm-modal__actions cnt-form__actions">
        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={onCancel}>Cancel</button>
        <button type="button" className="ndm-btn ndm-btn--ghost" disabled={busy} onClick={(event) => handleSubmit(event, 'preview')}>Preview</button>
        <button type="button" className="ndm-btn ndm-btn--ghost" disabled={busy} onClick={(event) => handleSubmit(event, 'review')}>Submit for Review</button>
        <button type="submit" className="ndm-btn ndm-btn--ghost" disabled={busy}>{busy ? 'Saving...' : 'Save Draft'}</button>
        <button type="button" className="ndm-btn ndm-btn--primary" disabled={busy} onClick={(event) => handleSubmit(event, 'publish')}>Publish Notice</button>
      </div>
    </form>
  );
}
