import { useEffect, useState } from 'react';
import { slugify } from '../../shared/utils/contentFormatters';

const EMPTY_FORM = {
  name: '',
  slug: '',
  description: '',
  color: '#0f766e',
  is_active: true,
};

export default function PostCategoryForm({ initialValues, busy, onCancel, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    setForm({ ...EMPTY_FORM, ...(initialValues || {}) });
  }, [initialValues]);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({ ...form, slug: form.slug || slugify(form.name) });
  }

  return (
    <form className="cnt-form" onSubmit={handleSubmit}>
      <section className="cnt-form__section">
        <div className="ndm-form-grid">
          <label className="cnt-form__field">
            Name
            <input className="ndm-input" value={form.name} onChange={(event) => updateField('name', event.target.value)} required />
          </label>
          <label className="cnt-form__field">
            Slug
            <input className="ndm-input" value={form.slug} onChange={(event) => updateField('slug', event.target.value)} placeholder={slugify(form.name)} />
          </label>
          <label className="cnt-form__field cnt-form__field--wide">
            Description
            <textarea className="ndm-input" rows={3} value={form.description} onChange={(event) => updateField('description', event.target.value)} />
          </label>
          <label className="cnt-form__field">
            Color
            <input type="color" className="ndm-input cnt-color-input" value={form.color} onChange={(event) => updateField('color', event.target.value)} />
          </label>
          <label className="ndm-checkbox-row">
            <input type="checkbox" checked={Boolean(form.is_active)} onChange={(event) => updateField('is_active', event.target.checked)} />
            <span>Active category</span>
          </label>
        </div>
      </section>
      <div className="ndm-modal__actions cnt-form__actions">
        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="ndm-btn ndm-btn--primary" disabled={busy}>{busy ? 'Saving...' : 'Save Category'}</button>
      </div>
    </form>
  );
}
