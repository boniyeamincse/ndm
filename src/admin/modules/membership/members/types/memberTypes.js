export const MEMBER_ROUTE_CONFIG = {
  '/admin/members': {
    title: 'All Members',
    subtitle: 'Complete member directory with status and assignment visibility.',
    status: '',
    leadershipOnly: false,
    recentDays: null,
  },
  '/admin/members/active': {
    title: 'Active Members',
    subtitle: 'Members currently active in the organization.',
    status: 'active',
    leadershipOnly: false,
    recentDays: null,
  },
  '/admin/members/inactive': {
    title: 'Inactive Members',
    subtitle: 'Members who are temporarily inactive.',
    status: 'inactive',
    leadershipOnly: false,
    recentDays: null,
  },
  '/admin/members/suspended': {
    title: 'Suspended Members',
    subtitle: 'Members suspended due to policy or disciplinary reasons.',
    status: 'suspended',
    leadershipOnly: false,
    recentDays: null,
  },
  '/admin/members/leadership': {
    title: 'Leadership Members',
    subtitle: 'Members holding leadership assignments.',
    status: '',
    leadershipOnly: true,
    recentDays: null,
  },
  '/admin/members/new': {
    title: 'New Members',
    subtitle: 'Recently joined members ordered by latest join date.',
    status: '',
    leadershipOnly: false,
    recentDays: 30,
  },
};
