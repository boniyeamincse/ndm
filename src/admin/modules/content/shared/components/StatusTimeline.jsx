import Timeline from '../../../membership/shared/components/Timeline';

export default function StatusTimeline({ items = [] }) {
  const normalized = items.map((item) => ({
    title: item.title,
    description: item.description,
    date: item.at,
  }));

  return <Timeline items={normalized} />;
}
