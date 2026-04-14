import ProfileRequestStatusBadge from './ProfileRequestStatusBadge';
import ProfileRequestTypeBadge from './ProfileRequestTypeBadge';

export default function ProfileUpdateRequestsTable({ items, onView, onAction }) {
  return (
    <div className="ndm-table-wrap">
      <table className="ndm-table">
        <thead>
          <tr>
            <th></th>
            <th>Request No</th>
            <th>Requester</th>
            <th>Member No</th>
            <th>Request Type</th>
            <th>Status</th>
            <th>Submitted At</th>
            <th>Reviewed By</th>
            <th>Reviewed At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td><input type="checkbox" aria-label={`Select ${item.request_no}`} /></td>
              <td>{item.request_no}</td>
              <td>{item.requester?.name}</td>
              <td>{item.member?.member_no}</td>
              <td><ProfileRequestTypeBadge value={item.request_type} /></td>
              <td><ProfileRequestStatusBadge value={item.status} /></td>
              <td>{new Date(item.submitted_at).toLocaleDateString()}</td>
              <td>{item.reviewed_by?.name || '—'}</td>
              <td>{item.reviewed_at ? new Date(item.reviewed_at).toLocaleDateString() : '—'}</td>
              <td>
                <div className="ndm-table__actions">
                  <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onView(item.id)}>View</button>
                  {item.status === 'pending' ? <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onAction('approve', item)}>Approve</button> : null}
                  {item.status === 'pending' ? <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onAction('reject', item)}>Reject</button> : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
