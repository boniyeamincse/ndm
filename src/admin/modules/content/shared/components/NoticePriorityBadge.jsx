const PRIORITY_MAP = {
  low:      { label: 'Low',      cls: 'cnt-pill cnt-pill--gray' },
  normal:   { label: 'Normal',   cls: 'cnt-pill cnt-pill--blue' },
  high:     { label: 'High',     cls: 'cnt-pill cnt-pill--amber' },
  urgent:   { label: 'Urgent',   cls: 'cnt-pill cnt-pill--red' },
  critical: { label: 'Critical', cls: 'cnt-pill cnt-pill--red cnt-pill--bold' },
};

export default function NoticePriorityBadge({ value }) {
  const config = PRIORITY_MAP[value] || { label: value || 'Normal', cls: 'cnt-pill cnt-pill--blue' };
  return <span className={config.cls}>{config.label}</span>;
}
