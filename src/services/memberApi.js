const API_BASE = '/api/v1';

function getToken() {
  return localStorage.getItem('ndm_token');
}

function authHeaders(extra = {}) {
  const token = getToken();
  return {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

function withQuery(path, params = {}) {
  const normalized = Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === 'boolean') {
        return [key, value ? '1' : '0'];
      }
      return [key, value];
    }),
  );

  const query = new URLSearchParams(
    Object.entries(normalized).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  ).toString();
  return query ? `${path}?${query}` : path;
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: authHeaders(options.headers),
  });

  const payload = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(payload.message || `Request failed (${res.status})`);
    error.status = res.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export const memberApi = {
  request,
  withQuery,
  getMeProfile: () => request('/me/profile'),
  getMemberOverview: () => request('/me/member-overview'),
  getAccountSettings: () => request('/me/account-settings'),
  updateAccountSettings: (data) => request('/me/account-settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
  getCommitteeAssignments: (params = {}) => request(withQuery('/me/committee-assignments', params)),
  getMemberNotices: (params = {}) => request(withQuery('/member/notices', params)),
  getDashboard: () => request('/dashboard/member'),
  logout: () => request('/auth/logout', { method: 'POST' }),
};
