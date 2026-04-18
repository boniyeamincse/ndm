import { adminApi } from '../../../../services/adminApi';
import { extractEntity, normalizeListPayload } from '../../shared/utils/resourceTransforms';
import { BD_GEO } from '../../../../../data/bd-geo';

const BASE = '/admin/committees';

function resolveGeoName(item) {
  const division = BD_GEO.find((entry) => String(entry.id) === String(item.division_id));
  const district = division?.districts?.find((entry) => String(entry.id) === String(item.district_id));
  const upazila = district?.upazilas?.find((entry) => String(entry.id) === String(item.upazila_id));
  const union = upazila?.unions?.find((entry) => String(entry.id) === String(item.union_id));

  return {
    division_name: item.division_name || division?.name || null,
    district_name: item.district_name || district?.name || null,
    upazila_name: item.upazila_name || upazila?.name || null,
    union_name: item.union_name || union?.name || null,
  };
}

function mapCommittee(item) {
  const geo = resolveGeoName(item);
  return {
    ...item,
    committee_type_id: item.committee_type_id || item.committee_type?.id || null,
    committee_type_name: item.committee_type_name || item.committee_type?.name || item.committee_type || 'Committee',
    parent_name: item.parent_name || item.parent?.name || null,
    ...geo,
    child_committees_count: item.child_committees_count || item.children_count || item.child_count || 0,
    is_current: Boolean(item.is_current),
  };
}

async function list(filters = {}) {
  const path = adminApi.withQuery(BASE, {
    search: filters.search,
    committee_type_id: filters.committee_type_id,
    status: filters.status,
    is_current: filters.is_current,
    division_id: filters.division_id,
    district_id: filters.district_id,
    upazila_id: filters.upazila_id,
    union_id: filters.union_id,
    parent_id: filters.parent_id,
    sort_by: filters.sort_by,
    sort_dir: filters.sort_dir,
    page: filters.page,
    per_page: filters.per_page,
  });

  const payload = await adminApi.request(path);
  const result = normalizeListPayload(payload);
  return { ...result, items: result.items.map(mapCommittee) };
}

async function detail(id) {
  const payload = await adminApi.request(`${BASE}/${id}`);
  return mapCommittee(extractEntity(payload));
}

async function summary() {
  try {
    const payload = await adminApi.request('/admin/committees-summary');
    const data = payload?.data || {};
    return {
      total: data.total || 0,
      active: data.by_status?.active || data.active || 0,
      inactive: data.by_status?.inactive || data.inactive || 0,
      dissolved: data.by_status?.dissolved || data.dissolved || 0,
      archived: data.by_status?.archived || data.archived || 0,
      current: data.current || data.is_current || 0,
    };
  } catch {
    return { total: 0, active: 0, inactive: 0, dissolved: 0, archived: 0, current: 0 };
  }
}

async function tree(filters = {}) {
  const path = adminApi.withQuery('/admin/committees-tree', {
    status: filters.status,
    committee_type_id: filters.committee_type_id,
    root_id: filters.root_id,
  });
  const payload = await adminApi.request(path);
  const data = Array.isArray(payload?.data) ? payload.data : payload?.data?.items || [];
  return data.map(mapCommittee);
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

async function committeeMembers(committeeId) {
  const payload = await adminApi.request(`/admin/committees/${committeeId}/members`);
  return normalizeListPayload(payload).items;
}

export const committeesService = {
  list,
  detail,
  summary,
  tree,
  create,
  update,
  updateStatus,
  remove,
  restore,
  committeeMembers,
};
