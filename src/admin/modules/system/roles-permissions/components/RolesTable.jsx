import { Eye, Pencil, ShieldCheck, Trash2 } from 'lucide-react';

export default function RolesTable({ items, onView, onEdit, onAssignPermissions, onDelete }) {
  return (
    <div className="ndm-table-wrap">
      <table className="ndm-table">
        <thead>
          <tr>
            <th>Role</th>
            <th>Display Name</th>
            <th>Description</th>
            <th>Permissions</th>
            <th>Users</th>
            <th>Type</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.display_name || item.name}</td>
              <td>{item.description || '—'}</td>
              <td>{item.permissions_count}</td>
              <td>{item.users_count}</td>
              <td>
                <span className={`ndm-badge ${item.is_system_role ? 'ndm-badge--info' : 'ndm-badge--muted'}`}>
                  {item.is_system_role ? 'System Role' : 'Custom Role'}
                </span>
              </td>
              <td>{item.created_at ? new Date(item.created_at).toLocaleDateString() : '—'}</td>
              <td>
                <div className="ndm-inline-actions">
                  <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onView(item.id)}><Eye size={14} /> View</button>
                  <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onEdit(item)}><Pencil size={14} /> Edit</button>
                  <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onAssignPermissions(item)}><ShieldCheck size={14} /> Permissions</button>
                  <button type="button" className="ndm-btn ndm-btn--danger" onClick={() => onDelete(item)} disabled={item.is_system_role}><Trash2 size={14} /> Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
