import { GitBranch, Users } from 'lucide-react';
import CommitteeStatusBadge from '../../shared/components/CommitteeStatusBadge';
import CommitteeTypeBadge from '../../shared/components/CommitteeTypeBadge';
import CommitteeLocationBlock from '../../shared/components/CommitteeLocationBlock';

export default function CommitteeCard({ item, onView, onTree, onChildren }) {
  return (
    <article className="ndm-mobile-card org-mobile-card">
      <div className="ndm-mobile-card__header">
        <p className="ndm-mobile-card__title">{item.name}</p>
        <CommitteeStatusBadge value={item.status} />
      </div>
      <p className="ndm-mobile-card__meta">{item.committee_no}</p>
      <p className="ndm-mobile-card__meta"><CommitteeTypeBadge value={item.committee_type_name} /></p>
      <CommitteeLocationBlock committee={item} />
      <div className="org-mobile-card__footer">
        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onView(item.id)}>View</button>
        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onChildren(item.id)}><Users size={14} /> Members</button>
        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onTree(item.id)}><GitBranch size={14} /> Tree</button>
      </div>
    </article>
  );
}
