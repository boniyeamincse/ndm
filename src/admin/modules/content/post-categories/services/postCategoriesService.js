import { adminApi } from '../../../../services/adminApi';
import { postCategoriesMock } from '../mock/postCategoriesMock';
import { extractEntity, normalizeListPayload } from '../../shared/utils/resourceTransforms';

const BASE = '/admin/post-categories';
let categoriesStore = [...postCategoriesMock];

function nextId() {
  return categoriesStore.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
}

async function list(filters = {}) {
  try {
    const payload = await adminApi.request(adminApi.withQuery(BASE, filters));
    return normalizeListPayload(payload);
  } catch {
    const query = String(filters.search || '').toLowerCase().trim();
    const items = categoriesStore.filter((item) => {
      const matchesQuery = !query || [item.name, item.slug, item.description].some((field) => String(field || '').toLowerCase().includes(query));
      const matchesStatus = filters.is_active === '' || filters.is_active === undefined || String(item.is_active) === String(filters.is_active);
      return matchesQuery && matchesStatus;
    });
    return {
      items,
      meta: { current_page: 1, last_page: 1, per_page: items.length || 20, total: items.length },
    };
  }
}

async function detail(id) {
  try {
    const payload = await adminApi.request(`${BASE}/${id}`);
    return extractEntity(payload);
  } catch {
    return categoriesStore.find((item) => String(item.id) === String(id)) || null;
  }
}

async function save(id, data) {
  const path = id ? `${BASE}/${id}` : BASE;
  const method = id ? 'PUT' : 'POST';
  try {
    const payload = await adminApi.request(path, { method, body: JSON.stringify(data) });
    return extractEntity(payload);
  } catch {
    if (id) {
      categoriesStore = categoriesStore.map((item) => (String(item.id) === String(id) ? { ...item, ...data } : item));
      return categoriesStore.find((item) => String(item.id) === String(id));
    }
    const created = { ...data, id: nextId(), uuid: `pc-${nextId()}`, created_at: new Date().toISOString() };
    categoriesStore = [created, ...categoriesStore];
    return created;
  }
}

async function toggleStatus(id, is_active) {
  try {
    await adminApi.request(`${BASE}/${id}/status`, { method: 'PATCH', body: JSON.stringify({ is_active }) });
  } catch {
    categoriesStore = categoriesStore.map((item) => (String(item.id) === String(id) ? { ...item, is_active } : item));
  }
  return detail(id);
}

async function remove(id) {
  try {
    await adminApi.request(`${BASE}/${id}`, { method: 'DELETE' });
  } catch {
    categoriesStore = categoriesStore.filter((item) => String(item.id) !== String(id));
  }
  return true;
}

async function restore(id) {
  try {
    await adminApi.request(`${BASE}/${id}/restore`, { method: 'PUT' });
  } catch {}
  return detail(id);
}

async function summary() {
  const items = categoriesStore;
  return {
    total: items.length,
    active: items.filter((item) => item.is_active).length,
    inactive: items.filter((item) => !item.is_active).length,
  };
}

export const postCategoriesService = {
  list,
  detail,
  save,
  toggleStatus,
  remove,
  restore,
  summary,
};
