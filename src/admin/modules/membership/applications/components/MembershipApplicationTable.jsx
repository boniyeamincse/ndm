import { Eye, CheckCircle2, CirclePause, CircleX, ClipboardCheck } from 'lucide-react';
import MembershipApplicationStatusBadge from './MembershipApplicationStatusBadge';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString();
}

export default function MembershipApplicationTable({ items, onView, onAction }) {
  return (
    <div className="ndm-table-wrap" data-testid="applications-table">
      <table className="ndm-table">
        <thead>
          <tr>
            <th><input type="checkbox" aria-label="select all applications" /></th>
            <th>Application No</th>
            <th>Applicant</th>
            <th>Contact</th>
            <th>Location</th>
            <th>Desired Committee</th>
            <th>Status</th>
            <th>Submitted At</th>
            <th>Reviewed By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td><input type="checkbox" aria-label={`select-${item.application_no}`} /></td>
              <td className="ndm-table__mono">{item.application_no}</td>
              <td>{item.full_name}</td>
              <td>
                <p>{item.mobile || '—'}</p>
                <p className="ndm-table__muted">{item.email || '—'}</p>
              </td>
              <td>{[item.district_name, item.division_name].filter(Boolean).join(', ') || '—'}</td>
              <td>{item.desired_committee_level || '—'}</td>
              <td><MembershipApplicationStatusBadge value={item.status} /></td>
              <td>{formatDate(item.created_at)}</td>
              <td>{item.reviewed_by || '—'}</td>
              <td>
                <div className="ndm-table__actions">
                  <button type="button" className="ndm-icon-btn" onClick={() => onView(item.id)} data-testid={`view-application-${item.id}`}>
                    <Eye size={16} />
                  </button>
                  <button type="button" className="ndm-icon-btn" onClick={() => onAction('review', item)} title="Mark Under Review">
                    <ClipboardCheck size={16} />
                  </button>
                  <button type="button" className="ndm-icon-btn ndm-icon-btn--success" onClick={() => onAction('approve', item)} title="Approve">
                    <CheckCircle2 size={16} />
                  </button>
                  <button type="button" className="ndm-icon-btn ndm-icon-btn--danger" onClick={() => onAction('reject', item)} title="Reject">
                    <CircleX size={16} />
                  </button>
                  <button type="button" className="ndm-icon-btn ndm-icon-btn--warning" onClick={() => onAction('hold', item)} title="Hold">
                    <CirclePause size={16} />
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
