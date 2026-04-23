import { adminApi } from '../../../../services/adminApi';
import { noticesMock } from '../mock/noticesMock';
import { extractEntity, normalizeListPayload } from '../../shared/utils/resourceTransforms';

const BASE = '/admin/notices';
const SUMMARY = '/admin/notices-summary';
let noticesStore = [...noticesMock];

function getToken() {
  return localStorage.getItem('ndm_token');
}

async function requestFormData(path, method, formData) {
  const token = getToken();
  const response = await fetch(`/api/v1${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(payload.message || `Request failed (${response.status})`);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

function appendFormValue(formData, key, value) {
  if (value === undefined || value === null || value === '') return;

  if (Array.isArray(value)) {
    value.forEach((entry, index) => {
      if (entry === undefined || entry === null) return;

      if (entry instanceof File) {
        formData.append(`${key}[]`, entry);
      } else if (typeof entry === 'object') {
        Object.entries(entry).forEach(([nestedKey, nestedValue]) => {
          appendFormValue(formData, `${key}[${index}][${nestedKey}]`, nestedValue);
        });
      } else {
        formData.append(`${key}[]`, String(entry));
      }
    });
    return;
  }

  if (value instanceof File) {
    formData.append(key, value);
    return;
  }

  if (typeof value === 'boolean') {
    formData.append(key, value ? '1' : '0');
    return;
  }

  formData.append(key, String(value));
}

function nextId() {
  return noticesStore.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
}

function mapNotice(item) {
  const timeline = Array.isArray(item.status_history)
    ? item.status_history
    : Array.isArray(item.status_history_timeline)
      ? item.status_history_timeline.map((entry) => ({
          id: entry.id,
          title: `Status: ${entry.old_status || 'none'} -> ${entry.new_status || 'unknown'}`,
          description: entry.note || entry.changed_by?.name || '',
          at: entry.created_at,
        }))
      : [];

  return {
    ...item,
    committee_name: item.committee?.name || item.committee_name || '—',
    author_name: item.author?.name || item.author_name || '—',
    approver_name: item.approver?.name || item.approver_name || '—',
    status_history: timeline,
  };
}

function applyFilters(items, filters = {}) {
  const query = String(filters.search || '').toLowerCase().trim();
  return items.filter((item) => {
    const matchesQuery = !query || [item.title, item.slug, item.summary, item.notice_no].some((field) => String(field || '').toLowerCase().includes(query));
    const matchesType = !filters.notice_type || item.notice_type === filters.notice_type;
    const matchesPriority = !filters.priority || item.priority === filters.priority;
    const matchesStatus = !filters.status || item.status === filters.status;
    const matchesVisibility = !filters.visibility || item.visibility === filters.visibility;
    const matchesAudience = !filters.audience_type || item.audience_type === filters.audience_type;
    const matchesCommittee = !filters.committee_id || String(item.committee_id) === String(filters.committee_id);
    const matchesAuthor = !filters.author_id || String(item.author_id) === String(filters.author_id);
    const matchesApprover = !filters.approver_id || String(item.approver_id) === String(filters.approver_id);
    const matchesPinned = !filters.pinned_only || item.is_pinned;
    const matchesAck = !filters.requires_acknowledgement || item.requires_acknowledgement;
    const matchesActive = !filters.active_only || (item.status === 'published' && (!item.expires_at || new Date(item.expires_at) > new Date()));
    return matchesQuery && matchesType && matchesPriority && matchesStatus && matchesVisibility && matchesAudience && matchesCommittee && matchesAuthor && matchesApprover && matchesPinned && matchesAck && matchesActive;
  });
}

function paginate(items, page = 1, perPage = 20) {
  const currentPage = Number(page) || 1;
  const size = Number(perPage) || 20;
  const start = (currentPage - 1) * size;
  const paged = items.slice(start, start + size);
  return {
    items: paged,
    meta: {
      current_page: currentPage,
      last_page: Math.max(1, Math.ceil(items.length / size)),
      per_page: size,
      total: items.length,
    },
  };
}

function buildSummary(items = noticesStore) {
  const now = new Date();
  return {
    total: items.length,
    draft: items.filter((item) => item.status === 'draft').length,
    published: items.filter((item) => item.status === 'published').length,
    pinned: items.filter((item) => item.is_pinned).length,
    expired: items.filter((item) => item.expires_at && new Date(item.expires_at) < now).length,
    urgent: items.filter((item) => ['urgent', 'critical'].includes(item.priority)).length,
  };
}

async function list(filters = {}) {
  try {
    const payload = await adminApi.request(adminApi.withQuery(BASE, filters));
    const result = normalizeListPayload(payload);
    return { ...result, items: result.items.map(mapNotice) };
  } catch {
    const filtered = applyFilters(noticesStore, filters).map(mapNotice);
    return paginate(filtered, filters.page, filters.per_page);
  }
}

async function detail(id) {
  try {
    const payload = await adminApi.request(`${BASE}/${id}`);
    return mapNotice(extractEntity(payload));
  } catch {
    return mapNotice(noticesStore.find((item) => String(item.id) === String(id)) || noticesStore[0]);
  }
}

async function summary() {
  try {
    const payload = await adminApi.request(SUMMARY);
    const data = payload?.data || {};
    return {
      total: data.total || data.total_notices || 0,
      draft: data.draft || data.total_drafts || 0,
      published: data.published || data.total_published || 0,
      pinned: data.pinned || data.total_pinned || 0,
      expired: data.expired || data.total_expired || 0,
      urgent: data.urgent || data.by_priority?.urgent || 0,
    };
  } catch {
    return buildSummary();
  }
}

async function save(id, data) {
  const path = id ? `${BASE}/${id}` : BASE;
  const method = id ? 'PUT' : 'POST';
  try {
    const formData = new FormData();
    Object.entries(data || {}).forEach(([key, value]) => {
      appendFormValue(formData, key, value);
    });

    const payload = await requestFormData(path, method, formData);
    return mapNotice(extractEntity(payload));
  } catch {
    if (id) {
      noticesStore = noticesStore.map((item) => (String(item.id) === String(id) ? { ...item, ...data, updated_at: new Date().toISOString() } : item));
      return mapNotice(noticesStore.find((item) => String(item.id) === String(id)));
    }
    const created = {
      ...data,
      id: nextId(),
      uuid: `notice-${nextId()}`,
      notice_no: data.notice_no || `NOT-2026-${String(nextId()).padStart(3, '0')}`,
      attachments: data.attachments || [],
      attachment_count: (data.attachments || []).length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status_history: [{ id: 1, title: 'Draft created', description: 'Created in admin panel', at: new Date().toISOString() }],
    };
    noticesStore = [created, ...noticesStore];
    return mapNotice(created);
  }
}

async function changeStatus(id, status, extra = {}) {
  try {
    await adminApi.request(`${BASE}/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, ...extra }) });
  } catch {
    noticesStore = noticesStore.map((item) => (String(item.id) === String(id)
      ? {
          ...item,
          status,
          publish_at: status === 'published' ? extra.publish_at || new Date().toISOString() : item.publish_at,
          updated_at: new Date().toISOString(),
          status_history: [
            ...(item.status_history || []),
            { id: Date.now(), title: `Status changed to ${status}`, description: 'Updated via admin workflow', at: new Date().toISOString() },
          ],
        }
      : item));
  }
  return detail(id);
}

