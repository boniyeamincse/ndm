import { adminApi } from '../../../../services/adminApi';

const BASE = '/admin/membership-applications';

function mapListResponse(payload) {
  return {
    items: payload?.data || [],
    meta: payload?.meta || { current_page: 1, last_page: 1, per_page: 20, total: 0 },
  };
}

async function list(filters = {}) {
  const path = adminApi.withQuery(BASE, {
    status: filters.status,
    search: filters.search,
    division: filters.division,
    district: filters.district,
    from: filters.from,
    to: filters.to,
    desired_committee_level: filters.desired_committee_level,
    sort: filters.sort,
    page: filters.page,
    per_page: filters.per_page,
  });

  const payload = await adminApi.request(path);
  return mapListResponse(payload);
}

async function summary(baseFilters = {}) {
  const statuses = ['', 'pending', 'under_review', 'approved', 'rejected', 'on_hold'];
  const keys = ['total', 'pending', 'under_review', 'approved', 'rejected', 'on_hold'];

  const counts = await Promise.all(
    statuses.map((status) => list({ ...baseFilters, status, page: 1, per_page: 1 }))
  );

  return keys.reduce((result, key, index) => {
    result[key] = counts[index].meta.total || 0;
    return result;
  }, {});
}

async function detail(id) {
  const payload = await adminApi.request(`${BASE}/${id}`);
  return payload?.data;
}

function review(id, remarks) {
  return adminApi.request(`${BASE}/${id}/review`, {
    method: 'PUT',
    body: JSON.stringify({ remarks }),
  });
}

function approve(id, remarks) {
  return adminApi.request(`${BASE}/${id}/approve`, {
    method: 'PUT',
    body: JSON.stringify({ remarks }),
  });
}

function reject(id, rejection_reason) {
  return adminApi.request(`${BASE}/${id}/reject`, {
    method: 'PUT',
    body: JSON.stringify({ rejection_reason }),
  });
}

function hold(id, remarks) {
  return adminApi.request(`${BASE}/${id}/hold`, {
    method: 'PUT',
    body: JSON.stringify({ remarks }),
  });
}

export const membershipApplicationsService = {
  list,
  detail,
  summary,
  review,
  approve,
  reject,
  hold,
};
