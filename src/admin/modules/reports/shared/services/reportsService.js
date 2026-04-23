import { adminApi } from '../../../../services/adminApi';
import { reportsMock } from '../mock/reportsMock';
import { BD_GEO } from '../../../../../data/bd-geo';

const REPORT_ENDPOINTS = {
  overview: '/reports/overview',
  membership: '/reports/membership-applications',
  committees: '/reports/committees',
  assignments: '/reports/committee-assignments',
  content: '/reports/posts',
  notices: '/reports/notices',
  activity: '/reports/activity-summary',
};

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== '');
}

function normalizeFilters(reportKey, filters = {}) {
  const next = { ...filters };

  delete next.renderControls;

  if (reportKey === 'membership') {
    next.division_id = firstDefined(next.division_id, next.division);
    next.district_id = firstDefined(next.district_id, next.district);
    next.reviewer_id = firstDefined(next.reviewer_id, next.reviewer);
    delete next.division;
    delete next.district;
    delete next.reviewer;
  }

  if (reportKey === 'committees') {
    next.parent_id = firstDefined(next.parent_id, next.parent);
    delete next.parent;
  }

  if (reportKey === 'assignments') {
    next.committee_id = firstDefined(next.committee_id, next.committee);
    next.committee_type_id = firstDefined(next.committee_type_id, next.committee_type);
    next.member_id = firstDefined(next.member_id, next.member);
    next.position_id = firstDefined(next.position_id, next.position);
    delete next.committee;
    delete next.committee_type;
    delete next.member;
    delete next.position;
  }

  if (reportKey === 'content') {
    next.post_category_id = firstDefined(next.post_category_id, next.category);
    next.author_id = firstDefined(next.author_id, next.author);
    next.is_featured = firstDefined(next.is_featured, next.featured);
    delete next.category;
    delete next.author;
    delete next.featured;
  }

  if (reportKey === 'notices') {
    next.committee_id = firstDefined(next.committee_id, next.committee);
    next.is_pinned = firstDefined(next.is_pinned, next.pinned);
    delete next.committee;
    delete next.pinned;
  }

  if (reportKey === 'activity') {
    next.actor_id = firstDefined(next.actor_id, next.actor);
    delete next.actor;
    delete next.activity_type;
    delete next.related_entity_type;
  }

  return next;
}

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

function getGroupCount(groups, key, labels) {
  const labelSet = new Set([].concat(labels).map((label) => String(label).toLowerCase()));
  const entries = Array.isArray(groups?.[key]) ? groups[key] : [];

  return entries.reduce((sum, entry) => {
    if (!labelSet.has(String(entry.label || '').toLowerCase())) {
      return sum;
    }

    return sum + Number(entry.value || 0);
  }, 0);
}

function buildLocation(parts = []) {
  const text = parts.filter(Boolean).join(' / ');
  return text || '—';
}

function resolveDivisionName(divisionName, divisionId) {
  if (divisionName) {
    return divisionName;
  }

  if (!divisionId) {
    return '';
  }

  const division = BD_GEO.find((entry) => String(entry.id) === String(divisionId));
  return division?.name || `Division #${divisionId}`;
}

function resolveDistrictName(districtName, divisionId, districtId) {
  if (districtName) {
    return districtName;
  }

  if (!districtId) {
    return '';
  }

  const division = BD_GEO.find((entry) => String(entry.id) === String(divisionId));
  const district = division?.districts?.find((entry) => String(entry.id) === String(districtId));

  return district?.name || `District #${districtId}`;
}

function formatBoolean(value) {
  return value ? 'Yes' : 'No';
}

function formatActivityAction(type = '') {
  return String(type || '').replaceAll('_', ' ') || 'updated';
}

