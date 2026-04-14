import SectionCard from '../../shared/components/SectionCard';
import MembershipApplicationStatusBadge from './MembershipApplicationStatusBadge';

export default function ApplicationOverviewCard({ entity }) {
  return (
    <SectionCard title="Application Overview" subtitle="Applicant identity and current workflow position.">
      <div className="ndm-overview-head">
        <div>
          <p className="ndm-overview-head__name">{entity.full_name}</p>
          <p className="ndm-overview-head__meta">{entity.application_no}</p>
        </div>
        <MembershipApplicationStatusBadge value={entity.status} />
      </div>
      <div className="ndm-info-grid ndm-info-grid--tight">
        <div className="ndm-info-grid__item"><dt>Submitted</dt><dd>{entity.created_at ? new Date(entity.created_at).toLocaleString() : '—'}</dd></div>
        <div className="ndm-info-grid__item"><dt>Desired Committee</dt><dd>{entity.desired_committee_level || '—'}</dd></div>
        <div className="ndm-info-grid__item"><dt>Contact</dt><dd>{entity.mobile || entity.email || '—'}</dd></div>
      </div>
    </SectionCard>
  );
}
