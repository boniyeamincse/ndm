const AUDIENCE_MAP = {
  all:                { label: 'All',                cls: 'cnt-pill cnt-pill--blue' },
  committee_specific: { label: 'Committee',          cls: 'cnt-pill cnt-pill--purple' },
  leadership_only:    { label: 'Leadership Only',    cls: 'cnt-pill cnt-pill--amber' },
  members_only:       { label: 'Members Only',       cls: 'cnt-pill cnt-pill--teal' },
  custom:             { label: 'Custom Rules',       cls: 'cnt-pill cnt-pill--slate' },
};

export default function NoticeAudienceBadge({ value }) {
  const config = AUDIENCE_MAP[value] || { label: value || 'All', cls: 'cnt-pill cnt-pill--blue' };
  return <span className={config.cls}>{config.label}</span>;
}
