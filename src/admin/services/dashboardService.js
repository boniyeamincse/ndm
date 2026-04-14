// Admin Dashboard API service
// Calls real backend endpoints; falls back gracefully

const API_BASE = '/api/v1';

function authHeaders() {
  const token = localStorage.getItem('ndm_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function apiFetch(path) {
  const res = await fetch(`${API_BASE}${path}`, { headers: authHeaders() });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}

export const dashboardService = {
  getDashboard:        () => apiFetch('/dashboard'),
  getStats:            () => apiFetch('/dashboard/stats'),
  getCharts:           (period = '12m') => apiFetch(`/dashboard/charts?period=${period}`),
  getRecentActivities: (limit = 10) => apiFetch(`/dashboard/recent-activities?limit=${limit}`),
  getPendingItems:     () => apiFetch('/dashboard/pending-items'),
  getLatestContent:    () => apiFetch('/dashboard/latest-content'),
};
