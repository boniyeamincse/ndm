import ProfileRequestStatusBadge from './ProfileRequestStatusBadge';
import ProfileRequestTypeBadge from './ProfileRequestTypeBadge';

export default function ProfileUpdateRequestCard({ item, onView, onAction }) {
  return (
    <article className="ndm-mobile-card cnt-mobile-card">
      <div className="cnt-mobile-card__head">
        <div>
          <h3>{item.requester?.name}</h3>
          <p>{item.request_no}</p>
        </div>
        <ProfileRequestStatusBadge value={item.status} />
      </div>
      <div className="cnt-mobile-card__badges">
        <ProfileRequestTypeBadge value={item.request_type} />
      </div>
      <div className="cnt-mobile-card__meta">
        <span>{item.member?.member_no}</span>
        <span>{new Date(item.submitted_at).toLocaleDateString()}</span>
      </div>
      <div className="ndm-table__actions cnt-mobile-card__footer">
        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onView(item.id)}>View</button>
        {item.status === 'pending' ? <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onAction('approve', item)}>Approve</button> : null}
        {item.status === 'pending' ? <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onAction('reject', item)}>Reject</button> : null}
      </div>
    </article>
  );
}
