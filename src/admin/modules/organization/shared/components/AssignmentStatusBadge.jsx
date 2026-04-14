export default function AssignmentStatusBadge({ value }) {
  const tone = value === 'active' ? 'green' : value === 'completed' ? 'slate' : value === 'inactive' ? 'amber' : 'red';
  return <span className={`org-pill org-pill--${tone}`}>{value || 'unknown'}</span>;
}
