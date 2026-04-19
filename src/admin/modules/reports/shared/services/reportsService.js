import { adminApi } from '../../../../services/adminApi';
import { reportsMock } from '../mock/reportsMock';

const REPORT_ENDPOINTS = {
  overview: '/reports/overview',
  membership: '/reports/membership-applications',
  committees: '/reports/committees',
  assignments: '/reports/committee-assignments',
  content: '/reports/posts',
  notices: '/reports/notices',
  activity: '/reports/activity-summary',
};

function applySearch(rows = [], filters = {}) {
  const query = String(filters.search || '').trim().toLowerCase();
  if (!query) return rows;
  return rows.filter((row) => Object.values(row).some((value) => String(value || '').toLowerCase().includes(query)));
}

function paginate(rows = [], page = 1, perPage = 20) {
  const currentPage = Number(page) || 1;
  const size = Number(perPage) || 20;
  const start = (currentPage - 1) * size;
  return {
    items: rows.slice(start, start + size),
    meta: {
      current_page: currentPage,
      last_page: Math.max(1, Math.ceil(rows.length / size)),
      per_page: size,
      total: rows.length,
    },
  };
}

/**
 * The backend /reports/overview endpoint returns a flat object:
 *   { total_members, active_members, total_committees, total_assignments,
 *     total_published_posts, total_published_notices, pending_applications,
 *     pending_profile_requests, reporting_relations_active }
 *
 * The UI consumes it via data.summary.* so we normalize here.
 */
function normalizeOverview(raw) {
  return {
    summary: {
      total_members:            raw.total_members            ?? 0,
      total_committees:         raw.total_committees         ?? 0,
      active_assignments:       raw.total_assignments        ?? 0,
      published_posts:          raw.total_published_posts    ?? 0,
      published_notices:        raw.total_published_notices  ?? 0,
      pending_applications:     raw.pending_applications     ?? 0,
      pending_profile_requests: raw.pending_profile_requests ?? 0,
    },
    charts:   raw.charts   || [],
    insights: raw.insights  || [],
    rows:     raw.rows      || [],
    meta:     raw.meta      || null,
  };
}

/**
 * Backend returns { summary, groups, items, meta }.
 * UI expects  { summary, charts, rows, meta }.
 * This converts groups (key → [{label,value}]) into a charts array.
 */
function groupsToCharts(groups, map) {
  return map
    .filter(({ key }) => Array.isArray(groups?.[key]) && groups[key].length)
    .map(({ key, title, type }) => ({
      id:    key,
      title,
      type:  type || 'bar',
      data:  groups[key],
    }));
}

// Per-report row mappers: transform backend field names to UI column keys
const ROW_MAPPERS = {
  membership: (r) => ({
    application_no: r.application_no,
    applicant:      r.full_name,
    contact:        r.phone ?? '—',
    location:       r.division_id ? `Div #${r.division_id}` : '—',
    status:         r.status,
    submitted_at:   r.created_at,
    reviewed_by:    r.reviewed_by ?? '—',
    decision_at:    r.approved_at ?? r.rejected_at ?? '—',
  }),
  committees: (r) => ({
    committee_no: r.committee_no,
    name:         r.name,
    type:         r.committee_type ?? '—',
    status:       r.status,
    current:      r.is_current ? 'Yes' : 'No',
    start_date:   r.created_at,
    parent:       r.parent_id ?? '—',
  }),
  assignments: (r) => ({
    assignment_no:   r.assignment_no,
    member:          r.member_name,
    committee:       r.committee_name,
    position:        r.position_title,
    assignment_type: r.assignment_type,
    leadership:      r.is_leadership ? 'Yes' : 'No',
    status:          r.status,
    start_date:      r.created_at,
  }),
  content: (r) => ({
    post_no:      r.post_no,
    title:        r.title,
    type:         r.content_type,
    status:       r.status,
    visibility:   r.visibility,
    featured:     r.is_featured ? 'Yes' : 'No',
    published_at: r.published_at ?? '—',
  }),
  notices: (r) => ({
    notice_no:  r.notice_no,
    title:      r.title,
    type:       r.notice_type,
    priority:   r.priority,
    status:     r.status,
    visibility: r.visibility,
    pinned:     r.is_pinned ? 'Yes' : 'No',
    publish_at: r.publish_at,
    expires_at: r.expires_at ?? '—',
  }),
};

function normalizeGeneric(raw, chartMap, reportKey) {
  const mapper = ROW_MAPPERS[reportKey];
  const rawRows = raw.items || raw.rows || [];
  const rows = mapper ? rawRows.map(mapper) : rawRows;
  return {
    summary:  raw.summary  || {},
    charts:   groupsToCharts(raw.groups, chartMap),
    insights: raw.insights || [],
    rows,
    meta:     raw.meta     || null,
  };
}

const CHART_MAPS = {
  membership: [
    { key: 'by_status',   title: 'Applications by Status',      type: 'donut' },
    { key: 'by_division', title: 'Division-wise Applications',   type: 'bar'   },
    { key: 'by_district', title: 'District-wise Applications',   type: 'bar'   },
  ],
  committees: [
    { key: 'by_type',     title: 'Committees by Type',           type: 'bar'   },
    { key: 'by_status',   title: 'Active vs Inactive',           type: 'donut' },
    { key: 'by_division', title: 'Committees by Division',       type: 'bar'   },
    { key: 'by_district', title: 'Committees by District',       type: 'bar'   },
  ],
  assignments: [
    { key: 'by_assignment_type',  title: 'Assignments by Type',          type: 'donut' },
    { key: 'by_committee_type',   title: 'Assignments by Committee Type', type: 'bar'   },
    { key: 'by_status',           title: 'Assignment Status',             type: 'donut' },
  ],
  content: [
    { key: 'by_content_type', title: 'Posts by Content Type',    type: 'donut' },
    { key: 'by_status',       title: 'Posts by Status',          type: 'bar'   },
    { key: 'by_category',     title: 'Posts by Category',        type: 'bar'   },
    { key: 'by_visibility',   title: 'Visibility Distribution',  type: 'donut' },
  ],
  notices: [
    { key: 'by_notice_type', title: 'Notices by Type',           type: 'donut' },
    { key: 'by_priority',    title: 'Notices by Priority',       type: 'donut' },
    { key: 'by_status',      title: 'Publishing Status',         type: 'bar'   },
    { key: 'by_audience',    title: 'Notices by Audience',       type: 'bar'   },
  ],
  activity: [
    { key: 'by_module', title: 'Activities by Module',           type: 'bar'   },
    { key: 'by_action', title: 'Activities by Action',           type: 'donut' },
  ],
};

async function getReport(reportKey, filters = {}) {
  const endpoint = REPORT_ENDPOINTS[reportKey];
  try {
    const payload = await adminApi.request(adminApi.withQuery(endpoint, filters));
    const raw = payload?.data || payload;
    if (reportKey === 'overview') return normalizeOverview(raw);
    if (CHART_MAPS[reportKey])   return normalizeGeneric(raw, CHART_MAPS[reportKey], reportKey);
    return raw;
  } catch {
    const report = reportsMock[reportKey];
    const paged = paginate(applySearch(report.rows || [], filters), filters.page, filters.per_page);
    return { ...report, rows: paged.items, meta: paged.meta };
  }
}

export const reportsService = {
  getReport,
};
