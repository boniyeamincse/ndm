import { adminApi } from '../../../../services/adminApi';
import { postsMock, postCategoriesMock } from '../mock/postsMock';
import { extractEntity, normalizeListPayload, normalizeMutationResponse } from '../../shared/utils/resourceTransforms';

const BASE = '/admin/posts';
const SUMMARY = '/admin/posts-summary';
let postsStore = [...postsMock];

function nextId() {
  return postsStore.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
}

function mapPost(item) {
  return {
    ...item,
    category_name: item.category?.name || item.category_name || 'Uncategorized',
    author_name: item.author?.name || item.author_name || '—',
    editor_name: item.editor?.name || item.editor_name || '—',
    committee_name: item.committee?.name || item.committee_name || '—',
  };
}

function applyFilters(items, filters = {}) {
  const query = String(filters.search || '').trim().toLowerCase();
  return items.filter((item) => {
    const matchesQuery = !query || [item.title, item.slug, item.excerpt, item.post_no].some((field) => String(field || '').toLowerCase().includes(query));
    const matchesType = !filters.content_type || item.content_type === filters.content_type;
    const matchesCategory = !filters.post_category_id || String(item.post_category_id) === String(filters.post_category_id);
    const matchesCommittee = !filters.committee_id || String(item.committee_id) === String(filters.committee_id);
    const matchesAuthor = !filters.author_id || String(item.author_id) === String(filters.author_id);
    const matchesEditor = !filters.editor_id || String(item.editor_id) === String(filters.editor_id);
    const matchesStatus = !filters.status || item.status === filters.status;
    const matchesVisibility = !filters.visibility || item.visibility === filters.visibility;
    const matchesFeatured = !filters.featured_only || item.is_featured;
    const matchesHomepage = !filters.homepage_only || item.allow_on_homepage;
    return matchesQuery && matchesType && matchesCategory && matchesCommittee && matchesAuthor && matchesEditor && matchesStatus && matchesVisibility && matchesFeatured && matchesHomepage;
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

function buildSummary(items = postsStore) {
  return {
    total: items.length,
    draft: items.filter((item) => item.status === 'draft').length,
    pending_review: items.filter((item) => item.status === 'pending_review').length,
    published: items.filter((item) => item.status === 'published').length,
    archived: items.filter((item) => item.status === 'archived').length,
    featured: items.filter((item) => item.is_featured).length,
  };
}

async function list(filters = {}) {
  try {
    const path = adminApi.withQuery(BASE, filters);
    const payload = await adminApi.request(path);
    const result = normalizeListPayload(payload);
    return { ...result, items: result.items.map(mapPost) };
  } catch {
    const filtered = applyFilters(postsStore, filters).map(mapPost);
    return paginate(filtered, filters.page, filters.per_page);
  }
}

async function detail(id) {
  try {
    const payload = await adminApi.request(`${BASE}/${id}`);
    return mapPost(extractEntity(payload));
  } catch {
    return mapPost(postsStore.find((item) => String(item.id) === String(id)) || postsStore[0]);
  }
}

async function summary() {
  try {
    const payload = await adminApi.request(SUMMARY);
    return normalizeMutationResponse(payload, buildSummary());
  } catch {
    return buildSummary();
  }
}

async function save(id, data) {
  const method = id ? 'PUT' : 'POST';
  const path = id ? `${BASE}/${id}` : BASE;
  try {
    const payload = await adminApi.request(path, { method, body: JSON.stringify(data) });
    return mapPost(normalizeMutationResponse(payload, data));
  } catch {
    if (id) {
      postsStore = postsStore.map((item) => (String(item.id) === String(id) ? { ...item, ...data, updated_at: new Date().toISOString() } : item));
      return mapPost(postsStore.find((item) => String(item.id) === String(id)));
    }
    const created = {
      ...data,
      id: nextId(),
      uuid: `post-${nextId()}`,
      post_no: data.post_no || `POST-2026-${String(nextId()).padStart(3, '0')}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status_history: [{ id: 1, title: 'Draft created', description: 'Created in admin panel', at: new Date().toISOString() }],
    };
    postsStore = [created, ...postsStore];
    return mapPost(created);
  }
}

async function changeStatus(id, status, extra = {}) {
  const payload = { status, ...extra };
  try {
    await adminApi.request(`${BASE}/${id}/status`, { method: 'PATCH', body: JSON.stringify(payload) });
  } catch {
    postsStore = postsStore.map((item) => (String(item.id) === String(id)
      ? {
          ...item,
          status,
          published_at: status === 'published' ? extra.publish_at || new Date().toISOString() : item.published_at,
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

async function feature(id, payload = {}) {
  try {
    await adminApi.request(`${BASE}/${id}/feature`, { method: 'PATCH', body: JSON.stringify(payload) });
  } catch {
    postsStore = postsStore.map((item) => (String(item.id) === String(id) ? { ...item, ...payload, updated_at: new Date().toISOString() } : item));
  }
  return detail(id);
}

async function remove(id) {
  try {
    await adminApi.request(`${BASE}/${id}`, { method: 'DELETE' });
  } catch {
    postsStore = postsStore.map((item) => (String(item.id) === String(id) ? { ...item, status: 'archived' } : item));
  }
  return true;
}

async function restore(id) {
  try {
    await adminApi.request(`${BASE}/${id}/restore`, { method: 'PUT' });
  } catch {
    postsStore = postsStore.map((item) => (String(item.id) === String(id) ? { ...item, status: 'draft' } : item));
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

async function categories() {
  return postCategoriesMock;
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
