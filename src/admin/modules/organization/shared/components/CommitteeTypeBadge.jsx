export default function CommitteeTypeBadge({ value }) {
  return <span className="org-pill org-pill--purple">{value || 'Unknown Type'}</span>;
}
