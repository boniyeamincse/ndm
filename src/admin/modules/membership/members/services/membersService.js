import { adminApi } from '../../../../services/adminApi';

const BASE = '/admin/members';

function normalizeList(payload) {
  return {
    items: payload?.data || [],
    meta: payload?.meta || { current_page: 1, last_page: 1, per_page: 20, total: 0 },
  };
}

async function list(filters = {}) {
  const path = adminApi.withQuery(BASE, {
    search: filters.search,
    status: filters.status,
    gender: filters.gender,
    division: filters.division,
    district: filters.district,
    upazila: filters.upazila,
    sort_by: filters.sort_by,
    sort_dir: filters.sort_dir,
    page: filters.page,
    per_page: filters.per_page,
  });

  const payload = await adminApi.request(path);
  return normalizeList(payload);
}

async function detail(id) {
  const payload = await adminApi.request(`${BASE}/${id}`);
  return payload?.data;
}

function update(id, body) {
  return adminApi.request(`${BASE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

function updateStatus(id, body) {
  return adminApi.request(`${BASE}/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

async function summary() {
  const payload = await adminApi.request('/admin/members-summary');
  const byStatus = payload?.data?.byStatus || {};

  return {
    total: payload?.data?.total || 0,
    active: byStatus.active || 0,
    inactive: byStatus.inactive || 0,
    suspended: byStatus.suspended || 0,
  };
}

export const membersService = {
  list,
  detail,
  update,
  updateStatus,
  summary,
};