// Per-report row mappers: transform backend field names to UI column keys
const ROW_MAPPERS = {
  membership: (r) => ({
    application_no: r.application_no,
    applicant:      r.full_name,
    contact:        r.mobile ?? '—',
    location:       buildLocation([
      r.division_name || (r.division_id ? `Division #${r.division_id}` : ''),
      r.district_name || (r.district_id ? `District #${r.district_id}` : ''),
    ]),
    status:         r.status,
    submitted_at:   r.created_at,
    reviewed_by:    r.reviewed_by ?? '—',
    decision_at:    r.approved_at ?? r.rejected_at ?? '—',
  }),
  committees: (r) => {
    const division = resolveDivisionName(r.division_name, r.division_id) || 'Unknown Division';
    const district = resolveDistrictName(r.district_name, r.division_id, r.district_id) || 'Unknown District';

    return {
      committee_no: r.committee_no,
      name:         r.name,
      type:         r.committee_type ?? '—',
      division,
      district,
      division_id:  r.division_id ?? null,
      district_id:  r.district_id ?? null,
      location:     buildLocation([division, district]),
      status:       r.status,
      current:      r.is_current ? 'Yes' : 'No',
      start_date:   r.start_date ?? r.created_at,
      parent:       r.parent_name ?? r.parent_id ?? '—',
    };
  },
  assignments: (r) => ({
    assignment_no:   r.assignment_no,
    member:          r.member_name,
    committee:       r.committee_name,
    position:        r.position_title,
    assignment_type: r.assignment_type,
    primary:         formatBoolean(r.is_primary),
    leadership:      formatBoolean(r.is_leadership),
    status:          r.status,
    start_date:      r.start_date ?? r.created_at,
    end_date:        r.end_date ?? '—',
  }),
  content: (r) => ({
    post_no:      r.post_no,
    title:        r.title,
    type:         r.content_type,
    category:     r.category_name ?? '—',
    author:       r.author_name ?? '—',
    status:       r.status,
    visibility:   r.visibility,
    featured:     formatBoolean(r.is_featured),
    published_at: r.published_at ?? '—',
  }),
  notices: (r) => ({
    notice_no:  r.notice_no,
    title:      r.title,
    type:       r.notice_type,
    priority:   r.priority,
    status:     r.status,
    visibility: r.visibility,
    audience:   r.audience_type ?? '—',
    pinned:     formatBoolean(r.is_pinned),
    publish_at: r.publish_at,
    expires_at: r.expires_at ?? '—',
  }),
};

function normalizeActivity(raw = {}) {
  const rows = Array.isArray(raw.items)
    ? raw.items.map((item) => ({
        ...item,
        action: formatActivityAction(item.type),
        related_entity: item.related_entity_type
          ? `${item.related_entity_type}${item.related_entity_id ? ` #${item.related_entity_id}` : ''}`
          : '—',
      }))
    : [];

  const byModule = Object.entries(raw.by_module || {}).map(([label, value]) => ({ label, value }));
  const byDate = Object.entries(raw.by_date || {}).map(([label, value]) => ({ label, value }));

  return {
    summary: {
      total: raw.total ?? rows.length,
      approvals: rows.filter((item) => /approve/i.test(item.type || item.title || '')).length,
      publications: rows.filter((item) => ['posts', 'notices'].includes(item.module)).length,
      status_changes: rows.filter((item) => /status_changed/i.test(item.type || '')).length,
      committee_actions: rows.filter((item) => ['committees', 'assignments', 'hierarchy'].includes(item.module)).length,
      profile_reviews: rows.filter((item) => item.module === 'profile_requests').length,
    },
    charts: [
      ...(byModule.length ? [{ id: 'by_module', title: 'Activities by Module', type: 'bar', data: byModule }] : []),
      ...(byDate.length ? [{ id: 'by_date', title: 'Activities by Date', type: 'line', data: byDate }] : []),
    ],
    insights: [],
    rows,
    meta: null,
  };
}

function normalizeGeneric(raw, chartMap, reportKey) {
  const mapper = ROW_MAPPERS[reportKey];
  const rawRows = raw.items || raw.rows || [];
  const rows = mapper ? rawRows.map(mapper) : rawRows;

  const summary = {
    ...(raw.summary || {}),
  };

  if (reportKey === 'content') {
    summary.drafts = summary.draft ?? 0;
  }

  if (reportKey === 'assignments') {
    summary.completed = getGroupCount(raw.groups, 'by_status', 'completed');
    summary.office_bearers = getGroupCount(raw.groups, 'by_assignment_type', 'office_bearer');
  }

  if (reportKey === 'notices') {
    summary.urgent = getGroupCount(raw.groups, 'by_priority', ['urgent', 'critical']);
  }

  return {
    summary,
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
  const normalizedFilters = normalizeFilters(reportKey, filters);
  try {
    const payload = await adminApi.request(adminApi.withQuery(endpoint, normalizedFilters));
    const raw = payload?.data || payload;
    if (reportKey === 'overview') return normalizeOverview(raw);
    if (reportKey === 'activity') return normalizeActivity(raw);
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