async function pin(id, is_pinned) {
  try {
    await adminApi.request(`${BASE}/${id}/pin`, { method: 'PATCH', body: JSON.stringify({ is_pinned }) });
  } catch {
    noticesStore = noticesStore.map((item) => (String(item.id) === String(id) ? { ...item, is_pinned, updated_at: new Date().toISOString() } : item));
  }
  return detail(id);
}

async function uploadAttachment(id, files = []) {
  try {
    const formData = new FormData();
    (files || []).forEach((file) => {
      if (file instanceof File) {
        formData.append('attachments[]', file);
      }
    });

    await requestFormData(`${BASE}/${id}/attachments`, 'POST', formData);
  } catch {
    noticesStore = noticesStore.map((item) => {
      if (String(item.id) !== String(id)) return item;
      const attachments = [
        ...(item.attachments || []),
        ...files.map((file, index) => ({
          id: Date.now() + index,
          uuid: `att-${Date.now()}-${index}`,
          original_name: file.name,
          file_type: file.type || file.name.split('.').pop(),
          file_size: file.size || 0,
          uploaded_at: new Date().toISOString(),
          url: '#',
        })),
      ];
      return { ...item, attachments, attachment_count: attachments.length };
    });
  }
  return detail(id);
}

async function removeAttachment(id, attachmentId) {
  try {
    await adminApi.request(`${BASE}/${id}/attachments/${attachmentId}`, { method: 'DELETE' });
  } catch {
    noticesStore = noticesStore.map((item) => {
      if (String(item.id) !== String(id)) return item;
      const attachments = (item.attachments || []).filter((attachment) => String(attachment.id) !== String(attachmentId));
      return { ...item, attachments, attachment_count: attachments.length };
    });
  }
  return detail(id);
}

async function remove(id) {
  try {
    await adminApi.request(`${BASE}/${id}`, { method: 'DELETE' });
  } catch {
    noticesStore = noticesStore.map((item) => (String(item.id) === String(id) ? { ...item, status: 'archived' } : item));
  }
  return true;
}

async function restore(id) {
  try {
    await adminApi.request(`${BASE}/${id}/restore`, { method: 'PUT' });
  } catch {
    noticesStore = noticesStore.map((item) => (String(item.id) === String(id) ? { ...item, status: 'draft' } : item));
  }
  return detail(id);
}

async function publish(id, payload = {}) {
  try {
    await adminApi.request(`${BASE}/${id}/publish`, { method: 'POST', body: JSON.stringify(payload) });
  } catch {}
  return changeStatus(id, 'published', payload);
}

async function unpublish(id) {
  try {
    await adminApi.request(`${BASE}/${id}/unpublish`, { method: 'POST' });
  } catch {}
  return changeStatus(id, 'unpublished');
}

async function archive(id) {
  try {
    await adminApi.request(`${BASE}/${id}/archive`, { method: 'POST' });
  } catch {}
  return changeStatus(id, 'archived');
}

export const noticesService = {
  list,
  detail,
  summary,
  save,
  changeStatus,
  pin,
  uploadAttachment,
  removeAttachment,
  remove,
  restore,
  publish,
  unpublish,
  archive,
};
