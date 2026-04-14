export default function SettingsFormActions({ busy, dirty, onReset, saveLabel = 'Save Changes', secondaryLabel = 'Reset', extraAction }) {
  return (
    <div className="ndm-modal__actions stg-form-actions">
      {dirty ? <div className="stg-unsaved-banner">You have unsaved changes.</div> : <div className="stg-unsaved-banner stg-unsaved-banner--muted">All changes saved.</div>}
      <div className="stg-form-actions__buttons">
        {extraAction || null}
        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={onReset}>{secondaryLabel}</button>
        <button type="submit" className="ndm-btn ndm-btn--primary" disabled={busy}>{busy ? 'Saving...' : saveLabel}</button>
      </div>
    </div>
  );
}
