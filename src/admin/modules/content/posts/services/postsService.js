import { adminApi } from '../../../../services/adminApi';
import { extractEntity, normalizeListPayload, normalizeMutationResponse } from '../../shared/utils/resourceTransforms';

const BASE = '/admin/posts';
const SUMMARY = '/admin/posts-summary';

function mapPost(item) {
  return {
    ...item,
    category_name: item.category?.name || item.category_name || 'Uncategorized',
    author_name: item.author?.name || item.author_name || '—',
    editor_name: item.editor?.name || item.editor_name || '—',
    committee_name: item.committee?.name || item.committee_name || '—',
  };
}

// Removed mock buildSummary and applyFilters functions as they are no longer needed for backend integration.

async function list(filters = {}) {
  const path = adminApi.withQuery(BASE, filters);
  const payload = await adminApi.request(path);
  const result = normalizeListPayload(payload);
  return { ...result, items: (result.items || []).map(mapPost) };
}

async function detail(id) {
  const payload = await adminApi.request(`${BASE}/${id}`);
  return mapPost(extractEntity(payload));
}

async function summary() {
  const payload = await adminApi.request(SUMMARY);
  return normalizeMutationResponse(payload);
}

async function save(id, data) {
  const method = id ? 'PUT' : 'POST';
  const path = id ? `${BASE}/${id}` : BASE;
  const payload = await adminApi.request(path, { method, body: JSON.stringify(data) });
  return mapPost(normalizeMutationResponse(payload, data));
}

async function changeStatus(id, status, extra = {}) {
  const payload = { status, ...extra };
  await adminApi.request(`${BASE}/${id}/status`, { method: 'PATCH', body: JSON.stringify(payload) });
  return detail(id);
}

async function feature(id, payload = {}) {
  await adminApi.request(`${BASE}/${id}/feature`, { method: 'PATCH', body: JSON.stringify(payload) });
  return detail(id);
}

async function remove(id) {
  await adminApi.request(`${BASE}/${id}`, { method: 'DELETE' });
  return true;
}

async function restore(id) {
  await adminApi.request(`${BASE}/${id}/restore`, { method: 'PUT' });
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

async function categories() {
  const payload = await adminApi.request(`${BASE}-categories`);
  return normalizeListPayload(payload).items || [];
}

export const postsService = {
  list,
  detail,
  summary,
  save,
  changeStatus,
  feature,
  remove,
  restore,
  publish,
  unpublish,
  archive,
  categories,
};
