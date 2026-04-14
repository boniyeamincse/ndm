export const mockAdminUser = {
  name: 'Admin User',
  role: 'Admin',
  roleKey: 'admin',
  avatar: '',
  organizationName: 'Student Movment - NDM',
  email: 'admin@ndm.local',
};

export const mockNotifications = [
  {
    id: 1,
    title: '12 membership applications need review',
    description: 'Queue is growing in the last 24 hours.',
    time: '5m ago',
  },
  {
    id: 2,
    title: '3 notices are awaiting publication',
    description: 'Content team is waiting for final approval.',
    time: '18m ago',
  },
  {
    id: 3,
    title: 'District committee report uploaded',
    description: 'New committee activity report is available.',
    time: '1h ago',
  },
];

export const mockNotificationCount = mockNotifications.length;

export function getStoredAdminUser() {
  try {
    const raw = localStorage.getItem('ndm_user');
    if (!raw) return mockAdminUser;
    const parsed = JSON.parse(raw);
    return {
      ...mockAdminUser,
      ...parsed,
      // API returns roles[] array; normalise to a display-friendly label
      role: parsed?.role_name || (Array.isArray(parsed?.roles) ? parsed.roles[0] : null) || parsed?.role || mockAdminUser.role,
      roleKey: parsed?.roleKey || (Array.isArray(parsed?.roles) ? parsed.roles[0] : null) || parsed?.role_type || mockAdminUser.roleKey,
    };
  } catch {
    return mockAdminUser;
  }
}
