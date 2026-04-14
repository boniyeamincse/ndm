import SectionCard from '../../../membership/shared/components/SectionCard';
import InfoGrid from '../../../membership/shared/components/InfoGrid';

export default function PublishingInfoCard({ data = {} }) {
  const items = [
    { label: 'Status', value: data.status },
    { label: 'Visibility', value: data.visibility },
    { label: 'Published At', value: data.published_at || data.publish_at || '—' },
    { label: 'Scheduled At', value: data.scheduled_at || '—' },
    ...(data.expires_at !== undefined ? [{ label: 'Expires At', value: data.expires_at || '—' }] : []),
    { label: 'Created At', value: data.created_at || '—' },
    { label: 'Updated At', value: data.updated_at || '—' },
  ];

  return (
    <SectionCard title="Publishing Information">
      <InfoGrid items={items} />
    </SectionCard>
  );
}
