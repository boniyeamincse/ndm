import MembershipApplicationStatusBadge from './MembershipApplicationStatusBadge';

export default function MembershipApplicationCard({ item, onView }) {
  return (
    <article className="ndm-mobile-card" data-testid={`application-card-${item.id}`}>
      <div className="ndm-mobile-card__header">
        <p className="ndm-mobile-card__title">{item.full_name}</p>
        <MembershipApplicationStatusBadge value={item.status} />
      </div>
      <p className="ndm-mobile-card__meta">{item.application_no}</p>
      <p className="ndm-mobile-card__meta">{item.mobile || item.email || 'No contact'}</p>
      <p className="ndm-mobile-card__meta">{item.district_name || 'No district'} · {item.division_name || 'No division'}</p>
      <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onView(item.id)}>
        View Details
      </button>
    </article>
  );
}
