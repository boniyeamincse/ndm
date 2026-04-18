export const COMMITTEE_ROUTE_META = {
  '/admin/committees': {
    title: 'Committees',
    subtitle: 'Manage the full organization committee structure from central to union level.',
  },
  '/admin/committees/central': {
    title: 'Central Committees',
    subtitle: 'List of central committees in the system.',
    committeeTypeOrder: 1,
  },
  '/admin/committees/division': {
    title: 'Division Committees',
    subtitle: 'List of division committees in the system.',
    committeeTypeOrder: 2,
  },
  '/admin/committees/active': {
    title: 'Active Committees',
    subtitle: 'List of currently active committees.',
    status: 'active',
  },
  '/admin/committees/inactive': {
    title: 'Inactive Committees',
    subtitle: 'List of inactive committees.',
    status: 'inactive',
  },
  '/admin/committees/pending-approval': {
    title: 'Pending Approval Committees',
    subtitle: 'List of committees awaiting approval.',
    pendingApproval: true,
  },
};

export const COMMITTEE_STATUS_OPTIONS = ['active', 'inactive', 'dissolved', 'archived'];
