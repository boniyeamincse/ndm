import { useEffect, useMemo, useState } from 'react';
import { Link2 } from 'lucide-react';
import { postCategoriesMock } from '../mock/postsMock';
import ContentEditorWrapper from '../../shared/components/ContentEditorWrapper';
import TagInput from '../../shared/components/TagInput';
import { slugify } from '../../shared/utils/contentFormatters';

const EMPTY_FORM = {
  title: '',
  title_bn: '',
  slug: '',
  excerpt: '',
  excerpt_bn: '',
  content: '',
  content_bn: '',
  content_type: 'news',
  post_category_id: '',
  committee_id: '',
  author_id: '',
  editor_id: '',
  featured_image_url: '',
  featured_image_alt: '',
  tags: [],
  visibility: 'public',
  is_featured: false,
  allow_on_homepage: false,
  scheduled_at: '',
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  status: 'draft',
};

export default function PostForm({ initialValues, busy, onCancel, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    setForm({ ...EMPTY_FORM, ...(initialValues || {}) });
  }, [initialValues]);

  const slugPreview = useMemo(() => form.slug || slugify(form.title), [form.slug, form.title]);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event, intent = 'draft') {
    event.preventDefault();
    onSubmit({ ...form, slug: slugPreview, status: intent === 'publish' ? 'published' : intent === 'review' ? 'pending_review' : form.status });
  }

  return (
    <form className="cnt-form" onSubmit={(event) => handleSubmit(event, 'draft')}>
      <section className="cnt-form__section">
        <div className="cnt-form__section-head">
          <h3>Main Content</h3>
          <p>Write the post headline, summary, and editorial body.</p>
        </div>
        <div className="ndm-form-grid">
          <label className="cnt-form__field cnt-form__field--wide">
            Title (English)
            <input className="ndm-input" value={form.title} onChange={(event) => updateField('title', event.target.value)} required />
          </label>
          <label className="cnt-form__field cnt-form__field--wide">
            Title (Bengali)
            <input className="ndm-input" value={form.title_bn} onChange={(event) => updateField('title_bn', event.target.value)} />
          </label>
          <label className="cnt-form__field cnt-form__field--wide">
            Slug
            <div className="cnt-slug-field">
              <Link2 size={14} />
              <input className="ndm-input" value={form.slug} onChange={(event) => updateField('slug', event.target.value)} placeholder={slugify(form.title)} />
            </div>
            <span className="cnt-form__hint">Preview: /news/{slugPreview || 'post-slug'}</span>
          </label>
          <label className="cnt-form__field cnt-form__field--wide">
            Excerpt (English)
            <textarea className="ndm-input" rows={2} value={form.excerpt} onChange={(event) => updateField('excerpt', event.target.value)} />
          </label>
          <label className="cnt-form__field cnt-form__field--wide">
            Excerpt (Bengali)
            <textarea className="ndm-input" rows={2} value={form.excerpt_bn} onChange={(event) => updateField('excerpt_bn', event.target.value)} />
          </label>
        </div>
        <ContentEditorWrapper label="Content (English)" value={form.content} onChange={(value) => updateField('content', value)} required />
        <ContentEditorWrapper label="Content (Bengali)" value={form.content_bn} onChange={(value) => updateField('content_bn', value)} />
      </section>

      <section className="cnt-form__section">
        <div className="cnt-form__section-head">
          <h3>Publishing Settings</h3>
          <p>Control type, visibility, workflow, and scheduling.</p>
        </div>
        <div className="ndm-form-grid">
          <label className="cnt-form__field">
            Content Type
            <select className="ndm-input" value={form.content_type} onChange={(event) => updateField('content_type', event.target.value)}>
              <option value="news">News</option>
              <option value="blog">Blog</option>
              <option value="press">Press</option>
              <option value="statement">Statement</option>
              <option value="update">Update</option>
            </select>
          </label>
          <label className="cnt-form__field">
            Visibility
            <select className="ndm-input" value={form.visibility} onChange={(event) => updateField('visibility', event.target.value)}>
              <option value="public">Public</option>
              <option value="members_only">Members Only</option>
              <option value="internal">Internal</option>
            </select>
          </label>
          <label className="cnt-form__field">
            Scheduled At
            <input type="datetime-local" className="ndm-input" value={form.scheduled_at || ''} onChange={(event) => updateField('scheduled_at', event.target.value)} />
          </label>
          <label className="cnt-form__field">
            Editor ID
            <input className="ndm-input" value={form.editor_id} onChange={(event) => updateField('editor_id', event.target.value)} />
          </label>
        </div>
        <div className="cnt-form__toggles">
          <label className="ndm-checkbox-row">
            <input type="checkbox" checked={Boolean(form.is_featured)} onChange={(event) => updateField('is_featured', event.target.checked)} />
            <span>Feature this post</span>
          </label>
          <label className="ndm-checkbox-row">
            <input type="checkbox" checked={Boolean(form.allow_on_homepage)} onChange={(event) => updateField('allow_on_homepage', event.target.checked)} />
            <span>Allow on homepage</span>
          </label>
        </div>
      </section>

      <section className="cnt-form__section">
        <div className="cnt-form__section-head">
          <h3>Category / Committee</h3>
          <p>Assign the post to the correct category and organizational unit.</p>
        </div>
        <div className="ndm-form-grid">
          <label className="cnt-form__field">
            Category
            <select className="ndm-input" value={form.post_category_id} onChange={(event) => updateField('post_category_id', event.target.value)}>
              <option value="">Select category</option>
              {postCategoriesMock.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label className="cnt-form__field">
            Committee ID
            <input className="ndm-input" value={form.committee_id} onChange={(event) => updateField('committee_id', event.target.value)} />
          </label>
          <label className="cnt-form__field">
            Author ID
            <input className="ndm-input" value={form.author_id} onChange={(event) => updateField('author_id', event.target.value)} />
          </label>
        </div>
      </section>

      <section className="cnt-form__section">
        <div className="cnt-form__section-head">
          <h3>Featured Image</h3>
          <p>Prepare visual and accessibility metadata.</p>
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
          <h3>SEO Fields</h3>
          <p>Set metadata for public consumption and search readiness.</p>
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
        <button type="button" className="ndm-btn ndm-btn--primary" disabled={busy} onClick={(event) => handleSubmit(event, 'publish')}>Publish Now</button>
      </div>
    </form>
  );
}
