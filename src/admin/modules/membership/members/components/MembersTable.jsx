import { Eye, UserCog, UserCheck, UserMinus, Shield } from 'lucide-react';
import MemberStatusBadge from './MemberStatusBadge';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString();
}

export default function MembersTable({ items, onView, onEdit, onStatusAction }) {
  return (
    <div className="ndm-table-wrap" data-testid="members-table">
      <table className="ndm-table">
        <thead>
          <tr>
            <th><input type="checkbox" aria-label="select all members" /></th>
            <th>Member No</th>
            <th>Member</th>
            <th>Contact</th>
            <th>Committee / Position</th>
            <th>Location</th>
            <th>Status</th>
            <th>Joined Date</th>
            <th>Linked Account</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td><input type="checkbox" aria-label={`select-member-${item.member_no}`} /></td>
              <td className="ndm-table__mono">{item.member_no}</td>
              <td>
                <p>{item.full_name}</p>
                {item.leadership_summary ? (
                  <p className="ndm-table__badge-inline">
                    <Shield size={12} />
                    {item.leadership_summary}
                  </p>
                ) : null}
              </td>
              <td>
                <p>{item.mobile || '—'}</p>
                <p className="ndm-table__muted">{item.email || '—'}</p>
              </td>
              <td>{item.committee_summary || item.position_name || '—'}</td>
              <td>{[item.district, item.division].filter(Boolean).join(', ') || '—'}</td>
              <td><MemberStatusBadge value={item.status} /></td>
              <td>{formatDate(item.joined_at)}</td>
              <td>{item.user_id ? 'Linked' : 'Unlinked'}</td>
              <td>
                <div className="ndm-table__actions">
                  <button type="button" className="ndm-icon-btn" onClick={() => onView(item.id)} data-testid={`view-member-${item.id}`}>
                    <Eye size={16} />
                  </button>
                  <button type="button" className="ndm-icon-btn" onClick={() => onEdit(item)} data-testid={`edit-member-${item.id}`}>
                    <UserCog size={16} />
                  </button>
                  <button type="button" className="ndm-icon-btn ndm-icon-btn--success" onClick={() => onStatusAction(item, 'active')} title="Activate">
                    <UserCheck size={16} />
                  </button>
                  <button type="button" className="ndm-icon-btn ndm-icon-btn--warning" onClick={() => onStatusAction(item, 'inactive')} title="Mark Inactive">
                    <UserMinus size={16} />
                  </button>
                  <button type="button" className="ndm-icon-btn ndm-icon-btn--danger" onClick={() => onStatusAction(item, 'suspended')} title="Suspend">
                    <Shield size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
