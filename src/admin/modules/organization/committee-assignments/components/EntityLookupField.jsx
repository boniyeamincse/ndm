import { useEffect, useRef, useState } from 'react';

export default function EntityLookupField({
  label,
  placeholder,
  value,
  selectedLabel,
  description,
  helperText,
  disabled,
  required,
  onSearch,
  onSelect,
}) {
  const [query, setQuery] = useState(selectedLabel || '');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setQuery(selectedLabel || '');
  }, [selectedLabel]);

  useEffect(() => {
    if (!open || disabled) return undefined;

    let active = true;
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(async () => {
      setLoading(true);
      try {
        const result = await onSearch(query);
        if (active) {
          setOptions(Array.isArray(result) ? result : []);
        }
      } catch {
        if (active) {
          setOptions([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }, 220);

    return () => {
      active = false;
      window.clearTimeout(timeoutRef.current);
    };
  }, [disabled, onSearch, open, query]);

  function handleInputChange(nextValue) {
    setQuery(nextValue);
    setOpen(true);
    if (value) {
      onSelect(null);
    }
  }

  return (
    <label className="org-form__field org-lookup-field">
      <span>
        {label}
        {required ? ' *' : ''}
      </span>
      <div className={`org-lookup-field__control${open ? ' org-lookup-field__control--open' : ''}${disabled ? ' org-lookup-field__control--disabled' : ''}`}>
        <input
          className="ndm-input org-lookup-field__input"
          value={query}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 140)}
          onChange={(event) => handleInputChange(event.target.value)}
        />
        {value ? (
          <button
            type="button"
            className="org-lookup-field__clear"
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              setQuery('');
              onSelect(null);
              setOpen(true);
            }}
          >
            Clear
          </button>
        ) : null}
        {open ? (
          <div className="org-lookup-field__menu">
            {loading ? <div className="org-lookup-field__state">Searching...</div> : null}
            {!loading && options.length === 0 ? <div className="org-lookup-field__state">No results found</div> : null}
            {!loading
              ? options.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`org-lookup-field__option${String(value) === String(option.id) ? ' org-lookup-field__option--selected' : ''}`}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      setQuery(option.label);
                      onSelect(option);
                      setOpen(false);
                    }}
                  >
                    <span className="org-lookup-field__option-label">{option.label}</span>
                    {option.description ? <span className="org-lookup-field__option-description">{option.description}</span> : null}
                  </button>
                ))
              : null}
          </div>
        ) : null}
      </div>
      {description ? <span className="org-lookup-field__description">{description}</span> : null}
      {helperText ? <span className="ndm-help">{helperText}</span> : null}
    </label>
  );
}