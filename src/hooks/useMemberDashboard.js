import { useCallback, useEffect, useState } from 'react';

const API_BASE = '/api/v1';

function getToken() {
  return localStorage.getItem('ndm_token');
}

function getLocalUser() {
  try {
    return JSON.parse(localStorage.getItem('ndm_user') || '{}');
  } catch {
    return {};
  }
}

function authHeaders() {
  const token = getToken();
  return {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function apiFetch(path) {
  const res = await fetch(`${API_BASE}${path}`, { headers: authHeaders() });
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(json.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.payload = json;
    throw err;
  }

  return json.data;
}

export function useMemberDashboard() {
  const [user, setUser] = useState(() => getLocalUser());
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    const localUser = getLocalUser();
    setUser(localUser);
    setLoading(true);
    setError('');

    if (!getToken()) {
      setDashboard(null);
      setLoading(false);
      return;
    }

    try {
      const [dashboardRes, profileRes] = await Promise.allSettled([
        apiFetch('/dashboard/member'),
        apiFetch('/me/profile'),
      ]);

      if (dashboardRes.status === 'fulfilled') {
        setDashboard(dashboardRes.value || null);
      } else {
        setDashboard(null);
      }

      if (profileRes.status === 'fulfilled') {
        const profileUser = profileRes.value?.user || {};
        const profileMember = profileRes.value?.member || {};

        const mergedUser = {
          ...localUser,
          ...profileUser,
          full_name: profileMember.full_name || profileUser.name || localUser.full_name,
          member_no: profileMember.member_no || localUser.member_no,
          membership_status: profileMember.status || localUser.membership_status || 'pending',
        };

        setUser(mergedUser);
        localStorage.setItem('ndm_user', JSON.stringify(mergedUser));
      } else if (dashboardRes.status !== 'fulfilled') {
        throw profileRes.reason || new Error('Failed to load member dashboard data.');
      }
    } catch (err) {
      setError(err?.message || 'Failed to load dashboard data.');
      setDashboard(null);
      setUser(localUser);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    user,
    dashboard,
    loading,
    error,
    reload,
  };
}
