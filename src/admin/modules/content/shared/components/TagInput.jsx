import { useState } from 'react';
import { X, Plus } from 'lucide-react';

export default function TagInput({ label = 'Tags', tags = [], onChange }) {
  const [input, setInput] = useState('');

  function addTag() {
    const trimmed = input.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    onChange([...tags, trimmed]);
    setInput('');
  }

  function removeTag(tag) {
    onChange(tags.filter((t) => t !== tag));
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  }

  return (
    <div className="cnt-tag-input">
      <span className="cnt-tag-input__label">{label}</span>
      <div className="cnt-tag-input__field">
        <div className="cnt-tag-input__chips">
          {tags.map((tag) => (
            <span key={tag} className="cnt-tag-chip">
              {tag}
              <button type="button" aria-label={`Remove ${tag}`} onClick={() => removeTag(tag)}>
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="cnt-tag-input__row">
          <input
            className="ndm-input cnt-tag-input__input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type tag and press Enter"
          />
          <button type="button" className="ndm-btn ndm-btn--ghost cnt-tag-input__add" onClick={addTag}>
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
