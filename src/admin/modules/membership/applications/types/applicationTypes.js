export const APPLICATION_STATUSES = {
  all: '',
  pending: 'pending',
  underReview: 'under_review',
  approved: 'approved',
  rejected: 'rejected',
  onHold: 'on_hold',
};

export const APPLICATION_ROUTE_CONFIG = {
  '/admin/membership-applications': {
    title: 'All Applications',
    subtitle: 'Browse and manage all membership applications across workflow stages.',
    status: APPLICATION_STATUSES.all,
  },
  '/admin/membership-applications/pending': {
    title: 'Pending Applications',
    subtitle: 'Applications waiting for initial admin review.',
    status: APPLICATION_STATUSES.pending,
  },
  '/admin/membership-applications/under-review': {
    title: 'Under Review Applications',
    subtitle: 'Applications currently being processed by reviewers.',
    status: APPLICATION_STATUSES.underReview,
  },
  '/admin/membership-applications/approved': {
    title: 'Approved Applications',
    subtitle: 'Applications that were approved and promoted to members.',
    status: APPLICATION_STATUSES.approved,
  },
  '/admin/membership-applications/rejected': {
    title: 'Rejected Applications',
    subtitle: 'Applications declined by review committees.',
    status: APPLICATION_STATUSES.rejected,
  },
  '/admin/membership-applications/on-hold': {
    title: 'On Hold Applications',
    subtitle: 'Applications paused for additional verification.',
    status: APPLICATION_STATUSES.onHold,
  },
};
