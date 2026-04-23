const TYPE_MAP = {
  profile_update: { label: 'Profile Update', className: 'cnt-pill cnt-pill--blue' },
  email_change: { label: 'Email Change', className: 'cnt-pill cnt-pill--purple' },
  mobile_change: { label: 'Mobile Change', className: 'cnt-pill cnt-pill--teal' },
  sensitive_info_change: { label: 'Sensitive Info Change', className: 'cnt-pill cnt-pill--green' },
  photo_change: { label: 'Photo Change', className: 'cnt-pill cnt-pill--blue' },
  other: { label: 'Other', className: 'cnt-pill cnt-pill--slate' },
};

export default function ProfileRequestTypeBadge({ value }) {
  const config = TYPE_MAP[value] || { label: value || 'Request', className: 'cnt-pill cnt-pill--slate' };
  return <span className={config.className}>{config.label}</span>;
}
