import { useEffect, useState } from 'react';
import PermissionMatrix from './PermissionMatrix';
import { usePermissionsGrouped } from '../hooks/usePermissions';

const INITIAL = {
  id: null,
  name: '',
  display_name: '',
  description: '',
  permissions: [],
};

export default function RoleFormModal({ open, mode = 'create', role, onClose, onSubmit, busy }) {
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState('');
  const { grouped, loading } = usePermissionsGrouped();

  useEffect(() => {
    if (open) {
      setForm({
        ...INITIAL,
        ...(role || {}),
        permissions: role?.permissions?.map((entry) => entry.id) || [],
      });
      setError('');
    }
  }, [open, role]);

  if (!open) return null;

  function submit(event) {
    event.preventDefault();
    if (!form.name.trim()) {
      setError('Role name is required.');
      return;
    }
    onSubmit(form);
  }

  return (
    <div className="ndm-modal-backdrop" role="dialog" aria-modal="true">
      <div className="ndm-modal ndm-modal--xl">
        <header className="ndm-modal__header">
          <h2>{mode === 'edit' ? 'Edit Role' : 'Create Role'}</h2>
          <button type="button" className="ndm-btn ndm-btn--ghost" onClick={onClose}>Close</button>
        </header>
        <form className="ndm-modal__body" onSubmit={submit}>
          {error ? <p className="ndm-error-text">{error}</p> : null}
          <div className="ndm-grid ndm-grid--2">
            <label className="ndm-field">
              <span>Role Name</span>
              <input className="ndm-input" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
            </label>
            <label className="ndm-field">
              <span>Display Name</span>
              <input className="ndm-input" value={form.display_name} onChange={(event) => setForm((prev) => ({ ...prev, display_name: event.target.value }))} />
            </label>
          </div>

          <label className="ndm-field">
            <span>Description</span>
            <textarea className="ndm-input" rows={3} value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} />
          </label>

          <section>
            <div className="ndm-section-head">
              <h3>Assign Permissions</h3>
              <p>{form.permissions.length} selected</p>
            </div>
            {loading ? <p>Loading permissions...</p> : (
              <PermissionMatrix
                groupedPermissions={grouped}
                selected={form.permissions}
                onChange={(permissions) => setForm((prev) => ({ ...prev, permissions }))}
              />
            )}
          </section>

          <footer className="ndm-modal__footer">
            <button type="button" className="ndm-btn ndm-btn--ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="ndm-btn ndm-btn--primary" disabled={busy}>{busy ? 'Saving...' : 'Save Role'}</button>
          </footer>
        </form>
      </div>
    </div>
  );
}
