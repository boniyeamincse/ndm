export default function AssignmentTypeBadge({ value }) {
  const label = value?.replaceAll('_', ' ') || 'unspecified';
  return <span className="org-pill org-pill--blue">{label}</span>;
}
