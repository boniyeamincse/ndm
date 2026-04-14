/**
 * Wraps a content editor area. Provides a styled textarea by default.
 * Swap children for a WYSIWYG editor (e.g. Quill, TipTap) when ready.
 */
export default function ContentEditorWrapper({ label = 'Content', value = '', onChange, required = false }) {
  return (
    <div className="cnt-editor-wrap">
      {label && <div className="cnt-editor-wrap__label">{label}{required && ' *'}</div>}
      <div className="cnt-editor-wrap__body">
        <textarea
          className="ndm-input cnt-editor-wrap__textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={12}
          required={required}
          placeholder="Write content here..."
        />
        <p className="cnt-editor-wrap__hint">Rich text editor can be integrated here.</p>
      </div>
    </div>
  );
}
