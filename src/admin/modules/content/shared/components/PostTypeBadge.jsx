const TYPE_MAP = {
  news:       { label: 'News',        cls: 'cnt-pill cnt-pill--blue' },
  blog:       { label: 'Blog',        cls: 'cnt-pill cnt-pill--purple' },
  press:      { label: 'Press',       cls: 'cnt-pill cnt-pill--teal' },
  statement:  { label: 'Statement',   cls: 'cnt-pill cnt-pill--amber' },
  update:     { label: 'Update',      cls: 'cnt-pill cnt-pill--green' },
};

export default function PostTypeBadge({ value }) {
  const config = TYPE_MAP[value] || { label: value || 'Post', cls: 'cnt-pill cnt-pill--gray' };
  return <span className={config.cls}>{config.label}</span>;
}
