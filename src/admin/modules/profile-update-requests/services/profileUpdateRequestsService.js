import { adminApi } from '../../../services/adminApi';
import { profileUpdateRequestsMock } from '../mock/profileUpdateRequestsMock';

const BASE = '/admin/profile-update-requests';
let requestStore = [...profileUpdateRequestsMock];

function normalizeRequestedChanges(changes) {
  if (Array.isArray(changes)) {
    return changes;
  }

  if (!changes || typeof changes !== 'object') {
    return [];
  }

  return Object.entries(changes).map(([field, requestedValue]) => ({
    field,
    current_value: null,
    requested_value: requestedValue,
  }));
}

function normalizeHistory(items = []) {
  if (!Array.isArray(items)) return [];

  return items.map((item) => {
    const changedByUser = item.changed_by_user || item.changed_by || null;
    const changedByName = typeof item.changed_by === 'string'
      ? item.changed_by
      : changedByUser?.name || null;

    return {
      ...item,
      changed_by_user: changedByUser,
      changed_by: changedByName,
      created_at: item.created_at || null,
    };
  });
}

function normalizeRequest(item = {}) {
  const requester = item.requester || item.user || null;
  const reviewedBy = item.reviewed_by || item.reviewer || null;
  const member = item.member
    ? {
        ...item.member,
        name: item.member.name || item.member.full_name || null,
      }
    : null;

  return {
    ...item,
    requester,
    user: requester,
    reviewed_by: reviewedBy,
    reviewer: reviewedBy,
    member,
    submitted_at: item.submitted_at || item.created_at || null,
    requested_changes: normalizeRequestedChanges(item.requested_changes),
    history: normalizeHistory(item.history || []),
  };
}

function normalizeListPayload(payload = {}) {
  const rows = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.items)
      ? payload.items
      : Array.isArray(payload)
        ? payload
        : [];
  const items = rows.map(normalizeRequest);
  const meta = payload?.meta || {
    current_page: 1,
    last_page: 1,
    per_page: items.length || 20,
    total: items.length,
  };

  return {
    items,
    meta,
    summary: buildSummary(items),
  };
}

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
    return normalizeListPayload(payload);
  } catch {
    const filtered = filterRequests(filters);
    const paged = paginate(filtered, filters.page, filters.per_page);
    const items = paged.items.map(normalizeRequest);
    return { items, meta: paged.meta, summary: buildSummary(filtered.map(normalizeRequest)) };
  }
}

async function detail(id) {
  try {
    const payload = await adminApi.request(`${BASE}/${id}`);
    return normalizeRequest(payload?.data || payload || {});
  } catch {
    const found = requestStore.find((item) => String(item.id) === String(id));
    return found ? normalizeRequest(found) : null;
  }
}

async function approve(id, payload = {}) {
  const requestPayload = {
    note: payload.note || payload.review_note || '',
  };

  try {
    await adminApi.request(`${BASE}/${id}/approve`, { method: 'PATCH', body: JSON.stringify(requestPayload) });
  } catch {
    requestStore = requestStore.map((item) => (String(item.id) === String(id)
      ? {
          ...item,
          status: 'approved',
          reviewed_by: { id: 1, name: 'Admin Review Desk' },
          reviewed_at: new Date().toISOString(),
          history: [...(item.history || []), { id: Date.now(), new_status: 'approved', changed_by: 'Admin Review Desk', created_at: new Date().toISOString(), note: requestPayload.note || 'Approved from admin panel.' }],
        }
      : item));
  }
  return detail(id);
}

async function reject(id, payload = {}) {
  const requestPayload = {
    rejection_reason: payload.rejection_reason,
    note: payload.note || payload.review_note || '',
  };

  try {
    await adminApi.request(`${BASE}/${id}/reject`, { method: 'PATCH', body: JSON.stringify(requestPayload) });
  } catch {
    requestStore = requestStore.map((item) => (String(item.id) === String(id)
      ? {
          ...item,
          status: 'rejected',
          rejection_reason: requestPayload.rejection_reason,
          reviewed_by: { id: 1, name: 'Admin Review Desk' },
          reviewed_at: new Date().toISOString(),
          history: [...(item.history || []), { id: Date.now(), new_status: 'rejected', changed_by: 'Admin Review Desk', created_at: new Date().toISOString(), note: requestPayload.note || requestPayload.rejection_reason || 'Rejected from admin panel.' }],
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
