import SectionCard from '../../shared/components/SectionCard';
import MemberStatusBadge from './MemberStatusBadge';

export default function MemberOverviewCard({ entity }) {
  return (
    <SectionCard title="Member Overview" subtitle="Identity, status and linked account quick summary.">
      <div className="ndm-overview-head">
        <div>
          <p className="ndm-overview-head__name">{entity.full_name}</p>
          <p className="ndm-overview-head__meta">{entity.member_no}</p>
        </div>
        <MemberStatusBadge value={entity.status} />
      </div>
      <div className="ndm-info-grid ndm-info-grid--tight">
        <div className="ndm-info-grid__item"><dt>Joined</dt><dd>{entity.joined_at ? new Date(entity.joined_at).toLocaleString() : '—'}</dd></div>
        <div className="ndm-info-grid__item"><dt>Linked Account</dt><dd>{entity.user?.status || (entity.user_id ? 'linked' : 'unlinked')}</dd></div>
        <div className="ndm-info-grid__item"><dt>Email</dt><dd>{entity.email || '—'}</dd></div>
      </div>
    </SectionCard>
  );
}
