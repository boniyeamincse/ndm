import { adminApi } from '../../../../services/adminApi';
import { extractEntity, normalizeListPayload } from '../../shared/utils/resourceTransforms';

const BASE = '/admin/committee-member-assignments';

function mapAssignment(item) {
  return {
    ...item,
    member_name: item.member_name || item.member?.full_name || item.member?.name || '—',
    committee_name: item.committee_name || item.committee?.name || '—',
    position_name: item.position_name || item.position?.name || '—',
    is_active: item.is_active ?? item.status === 'active',
  };
}

async function list(filters = {}) {
  const payload = await adminApi.request(adminApi.withQuery(BASE, {
    search: filters.search,
    member_id: filters.member_id,
    committee_id: filters.committee_id,
    committee_type_id: filters.committee_type_id,
    position_id: filters.position_id,
    assignment_type: filters.assignment_type,
    status: filters.status,
    active_only: filters.active_only,
    primary_only: filters.primary_only,
    leadership_only: filters.leadership_only,
    from: filters.from,
    to: filters.to,
    sort_by: filters.sort_by,
    sort_dir: filters.sort_dir,
    page: filters.page,
    per_page: filters.per_page,
  }));
  const result = normalizeListPayload(payload);
  return { ...result, items: result.items.map(mapAssignment) };
}

async function detail(id) {
  return mapAssignment(extractEntity(await adminApi.request(`${BASE}/${id}`)));
}

async function summary() {
  try {
    const payload = await adminApi.request('/admin/committee-member-assignments-summary');
    const data = payload?.data || {};
    return {
      total: data.total || 0,
      active: data.active || 0,
      inactive: data.inactive || 0,
      completed: data.completed || 0,
      office_bearers: data.office_bearers || 0,
      leadership: data.leadership || 0,
    };
  } catch {
    return { total: 0, active: 0, inactive: 0, completed: 0, office_bearers: 0, leadership: 0 };
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

async function transfer(id, body) {
  return adminApi.request(`${BASE}/${id}/transfer`, { method: 'POST', body: JSON.stringify(body) });
}

async function remove(id) {
  return adminApi.request(`${BASE}/${id}`, { method: 'DELETE' });
}

async function restore(id) {
  return adminApi.request(`${BASE}/${id}/restore`, { method: 'PUT' });
}

async function committeeMembers(committeeId) {
  const payload = await adminApi.request(`/admin/committees/${committeeId}/members`);
  return normalizeListPayload(payload).items.map(mapAssignment);
}

async function memberAssignments(memberId) {
  const payload = await adminApi.request(`/admin/members/${memberId}/committee-assignments`);
  return normalizeListPayload(payload).items.map(mapAssignment);
}

export const committeeAssignmentsService = {
  list,
  detail,
  summary,
  create,
  update,
  updateStatus,
  transfer,
  remove,
  restore,
  committeeMembers,
  memberAssignments,
};
