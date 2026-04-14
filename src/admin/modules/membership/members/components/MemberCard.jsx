import { MapPin, Phone, Mail, Building2, CalendarDays } from 'lucide-react';
import MemberStatusBadge from './MemberStatusBadge';
import MemberAvatarCell from './MemberAvatarCell';
import MemberLeadershipBadge from './MemberLeadershipBadge';

function isNew(joinedAt, days = 30) {
  if (!joinedAt) return false;
  return Date.now() - new Date(joinedAt).getTime() <= days * 86400000;
}

export default function MemberCard({ item, onView, onEdit, onStatusAction }) {
  return (
    <article className="mem-mobile-card ndm-mobile-card" data-testid={`member-card-${item.id}`}>
      <div className="mem-mobile-card__top">
        <MemberAvatarCell photo={item.photo} name={item.full_name} size={44} />
        <div className="mem-mobile-card__identity">
          <p className="ndm-mobile-card__title">{item.full_name}</p>
          <p className="mem-mobile-card__no">{item.member_no}</p>
          {item.is_leadership ? <MemberLeadershipBadge label={item.leadership_summary} /> : null}
        </div>
        <div className="mem-mobile-card__badges">
          <MemberStatusBadge value={item.status} />
          {isNew(item.joined_at) ? <span className="mem-new-badge">New</span> : null}
        </div>
      </div>

      <div className="mem-mobile-card__meta-list">
        {item.mobile ? (
          <p className="mem-mobile-card__meta-row">
            <Phone size={13} /> {item.mobile}
          </p>
        ) : null}
        {item.email ? (
          <p className="mem-mobile-card__meta-row">
            <Mail size={13} /> {item.email}
          </p>
        ) : null}
        {(item.district_name || item.division_name) ? (
          <p className="mem-mobile-card__meta-row">
            <MapPin size={13} /> {[item.district_name, item.division_name].filter(Boolean).join(', ')}
          </p>
        ) : null}
        {item.primary_committee_name ? (
          <p className="mem-mobile-card__meta-row">
            <Building2 size={13} /> {item.primary_committee_name}
            {item.primary_position_name ? ` - ${item.primary_position_name}` : ''}
          </p>
        ) : null}
        {item.joined_at ? (
          <p className="mem-mobile-card__meta-row">
            <CalendarDays size={13} />
            Joined {new Date(item.joined_at).toLocaleDateString('en-BD', { year: 'numeric', month: 'short', day: '2-digit' })}
          </p>
        ) : null}
      </div>

      <div className="mem-mobile-card__actions">
        <button type="button" className="ndm-btn ndm-btn--primary" onClick={() => onView(item.id)} style={{ flex: 1 }}>
          View Details
        </button>
        {onEdit ? (
          <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onEdit(item)}>
            Edit
          </button>
        ) : null}
        {onStatusAction ? (
          <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onStatusAction(item, item.status === 'active' ? 'inactive' : 'active')}>
            {item.status === 'active' ? 'Deactivate' : 'Activate'}
          </button>
        ) : null}
      </div>
    </article>
  );
}
