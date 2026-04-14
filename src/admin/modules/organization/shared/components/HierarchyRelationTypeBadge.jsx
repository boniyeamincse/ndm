export default function HierarchyRelationTypeBadge({ value }) {
  const tone = value === 'direct' ? 'green' : value === 'functional' ? 'blue' : 'amber';
  return <span className={`org-pill org-pill--${tone}`}>{value?.replaceAll('_', ' ') || 'relation'}</span>;
}
