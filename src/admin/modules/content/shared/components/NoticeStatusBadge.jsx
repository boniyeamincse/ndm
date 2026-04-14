const STATUS_MAP = {
  draft:          { label: 'Draft',          cls: 'cnt-pill cnt-pill--gray' },
  pending_review: { label: 'Pending Review', cls: 'cnt-pill cnt-pill--amber' },
  published:      { label: 'Published',       cls: 'cnt-pill cnt-pill--green' },
  unpublished:    { label: 'Unpublished',     cls: 'cnt-pill cnt-pill--slate' },
  archived:       { label: 'Archived',        cls: 'cnt-pill cnt-pill--red' },
  expired:        { label: 'Expired',         cls: 'cnt-pill cnt-pill--red' },
};

export default function NoticeStatusBadge({ value }) {
  const config = STATUS_MAP[value] || { label: value || 'Unknown', cls: 'cnt-pill cnt-pill--gray' };
  return <span className={config.cls}>{config.label}</span>;
}
