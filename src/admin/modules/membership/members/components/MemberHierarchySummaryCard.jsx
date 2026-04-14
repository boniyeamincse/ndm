import SectionCard from '../../shared/components/SectionCard';
import InfoGrid from '../../shared/components/InfoGrid';

export default function MemberHierarchySummaryCard({ data, onViewHierarchy }) {
  return (
    <SectionCard title="Hierarchy Summary" subtitle="Leader and subordinate chain summary.">
      <InfoGrid
        items={[
          { label: 'Reporting Leader', value: data?.leader_summary },
          { label: 'Subordinates', value: data?.subordinates_count },
          { label: 'Hierarchy Note', value: data?.subordinates_summary },
        ]}
      />
      {onViewHierarchy ? (
        <div className="mem-assignment-links">
          <button type="button" className="ndm-btn ndm-btn--ghost" onClick={onViewHierarchy}>
            View Hierarchy
          </button>
        </div>
      ) : null}
    </SectionCard>
  );
}
