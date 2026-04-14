import MemberStatusBadge from './MemberStatusBadge';

export default function MemberCard({ item, onView }) {
  return (
    <article className="ndm-mobile-card" data-testid={`member-card-${item.id}`}>
      <div className="ndm-mobile-card__header">
        <p className="ndm-mobile-card__title">{item.full_name}</p>
        <MemberStatusBadge value={item.status} />
      </div>
      <p className="ndm-mobile-card__meta">{item.member_no}</p>
      <p className="ndm-mobile-card__meta">{item.mobile || item.email || 'No contact'}</p>
      <p className="ndm-mobile-card__meta">{item.joined_at ? new Date(item.joined_at).toLocaleDateString() : 'No join date'}</p>
      <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onView(item.id)}>
        View Details
      </button>
    </article>
  );
}
