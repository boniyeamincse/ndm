// Mock data for Admin Dashboard — field names match chart component expectations

export const mockDashboardStats = {
  total_members: 12540,
  active_members: 11200,
  pending_applications: 145,
  total_committees: 320,
  active_assignments: 5420,
  published_posts: 84,
  published_notices: 19,
  profile_update_requests_pending: 12,
};

export const mockPendingItems = [
  { id: 1, label: 'Pending Membership Applications', count: 145, route: '/admin/membership-applications', priority: 'high' },
  { id: 2, label: 'Pending Profile Update Requests', count: 12,  route: '/admin/profile-update-requests', priority: 'medium' },
  { id: 3, label: 'Posts Awaiting Review',           count: 7,   route: '/admin/posts',                  priority: 'medium' },
  { id: 4, label: 'Notices Awaiting Review',          count: 3,   route: '/admin/notices',                priority: 'low' },
  { id: 5, label: 'Notices Expiring This Week',       count: 5,   route: '/admin/notices',                priority: 'medium' },
];

export const mockRecentActivities = [
  { id: 1, type: 'application', description: 'Membership application by Rahim Hossain approved.', created_at: '2026-04-14T11:32:00Z' },
  { id: 2, type: 'member',      description: 'Member Faruk Ahmed status changed to suspended.',    created_at: '2026-04-14T10:55:00Z' },
  { id: 3, type: 'notice',      description: 'Notice "Annual Meeting 2026" published.',            created_at: '2026-04-14T10:10:00Z' },
  { id: 4, type: 'post',        description: 'Blog post "Student Rights Movement Update" published.', created_at: '2026-04-14T09:42:00Z' },
  { id: 5, type: 'committee',   description: 'Dhaka North District Committee activated.',           created_at: '2026-04-13T17:20:00Z' },
  { id: 6, type: 'member',      description: 'New committee assignment for Nasrin Begum.',          created_at: '2026-04-13T15:00:00Z' },
];

export const mockLatestNotices = [
  { id: 1, title: 'Annual Convention 2026 — Dhaka',     author: 'Admin Office', published_at: '2026-04-14T00:00:00Z' },
  { id: 2, title: 'Membership Renewal Deadline',         author: 'Admin Office', published_at: '2026-04-12T00:00:00Z' },
  { id: 3, title: 'New Committee Formation Guidelines',  author: 'Admin Karim',  published_at: '2026-04-10T00:00:00Z' },
  { id: 4, title: 'Leadership Training Program',         author: 'Admin Salma',  published_at: '2026-04-08T00:00:00Z' },
];

export const mockLatestPosts = [
  { id: 1, title: 'Student Rights Movement — Quarterly Update', author: 'Salma Khatun', published_at: '2026-04-13T00:00:00Z' },
  { id: 2, title: 'How to Organize a District Committee',        author: 'Karim Uddin',  published_at: '2026-04-11T00:00:00Z' },
  { id: 3, title: 'NDM Press Release: Youth Empowerment',        author: 'Admin Office', published_at: '2026-04-09T00:00:00Z' },
];

// Chart data — field names match ChartCard component expectations
export const mockMembershipTrend = [
  { month: 'May 25',  new_members: 320, total_members: 10100 },
  { month: 'Jun 25',  new_members: 410, total_members: 10510 },
  { month: 'Jul 25',  new_members: 380, total_members: 10890 },
  { month: 'Aug 25',  new_members: 490, total_members: 11380 },
  { month: 'Sep 25',  new_members: 520, total_members: 11900 },
  { month: 'Oct 25',  new_members: 610, total_members: 12510 },
  { month: 'Nov 25',  new_members: 540, total_members: 13050 },
  { month: 'Dec 25',  new_members: 480, total_members: 13530 },
  { month: 'Jan 26',  new_members: 720, total_members: 14250 },
  { month: 'Feb 26',  new_members: 850, total_members: 15100 },
  { month: 'Mar 26',  new_members: 960, total_members: 16060 },
  { month: 'Apr 26',  new_members: 145, total_members: 16205 },
];

export const mockApplicationStatus = [
  { status: 'Approved',     count: 11800, color: '#27AE60' },
  { status: 'Pending',      count: 145,   color: '#F39C12' },
  { status: 'Under Review', count: 310,   color: '#2980B9' },
  { status: 'Rejected',     count: 180,   color: '#C0392B' },
  { status: 'On Hold',      count: 105,   color: '#95a5a6' },
];

export const mockCommitteeTypes = [
  { type: 'Central',  count: 1   },
  { type: 'Division', count: 8   },
  { type: 'District', count: 64  },
  { type: 'Upazila',  count: 150 },
  { type: 'Union',    count: 97  },
];
