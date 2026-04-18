import { adminApi } from '../../../../services/adminApi';
import { extractEntity, normalizeListPayload } from '../../shared/utils/resourceTransforms';

const BASE = '/admin/committee-member-assignments';

function normalizeDate(value) {
  if (!value) return '';
  return String(value).slice(0, 10);
}

function mapAssignment(item) {
  const member = item.member || {};
  const committee = item.committee || {};
  const position = item.position || {};
  const appointedBy = item.appointed_by && typeof item.appointed_by === 'object' ? item.appointed_by : null;
  const approvedBy = item.approved_by && typeof item.approved_by === 'object' ? item.approved_by : null;

  return {
    ...item,
    member_id: item.member_id || member.id || '',
    committee_id: item.committee_id || committee.id || '',
    position_id: item.position_id || position.id || '',
    committee_type_id: item.committee_type_id || committee.committee_type_id || committee.committee_type?.id || null,
    member_name: item.member_name || member.full_name || member.name || '—',
    member_no: item.member_no || member.member_no || '',
    committee_name: item.committee_name || committee.name || '—',
    committee_type_name: item.committee_type_name || committee.committee_type?.name || '',
    position_name: item.position_name || position.name || '—',
    appointed_by: appointedBy ? appointedBy.id : item.appointed_by || '',
    approved_by: approvedBy ? approvedBy.id : item.approved_by || '',
    appointed_by_name: item.appointed_by_name || appointedBy?.name || '',
    approved_by_name: item.approved_by_name || approvedBy?.name || '',
    assigned_at: normalizeDate(item.assigned_at),
    approved_at: normalizeDate(item.approved_at),
    start_date: normalizeDate(item.start_date),
    end_date: normalizeDate(item.end_date),
    assignment_history: item.assignment_history || item.assignment_history_timeline || item.history || [],
    position_history: item.position_history || item.position_history_timeline || [],
    member,
    committee,
    position,
    appointed_by_user: appointedBy,
    approved_by_user: approvedBy,
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
    is_active: filters.is_active ?? filters.active_only,
    is_primary: filters.is_primary ?? filters.primary_only,
    is_leadership: filters.is_leadership ?? filters.leadership_only,
    start_date_from: filters.start_date_from ?? filters.from,
    start_date_to: filters.start_date_to ?? filters.to,
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

async function lookupAdminUsers(filters = {}) {
  const payload = await adminApi.request(adminApi.withQuery('/admin/users/lookup', {
    search: filters.search,
    per_page: filters.per_page,
  }));

  return normalizeListPayload(payload).items.map((item) => ({
    ...item,
    label: item.name,
    description: [item.email, item.phone, Array.isArray(item.roles) ? item.roles.join(', ') : ''].filter(Boolean).join(' • '),
  }));
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
  lookupAdminUsers,
};
