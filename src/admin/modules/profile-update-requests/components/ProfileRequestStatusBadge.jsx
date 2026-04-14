const STATUS_MAP = {
  pending: { label: 'Pending', className: 'cnt-pill cnt-pill--amber' },
  approved: { label: 'Approved', className: 'cnt-pill cnt-pill--green' },
  rejected: { label: 'Rejected', className: 'cnt-pill cnt-pill--red' },
  cancelled: { label: 'Cancelled', className: 'cnt-pill cnt-pill--slate' },
};

export default function ProfileRequestStatusBadge({ value }) {
  const config = STATUS_MAP[value] || { label: value || 'Unknown', className: 'cnt-pill cnt-pill--slate' };
  return <span className={config.className}>{config.label}</span>;
}
