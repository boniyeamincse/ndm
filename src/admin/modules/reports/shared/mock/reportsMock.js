export const reportsMock = {
  overview: {
    title: 'Overview Report',
    subtitle: 'Executive operating summary across membership, organization, content, and approvals.',
    summary: {
      total_members: 12486,
      total_committees: 312,
      active_assignments: 1189,
      published_posts: 236,
      published_notices: 74,
      pending_applications: 41,
      pending_profile_requests: 7,
    },
    charts: [
      {
        id: 'member-growth',
        title: 'Member Growth Trend',
        type: 'line',
        data: [
          { label: 'Nov', value: 9800 },
          { label: 'Dec', value: 10110 },
          { label: 'Jan', value: 10680 },
          { label: 'Feb', value: 11320 },
          { label: 'Mar', value: 11920 },
          { label: 'Apr', value: 12486 },
        ],
      },
      {
        id: 'application-status',
        title: 'Applications by Status',
        type: 'donut',
        data: [
          { label: 'Pending', value: 41 },
          { label: 'Approved', value: 188 },
          { label: 'Rejected', value: 23 },
          { label: 'On Hold', value: 12 },
        ],
      },
      {
        id: 'committee-types',
        title: 'Committees by Type',
        type: 'bar',
        data: [
          { label: 'Central', value: 1 },
          { label: 'Division', value: 8 },
          { label: 'District', value: 64 },
          { label: 'Upazila', value: 124 },
          { label: 'Union', value: 115 },
        ],
      },
      {
        id: 'content-summary',
        title: 'Content Summary',
        type: 'bar',
        data: [
          { label: 'Posts', value: 236 },
          { label: 'Notices', value: 74 },
          { label: 'Featured', value: 26 },
          { label: 'Pinned', value: 12 },
        ],
      },
      {
        id: 'notice-priority',
        title: 'Notices by Priority',
        type: 'donut',
        data: [
          { label: 'Normal', value: 34 },
          { label: 'High', value: 21 },
          { label: 'Urgent', value: 13 },
          { label: 'Critical', value: 6 },
        ],
      },
    ],
    insights: [
      { title: 'Recent Activity Preview', body: 'Editorial and membership workflows remain the highest-volume operational areas this week.' },
      { title: 'Operational Insight', body: 'Approval turnaround improved by 12% compared to the previous period.' },
      { title: 'Top Committees', body: 'Dhaka District and Central Committee show the highest recent workflow activity.' },
      { title: 'Expiring Notices', body: '3 published notices expire within the next 5 days and may need renewal.' },
    ],
    rows: [
      { entity: 'Notice', title: 'Workshop circular expiring soon', module: 'Notices', status: 'published', date: '2026-04-18' },
      { entity: 'Application', title: 'Pending membership review queue', module: 'Membership', status: 'pending', date: '2026-04-14' },
    ],
  },
  membership: {
    title: 'Membership Report',
    subtitle: 'Membership application flow, approvals, and location trends.',
    summary: { total: 264, pending: 41, approved: 188, rejected: 23, on_hold: 12, approval_rate: '71.2%' },
    charts: [
      { id: 'apps-by-month', title: 'Applications by Month', type: 'line', data: [{ label: 'Nov', value: 22 }, { label: 'Dec', value: 29 }, { label: 'Jan', value: 36 }, { label: 'Feb', value: 49 }, { label: 'Mar', value: 58 }, { label: 'Apr', value: 70 }] },
      { id: 'status-breakdown', title: 'Status Breakdown', type: 'donut', data: [{ label: 'Pending', value: 41 }, { label: 'Approved', value: 188 }, { label: 'Rejected', value: 23 }, { label: 'On Hold', value: 12 }] },
      { id: 'division-wise', title: 'Division-wise Applications', type: 'bar', data: [{ label: 'Dhaka', value: 96 }, { label: 'Chattogram', value: 51 }, { label: 'Rajshahi', value: 33 }, { label: 'Khulna', value: 28 }, { label: 'Barishal', value: 21 }] },
      { id: 'approval-trend', title: 'Approval Trend', type: 'line', data: [{ label: 'Week 1', value: 12 }, { label: 'Week 2', value: 18 }, { label: 'Week 3', value: 26 }, { label: 'Week 4', value: 31 }] },
    ],
    rows: [
      { application_no: 'APP-2026-1001', applicant: 'Arafat Kabir', contact: '01711...', location: 'Dhaka', status: 'approved', submitted_at: '2026-04-01', reviewed_by: 'Review Desk', decision_at: '2026-04-03' },
      { application_no: 'APP-2026-1002', applicant: 'Nadia Sultana', contact: '01712...', location: 'Cumilla', status: 'pending', submitted_at: '2026-04-04', reviewed_by: '—', decision_at: '—' },
      { application_no: 'APP-2026-1003', applicant: 'Sabbir Hossain', contact: '01713...', location: 'Gazipur', status: 'rejected', submitted_at: '2026-04-05', reviewed_by: 'Review Desk', decision_at: '2026-04-06' },
    ],
  },
  committees: {
    title: 'Committee Report',
    subtitle: 'Committee lifecycle, type spread, and current status distribution.',
    summary: { total: 312, active: 271, inactive: 18, dissolved: 7, archived: 16, current: 257 },
    charts: [
      { id: 'committees-by-type', title: 'Committees by Type', type: 'bar', data: [{ label: 'Central', value: 1 }, { label: 'Division', value: 8 }, { label: 'District', value: 64 }, { label: 'Upazila', value: 124 }, { label: 'Union', value: 115 }] },
      { id: 'committees-by-division', title: 'Committees by Division', type: 'bar', data: [{ label: 'Dhaka', value: 78 }, { label: 'Chattogram', value: 61 }, { label: 'Rajshahi', value: 44 }, { label: 'Khulna', value: 39 }] },
      { id: 'active-vs-inactive', title: 'Active vs Inactive', type: 'donut', data: [{ label: 'Active', value: 271 }, { label: 'Inactive', value: 18 }, { label: 'Dissolved', value: 7 }, { label: 'Archived', value: 16 }] },
      { id: 'formation-trend', title: 'Formation Trend', type: 'line', data: [{ label: '2021', value: 22 }, { label: '2022', value: 59 }, { label: '2023', value: 88 }, { label: '2024', value: 104 }, { label: '2025', value: 39 }] },
    ],
    rows: [
      { committee_no: 'COM-2026-001', name: 'Dhaka District Committee', type: 'District', location: 'Dhaka', status: 'active', current: 'Yes', start_date: '2026-01-10', parent: 'Dhaka Division Committee' },
      { committee_no: 'COM-2026-008', name: 'Cumilla District Committee', type: 'District', location: 'Cumilla', status: 'inactive', current: 'No', start_date: '2024-03-11', parent: 'Chattogram Division Committee' },
    ],
  },
  assignments: {
    title: 'Assignment Report',
    subtitle: 'Assignment coverage, leadership seats, and position distribution across committees.',
    summary: { total: 1189, active: 1011, inactive: 64, completed: 114, office_bearers: 302, leadership: 214 },
    charts: [
      { id: 'assignment-by-committee-type', title: 'Assignments by Committee Type', type: 'bar', data: [{ label: 'Central', value: 73 }, { label: 'Division', value: 122 }, { label: 'District', value: 334 }, { label: 'Upazila', value: 381 }, { label: 'Union', value: 279 }] },
      { id: 'assignment-by-position', title: 'Assignments by Position', type: 'bar', data: [{ label: 'President', value: 65 }, { label: 'Secretary', value: 91 }, { label: 'Organizer', value: 132 }, { label: 'Member', value: 612 }] },
      { id: 'leadership-vs-general', title: 'Leadership vs General', type: 'donut', data: [{ label: 'Leadership', value: 214 }, { label: 'General', value: 975 }] },
      { id: 'assignment-trend', title: 'Assignment Trend Over Time', type: 'line', data: [{ label: 'Jan', value: 121 }, { label: 'Feb', value: 188 }, { label: 'Mar', value: 246 }, { label: 'Apr', value: 314 }] },
    ],
    rows: [
      { assignment_no: 'ASN-001', member: 'Nusrat Jahan', committee: 'Central Committee', position: 'Secretary', assignment_type: 'office_bearer', primary: 'Yes', leadership: 'Yes', status: 'active', start_date: '2026-02-01', end_date: '—' },
      { assignment_no: 'ASN-002', member: 'Rafat Karim', committee: 'Dhaka District Committee', position: 'Organizer', assignment_type: 'general', primary: 'No', leadership: 'No', status: 'completed', start_date: '2025-01-01', end_date: '2026-01-01' },
    ],
  },
  content: {
    title: 'Content Report',
    subtitle: 'Editorial pipeline, publishing mix, and visibility analytics.',
    summary: { total: 236, drafts: 18, pending_review: 11, published: 186, archived: 21, featured: 26 },
    charts: [
      { id: 'posts-by-type', title: 'Posts by Content Type', type: 'donut', data: [{ label: 'News', value: 92 }, { label: 'Blog', value: 58 }, { label: 'Statement', value: 31 }, { label: 'Press', value: 27 }, { label: 'Update', value: 28 }] },
      { id: 'posts-by-category', title: 'Posts by Category', type: 'bar', data: [{ label: 'National Updates', value: 72 }, { label: 'Campaigns', value: 51 }, { label: 'Statements', value: 34 }, { label: 'Programs', value: 29 }] },
      { id: 'publishing-trend', title: 'Publishing Trend', type: 'line', data: [{ label: 'Jan', value: 28 }, { label: 'Feb', value: 41 }, { label: 'Mar', value: 53 }, { label: 'Apr', value: 64 }] },
      { id: 'visibility-distribution', title: 'Visibility Distribution', type: 'donut', data: [{ label: 'Public', value: 179 }, { label: 'Members Only', value: 41 }, { label: 'Internal', value: 16 }] },
    ],
    rows: [
      { post_no: 'POST-2026-001', title: 'Campus dialogue series launch', type: 'news', category: 'National Updates', author: 'Shahid Islam', status: 'published', visibility: 'public', featured: 'Yes', published_at: '2026-04-10' },
      { post_no: 'POST-2026-002', title: 'Education reform statement', type: 'statement', category: 'Statements', author: 'Tanvir Hasan', status: 'pending_review', visibility: 'members_only', featured: 'No', published_at: '—' },
    ],
  },
  notices: {
    title: 'Notice Report',
    subtitle: 'Notice publishing activity, urgency levels, and audience targeting distribution.',
    summary: { total: 74, published: 52, draft: 10, pinned: 12, expired: 5, urgent: 19 },
    charts: [
      { id: 'notices-by-priority', title: 'Notices by Priority', type: 'donut', data: [{ label: 'Normal', value: 28 }, { label: 'High', value: 21 }, { label: 'Urgent', value: 17 }, { label: 'Critical', value: 8 }] },
      { id: 'audience-type', title: 'Notices by Audience Type', type: 'bar', data: [{ label: 'All', value: 16 }, { label: 'Committee', value: 22 }, { label: 'Leadership', value: 13 }, { label: 'Members', value: 11 }, { label: 'Custom', value: 12 }] },
      { id: 'visibility', title: 'Visibility Mix', type: 'donut', data: [{ label: 'Public', value: 21 }, { label: 'Members Only', value: 33 }, { label: 'Internal', value: 20 }] },
      { id: 'notice-publishing-trend', title: 'Publishing Trend', type: 'line', data: [{ label: 'Jan', value: 9 }, { label: 'Feb', value: 12 }, { label: 'Mar', value: 14 }, { label: 'Apr', value: 17 }] },
    ],
    rows: [
      { notice_no: 'NOT-2026-001', title: 'Central training workshop', type: 'circular', priority: 'urgent', status: 'published', visibility: 'members_only', audience: 'leadership_only', pinned: 'Yes', publish_at: '2026-04-12', expires_at: '2026-04-22' },
      { notice_no: 'NOT-2026-002', title: 'Membership audit deadline', type: 'deadline', priority: 'high', status: 'pending_review', visibility: 'internal', audience: 'committee_specific', pinned: 'No', publish_at: '2026-04-18', expires_at: '2026-04-30' },
    ],
    insights: [
      { title: 'Expiring Soon', body: '5 notices expire within the next 7 days.' },
    ],
  },
  activity: {
    title: 'Activity Report',
    subtitle: 'Administrative actions, publications, and review activity across modules.',
    summary: { total: 1468, approvals: 222, publications: 310, status_changes: 411, committee_actions: 184, profile_reviews: 39 },
    charts: [
      { id: 'activities-by-module', title: 'Activities by Module', type: 'bar', data: [{ label: 'Membership', value: 422 }, { label: 'Content', value: 310 }, { label: 'Organization', value: 287 }, { label: 'Profile Requests', value: 39 }, { label: 'Settings', value: 21 }] },
      { id: 'activities-by-period', title: 'Activities by Day/Week/Month', type: 'line', data: [{ label: 'Mon', value: 41 }, { label: 'Tue', value: 52 }, { label: 'Wed', value: 61 }, { label: 'Thu', value: 48 }, { label: 'Fri', value: 69 }] },
      { id: 'approval-vs-rejection', title: 'Approval vs Rejection', type: 'donut', data: [{ label: 'Approvals', value: 222 }, { label: 'Rejections', value: 37 }] },
      { id: 'publications-vs-updates', title: 'Publications vs Updates', type: 'bar', data: [{ label: 'Publications', value: 310 }, { label: 'Updates', value: 188 }] },
    ],
    rows: [
      { module: 'Content', action: 'publish', title: 'Published campus dialogue post', actor: 'Nusrat Jahan', related_entity: 'POST-2026-001', created_at: '2026-04-10 09:00' },
      { module: 'Profile Requests', action: 'approve', title: 'Approved identity update', actor: 'Admin Review Desk', related_entity: 'PUR-2026-002', created_at: '2026-04-12 15:30' },
      { module: 'Organization', action: 'status_change', title: 'Committee archived', actor: 'Operations Admin', related_entity: 'COM-2025-031', created_at: '2026-04-13 11:20' },
    ],
  },
};
