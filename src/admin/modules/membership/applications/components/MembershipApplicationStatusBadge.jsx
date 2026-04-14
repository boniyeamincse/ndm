import StatusBadge from '../../shared/components/StatusBadge';

export default function MembershipApplicationStatusBadge({ value }) {
  return <StatusBadge value={value} type="application" />;
}
