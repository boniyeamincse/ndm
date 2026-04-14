const APP_STATUS = {
  pending: { label: 'Pending', tone: 'warning' },
  under_review: { label: 'Under Review', tone: 'info' },
  approved: { label: 'Approved', tone: 'success' },
  rejected: { label: 'Rejected', tone: 'danger' },
  on_hold: { label: 'On Hold', tone: 'muted' },
};

const MEMBER_STATUS = {
  active: { label: 'Active', tone: 'success' },
  inactive: { label: 'Inactive', tone: 'muted' },
  suspended: { label: 'Suspended', tone: 'danger' },
  resigned: { label: 'Resigned', tone: 'warning' },
  removed: { label: 'Removed', tone: 'danger' },
};

export default function StatusBadge({ value, type = 'application' }) {
  const map = type === 'member' ? MEMBER_STATUS : APP_STATUS;
  const config = map[value] || { label: value || 'Unknown', tone: 'muted' };

  return (
    <span className={`ndm-status-badge ndm-status-badge--${config.tone}`} data-testid={`status-${value}`}>
      {config.label}
    </span>
  );
}
