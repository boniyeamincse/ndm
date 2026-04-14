import { adminApi } from '../../../../services/adminApi';
import { extractEntity, normalizeListPayload } from '../../shared/utils/resourceTransforms';

const BASE = '/admin/member-reporting-relations';

function mapRelation(item) {
  return {
    ...item,
    subordinate_name: item.subordinate_name || item.subordinate_assignment?.member?.full_name || '—',
    superior_name: item.superior_name || item.superior_assignment?.member?.full_name || '—',
    committee_name: item.committee_name || item.committee?.name || '—',
    is_active: item.is_active ?? item.status === 'active',
  };
}

async function list(filters = {}) {
  const payload = await adminApi.request(adminApi.withQuery(BASE, {
    search: filters.search,
    committee_id: filters.committee_id,
    committee_type_id: filters.committee_type_id,
    relation_type: filters.relation_type,
    primary_only: filters.primary_only,
    active_only: filters.active_only,
    from: filters.from,
    to: filters.to,
    sort_by: filters.sort_by,
    sort_dir: filters.sort_dir,
    page: filters.page,
    per_page: filters.per_page,
  }));
  const result = normalizeListPayload(payload);
  return { ...result, items: result.items.map(mapRelation) };
}

async function detail(id) {
  return mapRelation(extractEntity(await adminApi.request(`${BASE}/${id}`)));
}

async function summary() {
  try {
    const payload = await adminApi.request('/admin/member-reporting-relations-summary');
    const data = payload?.data || {};
    return {
      total: data.total || 0,
      active: data.active || 0,
      primary: data.primary || 0,
      direct: data.direct || 0,
      functional: data.functional || 0,
      advisory: data.advisory || 0,
    };
  } catch {
    return { total: 0, active: 0, primary: 0, direct: 0, functional: 0, advisory: 0 };
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

async function committeeHierarchyTree(committeeId) {
  const payload = await adminApi.request(`/admin/committees/${committeeId}/hierarchy-tree`);
  return Array.isArray(payload?.data) ? payload.data : payload?.data?.items || [];
}

async function leaderLookup(assignmentId) {
  return extractEntity(await adminApi.request(`/admin/committee-member-assignments/${assignmentId}/leader`));
}

async function subordinates(assignmentId) {
  const payload = await adminApi.request(`/admin/committee-member-assignments/${assignmentId}/subordinates`);
  return Array.isArray(payload?.data) ? payload.data : payload?.data?.items || [];
}

export const reportingHierarchyService = {
  list,
  detail,
  summary,
  create,
  update,
  updateStatus,
  remove,
  restore,
  committeeHierarchyTree,
  leaderLookup,
  subordinates,
};
