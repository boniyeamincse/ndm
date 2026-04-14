import StatusBadge from '../../../membership/shared/components/StatusBadge';

const COMMITTEE_STATUS_LABELS = {
  active: 'Active',
  inactive: 'Inactive',
  dissolved: 'Dissolved',
  archived: 'Archived',
};

export default function CommitteeStatusBadge({ value }) {
  const normalized = value === 'dissolved' || value === 'archived' ? 'suspended' : value;
  const label = COMMITTEE_STATUS_LABELS[value] || value || 'Unknown';
  if (label === 'Dissolved' || label === 'Archived') {
    return <span className="ndm-status-badge ndm-status-badge--danger">{label}</span>;
  }
  return <StatusBadge value={normalized} type="member" />;
}
