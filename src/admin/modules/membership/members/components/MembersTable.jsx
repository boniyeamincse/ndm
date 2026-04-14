import { useState } from 'react';
import { Eye, UserCog, UserCheck, UserMinus, Ban, Copy, Check, ChevronDown } from 'lucide-react';
import MemberStatusBadge from './MemberStatusBadge';
import MemberAvatarCell from './MemberAvatarCell';
import MemberLeadershipBadge from './MemberLeadershipBadge';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-BD', { year: 'numeric', month: 'short', day: '2-digit' });
}

function isNew(joinedAt, days = 30) {
  if (!joinedAt) return false;
  return Date.now() - new Date(joinedAt).getTime() <= days * 86400000;
}

function LinkedAccountBadge({ item }) {
  if (item.user_id && item.linked_user_status === 'active') {
    return <span className="ndm-status-badge ndm-status-badge--success">Linked</span>;
  }
  if (item.linked_user_status === 'pending') {
    return <span className="ndm-status-badge ndm-status-badge--warning">Pending</span>;
  }
  return <span className="ndm-status-badge ndm-status-badge--muted">Unlinked</span>;
}

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <button type="button" className="mem-copy-btn" onClick={handleCopy} title="Copy member number">
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  );
}

function ActionMenu({ item, onView, onEdit, onStatusAction }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mem-action-menu" onMouseLeave={() => setOpen(false)}>
      <button type="button" className="ndm-icon-btn" onClick={() => onView(item.id)} title="View" data-testid={`view-member-${item.id}`}>
        <Eye size={15} />
      </button>
      <button type="button" className="ndm-icon-btn" onClick={() => onEdit(item)} title="Edit" data-testid={`edit-member-${item.id}`}>
        <UserCog size={15} />
      </button>

      <div className="mem-action-menu__wrap">
        <button
          type="button"
          className="ndm-icon-btn"
          onClick={() => setOpen((prev) => !prev)}
          title="More actions"
          aria-haspopup="true"
          aria-expanded={open}
        >
          <ChevronDown size={14} />
        </button>

        {open ? (
          <div className="mem-action-menu__dropdown" role="menu">
            <button type="button" role="menuitem" className="mem-action-menu__item" onClick={() => { onStatusAction(item, 'active'); setOpen(false); }}>
              <UserCheck size={14} /> Activate
            </button>
            <button type="button" role="menuitem" className="mem-action-menu__item" onClick={() => { onStatusAction(item, 'inactive'); setOpen(false); }}>
              <UserMinus size={14} /> Mark Inactive
            </button>
            <button type="button" role="menuitem" className="mem-action-menu__item mem-action-menu__item--danger" onClick={() => { onStatusAction(item, 'suspended'); setOpen(false); }}>
              <Ban size={14} /> Suspend
            </button>
            <button type="button" role="menuitem" className="mem-action-menu__item mem-action-menu__item--danger" onClick={() => { onStatusAction(item, 'resigned'); setOpen(false); }}>
              <UserMinus size={14} /> Mark Resigned
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function MembersTable({ items, onView, onEdit, onStatusAction }) {
  return (
    <div className="ndm-table-wrap" data-testid="members-table">
      <table className="ndm-table">
        <thead>
          <tr>
            <th style={{ width: 36 }}><input type="checkbox" aria-label="Select all members" /></th>
            <th>Member No</th>
            <th>Member</th>
            <th>Contact</th>
            <th>Committee / Position</th>
            <th>Location</th>
            <th>Status</th>
            <th>Joined</th>
            <th>Linked Account</th>
            <th style={{ width: 100 }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id} className={item.is_leadership ? 'mem-row--leadership' : ''}>
              <td><input type="checkbox" aria-label={`Select member ${item.member_no}`} /></td>

              <td>
                <div className="mem-no-cell">
                  <span className="ndm-table__mono">{item.member_no}</span>
                  <CopyButton value={item.member_no} />
                </div>
                {isNew(item.joined_at) ? <span className="mem-new-badge">New</span> : null}
              </td>

              <td>
                <div className="mem-identity-cell">
                  <MemberAvatarCell photo={item.photo} name={item.full_name} size={34} />
                  <div>
                    <p className="mem-identity-cell__name">{item.full_name}</p>
                    <p className="ndm-table__muted">{item.gender || ''}{item.blood_group ? ` · ${item.blood_group}` : ''}</p>
                    {item.is_leadership ? <MemberLeadershipBadge label={item.leadership_summary} /> : null}
                  </div>
                </div>
              </td>

              <td>
                <p>{item.mobile || '—'}</p>
                <p className="ndm-table__muted">{item.email || '—'}</p>
              </td>

              <td>
                {item.primary_committee_name ? (
                  <>
                    <p>{item.primary_committee_name}</p>
                    <p className="ndm-table__muted">{item.primary_position_name || item.position_name || 'Member'}</p>
                  </>
                ) : (
                  <span className="ndm-table__muted">—</span>
                )}
              </td>

              <td>
                <p>{item.district_name || '—'}</p>
                <p className="ndm-table__muted">{item.division_name || ''}</p>
              </td>

              <td><MemberStatusBadge value={item.status} /></td>
              <td className="ndm-table__mono">{formatDate(item.joined_at)}</td>
              <td><LinkedAccountBadge item={item} /></td>
              <td>
                <ActionMenu item={item} onView={onView} onEdit={onEdit} onStatusAction={onStatusAction} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
