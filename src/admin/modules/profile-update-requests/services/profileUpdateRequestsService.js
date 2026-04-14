import { adminApi } from '../../../services/adminApi';
import { profileUpdateRequestsMock } from '../mock/profileUpdateRequestsMock';

const BASE = '/admin/profile-update-requests';
let requestStore = [...profileUpdateRequestsMock];

function paginate(items = [], page = 1, perPage = 20) {
  const currentPage = Number(page) || 1;
  const size = Number(perPage) || 20;
  const start = (currentPage - 1) * size;
  return {
    items: items.slice(start, start + size),
    meta: {
      current_page: currentPage,
      last_page: Math.max(1, Math.ceil(items.length / size)),
      per_page: size,
      total: items.length,
    },
  };
}

function filterRequests(filters = {}) {
  const query = String(filters.search || '').trim().toLowerCase();
  return requestStore.filter((item) => {
    const matchesQuery = !query || [item.request_no, item.requester?.name, item.member?.member_no].some((value) => String(value || '').toLowerCase().includes(query));
    const matchesType = !filters.request_type || item.request_type === filters.request_type;
    const matchesStatus = !filters.status || item.status === filters.status;
    const matchesReviewer = !filters.reviewer || String(item.reviewed_by?.name || '').toLowerCase().includes(String(filters.reviewer).toLowerCase());
    return matchesQuery && matchesType && matchesStatus && matchesReviewer;
  });
}

function buildSummary(items = requestStore) {
  const now = Date.now();
  const recentThreshold = now - (7 * 24 * 60 * 60 * 1000);
  return {
    total: items.length,
    pending: items.filter((item) => item.status === 'pending').length,
    approved: items.filter((item) => item.status === 'approved').length,
    rejected: items.filter((item) => item.status === 'rejected').length,
    cancelled: items.filter((item) => item.status === 'cancelled').length,
    recent: items.filter((item) => new Date(item.submitted_at).getTime() >= recentThreshold).length,
  };
}

async function list(filters = {}) {
  try {
    const payload = await adminApi.request(adminApi.withQuery(BASE, filters));
    return payload?.data || payload;
  } catch {
    const filtered = filterRequests(filters);
    const paged = paginate(filtered, filters.page, filters.per_page);
    return { items: paged.items, meta: paged.meta, summary: buildSummary() };
  }
}

async function detail(id) {
  try {
    const payload = await adminApi.request(`${BASE}/${id}`);
    return payload?.data || payload;
  } catch {
    return requestStore.find((item) => String(item.id) === String(id)) || null;
  }
}

async function approve(id, payload = {}) {
  try {
    await adminApi.request(`${BASE}/${id}/approve`, { method: 'PATCH', body: JSON.stringify(payload) });
  } catch {
    requestStore = requestStore.map((item) => (String(item.id) === String(id)
      ? {
          ...item,
          status: 'approved',
          reviewed_by: { id: 1, name: 'Admin Review Desk' },
          reviewed_at: new Date().toISOString(),
          history: [...(item.history || []), { id: Date.now(), new_status: 'approved', changed_by: 'Admin Review Desk', created_at: new Date().toISOString(), note: payload.review_note || 'Approved from admin panel.' }],
        }
      : item));
  }
  return detail(id);
}

async function reject(id, payload = {}) {
  try {
    await adminApi.request(`${BASE}/${id}/reject`, { method: 'PATCH', body: JSON.stringify(payload) });
  } catch {
    requestStore = requestStore.map((item) => (String(item.id) === String(id)
      ? {
          ...item,
          status: 'rejected',
          rejection_reason: payload.rejection_reason,
          reviewed_by: { id: 1, name: 'Admin Review Desk' },
          reviewed_at: new Date().toISOString(),
          history: [...(item.history || []), { id: Date.now(), new_status: 'rejected', changed_by: 'Admin Review Desk', created_at: new Date().toISOString(), note: payload.review_note || payload.rejection_reason || 'Rejected from admin panel.' }],
        }
      : item));
  }
  return detail(id);
}

export const profileUpdateRequestsService = {
  list,
  detail,
  approve,
  reject,
};
