const VIS_MAP = {
  public:       { label: 'Public',        cls: 'cnt-pill cnt-pill--green' },
  members_only: { label: 'Members Only',  cls: 'cnt-pill cnt-pill--blue' },
  internal:     { label: 'Internal',      cls: 'cnt-pill cnt-pill--slate' },
};

export default function PostVisibilityBadge({ value }) {
  const config = VIS_MAP[value] || { label: value || 'Unknown', cls: 'cnt-pill cnt-pill--gray' };
  return <span className={config.cls}>{config.label}</span>;
}
