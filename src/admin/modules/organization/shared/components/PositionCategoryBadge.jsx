export default function PositionCategoryBadge({ value }) {
  const tone = value === 'leadership' ? 'red' : value === 'executive' ? 'blue' : 'slate';
  return <span className={`org-pill org-pill--${tone}`}>{value || 'Unspecified'}</span>;
}
