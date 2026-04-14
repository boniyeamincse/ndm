import SectionCard from '../../shared/components/SectionCard';
import InfoGrid from '../../shared/components/InfoGrid';

export default function MemberAssignmentsSummaryCard({ data, onViewAssignments }) {
  return (
    <SectionCard title="Committee Assignments Summary" subtitle="Current assignments and leadership roles.">
      <InfoGrid
        items={[
          { label: 'Assignments Count', value: data?.assignments_count },
          { label: 'Leadership Assignments', value: data?.leadership_assignments_count },
          { label: 'Primary Assignment', value: data?.assignments_summary },
          { label: 'Leadership Summary', value: data?.leadership_summary },
        ]}
      />
      {onViewAssignments ? (
        <div className="mem-assignment-links">
          <button type="button" className="ndm-btn ndm-btn--ghost" onClick={onViewAssignments}>
            View Full Assignments
          </button>
        </div>
      ) : null}
    </SectionCard>
  );
}
