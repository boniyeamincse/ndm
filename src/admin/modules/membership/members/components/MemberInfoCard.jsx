import SectionCard from '../../shared/components/SectionCard';
import InfoGrid from '../../shared/components/InfoGrid';

export default function MemberInfoCard({ title, subtitle, items }) {
  return (
    <SectionCard title={title} subtitle={subtitle}>
      <InfoGrid items={items} />
    </SectionCard>
  );
}
