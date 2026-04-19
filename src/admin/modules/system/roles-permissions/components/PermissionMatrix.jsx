import { useMemo } from 'react';

export default function PermissionMatrix({ groupedPermissions, selected, onChange }) {
  const selectedSet = useMemo(() => new Set(selected || []), [selected]);

  function toggleOne(permissionId, checked) {
    const next = new Set(selectedSet);
    if (checked) next.add(permissionId);
    else next.delete(permissionId);
    onChange(Array.from(next));
  }

  function toggleGroup(permissionIds, checked) {
    const next = new Set(selectedSet);
    permissionIds.forEach((id) => {
      if (checked) next.add(id);
      else next.delete(id);
    });
    onChange(Array.from(next));
  }

  const entries = Object.entries(groupedPermissions || {});

  return (
    <div className="ndm-permission-matrix">
      {entries.map(([group, permissions]) => {
        const ids = permissions.map((item) => item.id);
        const selectedInGroup = ids.filter((id) => selectedSet.has(id)).length;
        const allChecked = ids.length > 0 && selectedInGroup === ids.length;

        return (
          <section className="ndm-card" key={group}>
            <header className="ndm-card__header ndm-card__header--split">
              <div>
                <h3>{group}</h3>
                <p>{selectedInGroup}/{ids.length} selected</p>
              </div>
              <label className="ndm-checkbox-row">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={(event) => toggleGroup(ids, event.target.checked)}
                />
                <span>Select All</span>
              </label>
            </header>
            <div className="ndm-card__body">
              <div className="ndm-grid ndm-grid--2">
                {permissions.map((permission) => (
                  <label key={permission.id} className="ndm-checkbox-row">
                    <input
                      type="checkbox"
                      checked={selectedSet.has(permission.id)}
                      onChange={(event) => toggleOne(permission.id, event.target.checked)}
                    />
                    <span>{permission.label || permission.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
