import SectionCard from '../../../membership/shared/components/SectionCard';

export default function PreviewCard({ title = 'Public Preview', subtitle, children }) {
  return (
    <SectionCard title={title} subtitle={subtitle}>
      <div className="cnt-preview-card">{children}</div>
    </SectionCard>
  );
}
