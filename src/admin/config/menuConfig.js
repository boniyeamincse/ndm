import {
  LayoutDashboard,
  FileText,
  Users,
  Building2,
  Layers3,
  Shield,
  Briefcase,
  Network,
  Newspaper,
  Bell,
  UserCog,
  BarChart3,
  Settings,
  User,
  LogOut,
  FolderKanban,
} from 'lucide-react';

export const adminMenuGroups = [
  {
    id: 'main',
    label: 'Main',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        path: '/admin/dashboard',
        roles: ['admin', 'superadmin'],
      },
      {
        id: 'applications',
        label: 'Membership Applications',
        icon: FileText,
        path: '/admin/membership-applications',
        permission: 'membership.applications.view',
        children: [
          { id: 'applications-all', label: 'All Applications', path: '/admin/membership-applications' },
          { id: 'applications-pending', label: 'Pending Applications', path: '/admin/membership-applications/pending' },
          { id: 'applications-under-review', label: 'Under Review', path: '/admin/membership-applications/under-review' },
          { id: 'applications-approved', label: 'Approved Applications', path: '/admin/membership-applications/approved' },
          { id: 'applications-rejected', label: 'Rejected Applications', path: '/admin/membership-applications/rejected' },
          { id: 'applications-on-hold', label: 'On Hold', path: '/admin/membership-applications/on-hold' },
        ],
      },
      {
        id: 'members',
        label: 'Members',
        icon: Users,
        path: '/admin/members',
        permission: 'member.view',
        children: [
          { id: 'members-all', label: 'All Members', path: '/admin/members' },
          { id: 'members-active', label: 'Active Members', path: '/admin/members/active' },
          { id: 'members-inactive', label: 'Inactive Members', path: '/admin/members/inactive' },
          { id: 'members-suspended', label: 'Suspended Members', path: '/admin/members/suspended' },
          { id: 'members-leadership', label: 'Leadership Members', path: '/admin/members/leadership' },
          { id: 'members-new', label: 'New Members', path: '/admin/members/new' },
        ],
      },
    ],
  },
  {
    id: 'organization',
    label: 'Organization',
    items: [
      {
        id: 'committees',
        label: 'Committees',
        icon: Building2,
        path: '/admin/committees',
        permission: 'committees.view',
        children: [
          { id: 'committees-all', label: 'All Committees', path: '/admin/committees' },
          { id: 'committees-tree', label: 'Committees Tree', path: '/admin/committees-tree' },
          { id: 'committee-types', label: 'Committee Types', path: '/admin/committee-types' },
        ],
      },
      {
        id: 'positions',
        label: 'Positions',
        icon: Shield,
        path: '/admin/positions',
        permission: 'positions.view',
        children: [
          { id: 'positions-all', label: 'All Positions', path: '/admin/positions' },
          { id: 'positions-create', label: 'Create Position', path: '/admin/positions/create' },
        ],
      },
      {
        id: 'assignments',
        label: 'Committee Assignments',
        icon: Briefcase,
        path: '/admin/committee-assignments',
        permission: 'committee.assignments.view',
        children: [
          { id: 'assignments-all', label: 'All Assignments', path: '/admin/committee-assignments' },
          { id: 'assignments-create', label: 'Create Assignment', path: '/admin/committee-assignments/create' },
        ],
      },
      {
        id: 'hierarchy',
        label: 'Reporting Hierarchy',
        icon: Network,
        path: '/admin/reporting-hierarchy',
        permission: 'reporting.hierarchy.view',
        children: [
          { id: 'hierarchy-all', label: 'All Relations', path: '/admin/reporting-hierarchy' },
          { id: 'hierarchy-create', label: 'Create Relation', path: '/admin/reporting-hierarchy/create' },
        ],
      },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    items: [
      {
        id: 'content-hub',
        label: 'Content',
        icon: FolderKanban,
        path: '/admin/posts',
        children: [
          { id: 'posts', label: 'Blog / News', icon: Newspaper, path: '/admin/posts' },
          { id: 'notices', label: 'Notices', icon: Bell, path: '/admin/notices' },
        ],
      },
      {
        id: 'profile-requests',
        label: 'Profile Update Requests',
        icon: UserCog,
        path: '/admin/profile-update-requests',
        permission: 'profile.requests.view',
        badge: '12',
      },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    items: [
      {
        id: 'reports-root',
        label: 'Reports',
        icon: BarChart3,
        path: '/admin/reports',
        permission: 'reports.view',
        children: [
          { id: 'reports-membership', label: 'Membership Reports', path: '/admin/reports/membership' },
          { id: 'reports-members', label: 'Member Reports', path: '/admin/reports/members' },
          { id: 'reports-committees', label: 'Committee Reports', path: '/admin/reports/committees' },
        ],
      },
    ],
  },
  {
    id: 'system',
    label: 'System',
    items: [
      {
        id: 'settings',
        label: 'Settings',
        icon: Settings,
        path: '/admin/settings',
        permission: 'settings.manage',
        roles: ['superadmin', 'admin'],
      },
    ],
  },
];

export const adminUtilityItems = [
  { id: 'profile', label: 'Profile', icon: User, path: '/admin/profile' },
  { id: 'logout', label: 'Logout', icon: LogOut, action: 'logout' },
];

function itemMatchesPath(item, pathname) {
  if (item.path && (pathname === item.path || pathname.startsWith(`${item.path}/`))) {
    return true;
  }

  if (item.children?.length) {
    return item.children.some((child) => itemMatchesPath(child, pathname));
  }

  return false;
}

export function filterMenuGroups(groups, user) {
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (item.hidden) return false;
        if (item.roles?.length && !item.roles.includes(user?.roleKey)) return false;
        return true;
      }),
    }))
    .filter((group) => group.items.length > 0);
}

export function getMenuState(groups, pathname) {
  const openIds = new Set();
  let activeItem = null;

  groups.forEach((group) => {
    group.items.forEach((item) => {
      if (itemMatchesPath(item, pathname)) {
        activeItem = activeItem || item;
        if (item.children?.length) {
          openIds.add(item.id);
        }
      }
    });
  });

  return { activeItem, openIds };
}

export function getPageMeta(pathname) {
  for (const group of adminMenuGroups) {
    for (const item of group.items) {
      if (itemMatchesPath(item, pathname)) {
        const child = item.children?.find((entry) => pathname === entry.path || pathname.startsWith(`${entry.path}/`));
        return {
          title: child?.label || item.label,
          section: group.label,
          breadcrumbs: [
            { label: 'Admin', path: '/admin/dashboard' },
            { label: group.label },
            { label: child?.label || item.label, path: child?.path || item.path },
          ],
        };
      }
    }
  }

  return {
    title: 'Admin',
    section: 'Workspace',
    breadcrumbs: [
      { label: 'Admin', path: '/admin/dashboard' },
      { label: 'Workspace' },
    ],
  };
}
