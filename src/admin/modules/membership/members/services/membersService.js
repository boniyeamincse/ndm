import { adminApi } from '../../../../services/adminApi';
import { memberListMock, memberDetailMock, memberSummaryMock } from '../mock/memberMock';

const BASE = '/admin/members';

// ─── In-memory mock store (mutations apply here) ─────────────────────────────
let mockStore = memberListMock.map((m) => ({ ...m }));

function applyMockFilters(items, filters) {
  let result = [...items];

  if (filters.status) {
    result = result.filter((m) => m.status === filters.status);
  }
  if (filters.gender) {
    result = result.filter((m) => m.gender === filters.gender);
  }
  if (filters.division) {
    result = result.filter((m) => (m.division_name || '').toLowerCase() === filters.division.toLowerCase());
  }
  if (filters.district) {
    result = result.filter((m) => (m.district_name || '').toLowerCase() === filters.district.toLowerCase());
  }
  if (filters.upazila) {
    result = result.filter((m) => (m.upazila_name || '').toLowerCase().includes(filters.upazila.toLowerCase()));
  }
  if (filters.union_name) {
    result = result.filter((m) => (m.union_name || '').toLowerCase().includes(filters.union_name.toLowerCase()));
  }
  if (filters.educational_institution) {
    result = result.filter((m) => (m.educational_institution || '').toLowerCase().includes(filters.educational_institution.toLowerCase()));
  }
  if (filters.leadership_only === true || filters.leadership_only === 'true') {
    result = result.filter((m) => m.is_leadership);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (m) =>
        (m.full_name || '').toLowerCase().includes(q) ||
        (m.email || '').toLowerCase().includes(q) ||
        (m.mobile || '').includes(q) ||
        (m.member_no || '').toLowerCase().includes(q)
    );
  }
  if (filters.joined_from) {
    const from = new Date(filters.joined_from).getTime();
    result = result.filter((m) => m.joined_at && new Date(m.joined_at).getTime() >= from);
  }
  if (filters.joined_to) {
    const to = new Date(filters.joined_to).getTime();
    result = result.filter((m) => m.joined_at && new Date(m.joined_at).getTime() <= to);
  }

  const sortBy = filters.sort_by || 'created_at';
  const sortDir = filters.sort_dir === 'asc' ? 1 : -1;
  result.sort((a, b) => {
    const av = a[sortBy] || '';
    const bv = b[sortBy] || '';
    if (av < bv) return -1 * sortDir;
    if (av > bv) return 1 * sortDir;
    return 0;
  });

  const page = Math.max(1, filters.page || 1);
  const perPage = Math.min(100, Math.max(10, filters.per_page || 20));
  const total = result.length;
  const paged = result.slice((page - 1) * perPage, page * perPage);

  return {
    items: paged,
    meta: {
      current_page: page,
      last_page: Math.max(1, Math.ceil(total / perPage)),
      per_page: perPage,
      total,
    },
  };
}

function normalizeList(payload) {
  return {
    items: payload?.data || [],
    meta: payload?.meta || { current_page: 1, last_page: 1, per_page: 20, total: 0 },
  };
}

async function list(filters = {}) {
  try {
    const path = adminApi.withQuery(BASE, {
      search: filters.search,
      status: filters.status,
      gender: filters.gender,
      division: filters.division,
      district: filters.district,
      upazila: filters.upazila,
      union_name: filters.union_name,
      educational_institution: filters.educational_institution,
      leadership_only: filters.leadership_only,
      joined_from: filters.joined_from,
      joined_to: filters.joined_to,
      recent_period_days: filters.recent_period_days,
      sort_by: filters.sort_by,
      sort_dir: filters.sort_dir,
      page: filters.page,
      per_page: filters.per_page,
    });
    const payload = await adminApi.request(path);
    return normalizeList(payload);
  } catch {
    return applyMockFilters(mockStore, filters);
  }
}

async function detail(id) {
  try {
    const payload = await adminApi.request(`${BASE}/${id}`);
    return payload?.data;
  } catch {
    const numId = Number(id);
    const found = mockStore.find((m) => m.id === numId);
    if (found) {
      if (numId === memberDetailMock.id) return { ...memberDetailMock };
      return {
        ...memberDetailMock,
        ...found,
        address: memberDetailMock.address,
        emergency_contact: memberDetailMock.emergency_contact,
        user: null,
        application: null,
        status_histories: memberDetailMock.status_histories,
        assignments_summary: 'Committee assignment data loading from server…',
        leader_summary: null,
        subordinates_summary: null,
        subordinates_count: 0,
      };
    }
    return null;
  }
}

async function update(id, body) {
  try {
    return await adminApi.request(`${BASE}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  } catch {
    const numId = Number(id);
    const index = mockStore.findIndex((m) => m.id === numId);
    if (index !== -1) {
      mockStore[index] = { ...mockStore[index], ...body };
    }
    return { data: mockStore[index] };
  }
}

async function updateStatus(id, body) {
  try {
    return await adminApi.request(`${BASE}/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  } catch {
    const numId = Number(id);
    const index = mockStore.findIndex((m) => m.id === numId);
    if (index !== -1) {
      mockStore[index] = { ...mockStore[index], status: body.status };
    }
    return { data: mockStore[index] };
  }
}

async function summary() {
  try {
    const payload = await adminApi.request('/admin/members-summary');
    const d = payload?.data || {};
    const byStatus = d.byStatus || {};
    return {
      total: d.total || 0,
      active: byStatus.active || 0,
      inactive: byStatus.inactive || 0,
      suspended: byStatus.suspended || 0,
      leadership: d.leadership || 0,
      new_members: d.new_members || 0,
    };
  } catch {
    return { ...memberSummaryMock };
  }
}

export const membersService = {
  list,
  detail,
  update,
  updateStatus,
  summary,
};
