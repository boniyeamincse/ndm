import SectionCard from '../../shared/components/SectionCard';
import Timeline from '../../shared/components/Timeline';

export default function MemberStatusTimeline({ items }) {
  return (
    <SectionCard title="Status History" subtitle="Chronological record of member lifecycle status changes.">
      <Timeline items={items || []} statusKey="new_status" />
    </SectionCard>
  );
}
