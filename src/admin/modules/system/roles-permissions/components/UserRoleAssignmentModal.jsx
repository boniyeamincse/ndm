import { useEffect, useState } from 'react';

export default function UserRoleAssignmentModal({ open, user, allRoles = [], onClose, onSubmit, busy }) {
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (open && user) {
      setSelected(user.roles?.map((role) => role.id) || []);
    }
  }, [open, user]);

  if (!open || !user) return null;

  function toggle(roleId, checked) {
    setSelected((prev) => {
      const set = new Set(prev);
      if (checked) set.add(roleId);
      else set.delete(roleId);
      return Array.from(set);
    });
  }

  return (
    <div className="ndm-modal-backdrop" role="dialog" aria-modal="true">
      <div className="ndm-modal">
        <header className="ndm-modal__header">
          <h2>Assign Roles to User</h2>
          <button type="button" className="ndm-btn ndm-btn--ghost" onClick={onClose}>Close</button>
        </header>
        <div className="ndm-modal__body">
          <p><strong>{user.name}</strong> ({user.email})</p>
          <div className="ndm-grid ndm-grid--2">
            {allRoles.map((role) => (
              <label key={role.id} className="ndm-checkbox-row">
                <input
                  type="checkbox"
                  checked={selected.includes(role.id)}
                  onChange={(event) => toggle(role.id, event.target.checked)}
                />
                <span>{role.display_name || role.name}</span>
              </label>
            ))}
          </div>
        </div>
        <footer className="ndm-modal__footer">
          <button type="button" className="ndm-btn ndm-btn--ghost" onClick={onClose}>Cancel</button>
          <button type="button" className="ndm-btn ndm-btn--primary" disabled={busy} onClick={() => onSubmit(selected)}>
            {busy ? 'Saving...' : 'Save Changes'}
          </button>
        </footer>
      </div>
    </div>
  );
}
