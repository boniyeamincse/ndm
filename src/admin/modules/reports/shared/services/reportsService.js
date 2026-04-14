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

async function getReport(reportKey, filters = {}) {
  const endpoint = REPORT_ENDPOINTS[reportKey];
  try {
    const payload = await adminApi.request(adminApi.withQuery(endpoint, filters));
    return payload?.data || payload;
  } catch {
    const report = reportsMock[reportKey];
    const paged = paginate(applySearch(report.rows || [], filters), filters.page, filters.per_page);
    return { ...report, rows: paged.items, meta: paged.meta };
  }
}

export const reportsService = {
  getReport,
};
