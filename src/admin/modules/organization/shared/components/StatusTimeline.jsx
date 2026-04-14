import Timeline from '../../../membership/shared/components/Timeline';

export default function StatusTimeline({ items }) {
  return <Timeline items={items || []} />;
}
