import { adminApi } from '../../../../services/adminApi';
import { extractEntity, normalizeListPayload } from '../../shared/utils/resourceTransforms';

const BASE = '/admin/positions';

function mapPosition(item) {
  return {
    ...item,
    committee_types: item.committee_types || item.committee_type_names || [],
    is_active: item.is_active ?? item.status === 'active',
  };
}

async function list(filters = {}) {
  const payload = await adminApi.request(adminApi.withQuery(BASE, {
    search: filters.search,
    category: filters.category,
    scope: filters.scope,
    is_active: filters.is_active,
    is_leadership: filters.is_leadership,
    committee_type_id: filters.committee_type_id,
    sort_by: filters.sort_by,
    sort_dir: filters.sort_dir,
    page: filters.page,
    per_page: filters.per_page,
  }));
  const result = normalizeListPayload(payload);
  return { ...result, items: result.items.map(mapPosition) };
}

async function detail(id) {
  const payload = await adminApi.request(`${BASE}/${id}`);
  return mapPosition(extractEntity(payload));
}

async function summary() {
  try {
    const payload = await adminApi.request('/admin/positions-summary');
    const data = payload?.data || {};
    return {
      total: data.total || 0,
      active: data.by_status?.active || data.active || 0,
      leadership: data.leadership || 0,
      committee_specific: data.committee_specific || 0,
      global: data.global || 0,
    };
  } catch {
    return { total: 0, active: 0, leadership: 0, committee_specific: 0, global: 0 };
  }
}

async function create(body) {
  return adminApi.request(BASE, { method: 'POST', body: JSON.stringify(body) });
}

async function update(id, body) {
  return adminApi.request(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(body) });
}

async function updateStatus(id, body) {
  return adminApi.request(`${BASE}/${id}/status`, { method: 'PATCH', body: JSON.stringify(body) });
}

async function remove(id) {
  return adminApi.request(`${BASE}/${id}`, { method: 'DELETE' });
}

async function restore(id) {
  return adminApi.request(`${BASE}/${id}/restore`, { method: 'PUT' });
}

export const positionsService = { list, detail, summary, create, update, updateStatus, remove, restore };
