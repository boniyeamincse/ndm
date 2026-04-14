import CommitteeStatusBadge from '../../shared/components/CommitteeStatusBadge';
import CommitteeTypeBadge from '../../shared/components/CommitteeTypeBadge';
import CommitteeLocationBlock from '../../shared/components/CommitteeLocationBlock';
import InfoSectionCard from '../../shared/components/InfoSectionCard';

export default function CommitteeOverviewCard({ committee }) {
  return (
    <InfoSectionCard title="Committee Overview" subtitle="Status, structure, location, and term information.">
      <div className="ndm-overview-head">
        <div>
          <p className="ndm-overview-head__name">{committee.name}</p>
          <p className="ndm-overview-head__meta">{committee.committee_no}</p>
        </div>
        <div className="org-overview-head__badges">
          <CommitteeTypeBadge value={committee.committee_type_name} />
          <CommitteeStatusBadge value={committee.status} />
          {committee.is_current ? <span className="org-pill org-pill--green">Current</span> : null}
        </div>
      </div>
      <CommitteeLocationBlock committee={committee} />
      <div className="ndm-info-grid org-info-grid-tight">
        <div className="ndm-info-grid__item"><dt>Parent</dt><dd>{committee.parent_name || 'Root Committee'}</dd></div>
        <div className="ndm-info-grid__item"><dt>Start Date</dt><dd>{committee.start_date || '—'}</dd></div>
        <div className="ndm-info-grid__item"><dt>End Date</dt><dd>{committee.end_date || '—'}</dd></div>
        <div className="ndm-info-grid__item"><dt>Child Committees</dt><dd>{committee.child_committees_count || 0}</dd></div>
      </div>
    </InfoSectionCard>
  );
}
