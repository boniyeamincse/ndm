import { adminApi } from '../../../../services/adminApi';

const BASE = '/admin/roles';

function normalizeRole(item = {}) {
  return {
    id: item.id,
    name: item.name || '',
    display_name: item.display_name || item.name || '',
    description: item.description || '',
    permissions_count: item.permissions_count || 0,
    users_count: item.users_count || 0,
    is_system_role: Boolean(item.is_system_role),
    permissions: item.permissions || [],
    users: item.users || [],
    created_at: item.created_at || null,
    updated_at: item.updated_at || null,
  };
}

function extractList(payload) {
  return {
    items: (payload?.data || []).map(normalizeRole),
    meta: payload?.meta || {
      current_page: 1,
      last_page: 1,
      per_page: 20,
      total: payload?.data?.length || 0,
    },
  };
}

export const rolesService = {
  async list(filters = {}) {
    const path = adminApi.withQuery(BASE, filters);
    const payload = await adminApi.request(path);
    return extractList(payload);
  },

  async summary() {
    const payload = await adminApi.request(`${BASE}/summary`);
    return payload?.data || {
      total: 0,
      system: 0,
      custom: 0,
      in_use: 0,
    };
  },

  async detail(id) {
    const payload = await adminApi.request(`${BASE}/${id}`);
    return normalizeRole(payload?.data || {});
  },

  async create(data) {
    const payload = await adminApi.request(BASE, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return normalizeRole(payload?.data || {});
  },

  async update(id, data) {
    const payload = await adminApi.request(`${BASE}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return normalizeRole(payload?.data || {});
  },

  async syncPermissions(id, permissions) {
    const payload = await adminApi.request(`${BASE}/${id}/permissions`, {
      method: 'PATCH',
      body: JSON.stringify({ permissions }),
    });
    return normalizeRole(payload?.data || {});
  },

  async remove(id) {
    await adminApi.request(`${BASE}/${id}`, { method: 'DELETE' });
    return true;
  },

  async assignRolesToUser(userId, roles) {
    const payload = await adminApi.request(`/admin/users/${userId}/roles`, {
      method: 'PATCH',
      body: JSON.stringify({ roles }),
    });
    return payload?.data || null;
  },
};
