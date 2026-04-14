import { adminApi } from '../../../../services/adminApi';
import { extractEntity, normalizeListPayload } from '../../shared/utils/resourceTransforms';

const BASE = '/admin/committee-types';

function mapType(item) {
  return {
    ...item,
    is_active: item.is_active ?? item.status === 'active',
  };
}

async function list(filters = {}) {
  const payload = await adminApi.request(adminApi.withQuery(BASE, {
    search: filters.search,
    is_active: filters.is_active,
    sort_by: filters.sort_by,
    sort_dir: filters.sort_dir,
    page: filters.page,
    per_page: filters.per_page,
  }));
  const result = normalizeListPayload(payload);
  return { ...result, items: result.items.map(mapType) };
}

async function detail(id) {
  const payload = await adminApi.request(`${BASE}/${id}`);
  return mapType(extractEntity(payload));
}

async function create(body) {
  return adminApi.request(BASE, { method: 'POST', body: JSON.stringify(body) });
}

async function update(id, body) {
  return adminApi.request(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(body) });
}

async function remove(id) {
  return adminApi.request(`${BASE}/${id}`, { method: 'DELETE' });
}

async function restore(id) {
  return adminApi.request(`${BASE}/${id}/restore`, { method: 'PUT' });
}

export const committeeTypesService = { list, detail, create, update, remove, restore };
