const TYPE_MAP = {
  profile_correction: { label: 'Profile Correction', className: 'cnt-pill cnt-pill--blue' },
  identity_update: { label: 'Identity Update', className: 'cnt-pill cnt-pill--purple' },
  committee_affiliation: { label: 'Committee Affiliation', className: 'cnt-pill cnt-pill--teal' },
  contact_update: { label: 'Contact Update', className: 'cnt-pill cnt-pill--green' },
};

export default function ProfileRequestTypeBadge({ value }) {
  const config = TYPE_MAP[value] || { label: value || 'Request', className: 'cnt-pill cnt-pill--slate' };
  return <span className={config.className}>{config.label}</span>;
}
