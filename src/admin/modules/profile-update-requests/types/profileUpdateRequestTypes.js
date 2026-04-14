export const PROFILE_REQUEST_ROUTE_CONFIG = {
  '/admin/profile-update-requests': {
    status: '',
    title: 'Profile Update Requests',
    subtitle: 'Review and manage member-submitted profile correction and account update requests.',
  },
  '/admin/profile-update-requests/pending': {
    status: 'pending',
    title: 'Pending Profile Update Requests',
    subtitle: 'Review profile changes waiting for administrative action.',
  },
  '/admin/profile-update-requests/approved': {
    status: 'approved',
    title: 'Approved Profile Update Requests',
    subtitle: 'Review already approved member profile changes.',
  },
  '/admin/profile-update-requests/rejected': {
    status: 'rejected',
    title: 'Rejected Profile Update Requests',
    subtitle: 'Inspect rejected requests and rejection reasons.',
  },
};
