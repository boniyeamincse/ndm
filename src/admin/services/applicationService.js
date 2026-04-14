// Membership Applications API service

const API_BASE = '/api/v1';

function authHeaders() {
  const token = localStorage.getItem('ndm_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: authHeaders(),
    ...options,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
  return json;
}

export const applicationService = {
  // GET /admin/membership-applications?status=&search=&page=&per_page=
  list: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString();
    return apiFetch(`/admin/membership-applications${qs ? `?${qs}` : ''}`);
  },

  // GET /admin/membership-applications/{id}
  get: (id) => apiFetch(`/admin/membership-applications/${id}`),

  // PUT /admin/membership-applications/{id}/review
  review: (id) => apiFetch(`/admin/membership-applications/${id}/review`, { method: 'PUT' }),

  // PUT /admin/membership-applications/{id}/approve
  approve: (id) => apiFetch(`/admin/membership-applications/${id}/approve`, { method: 'PUT' }),

  // PUT /admin/membership-applications/{id}/reject
  reject: (id, reason) => apiFetch(`/admin/membership-applications/${id}/reject`, {
    method: 'PUT',
    body: JSON.stringify({ reason }),
  }),

  // PUT /admin/membership-applications/{id}/hold
  hold: (id, note) => apiFetch(`/admin/membership-applications/${id}/hold`, {
    method: 'PUT',
    body: JSON.stringify({ note }),
  }),
};
