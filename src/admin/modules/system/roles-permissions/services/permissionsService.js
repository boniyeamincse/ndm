import { adminApi } from '../../../../services/adminApi';

const BASE = '/admin/permissions';

export const permissionsService = {
  async list() {
    const payload = await adminApi.request(BASE);
    return payload?.data || [];
  },

  async grouped() {
    const payload = await adminApi.request(`${BASE}/grouped`);
    return payload?.data || {};
  },

  async detail(id) {
    const payload = await adminApi.request(`${BASE}/${id}`);
    return payload?.data || null;
  },
};
