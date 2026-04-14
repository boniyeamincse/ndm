export default function PositionScopeBadge({ value }) {
  const tone = value === 'global' ? 'blue' : 'amber';
  return <span className={`org-pill org-pill--${tone}`}>{value || 'N/A'}</span>;
}
