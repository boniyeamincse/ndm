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
  const [overview, setOverview] = useState(null);
  const [notices, setNotices] = useState([]);
  const [noticesLoading, setNoticesLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    const localUser = getLocalUser();
    setUser(localUser);
    setLoading(true);
    setNoticesLoading(true);
    setError('');

    if (!getToken()) {
      setOverview(null);
      setNotices([]);
      setLoading(false);
      setNoticesLoading(false);
      return;
    }

    try {
      const [profileRes, overviewRes, noticesRes] = await Promise.allSettled([
        apiFetch('/me/profile'),
        apiFetch('/me/member-overview'),
        apiFetch('/member/notices?per_page=4'),
      ]);

      if (profileRes.status === 'fulfilled') {
        const profileUser = profileRes.value?.user || {};
        const profileMember = profileRes.value?.member || {};
        const mergedUser = {
          ...localUser,
          ...profileUser,
          full_name: profileMember.full_name || profileUser.name || localUser.full_name,
          member_no: profileMember.member_no || localUser.member_no,
          membership_status: profileMember.status || localUser.membership_status || 'pending',
          photo_url: profileMember.photo_url || localUser.photo_url || null,
        };
        setUser(mergedUser);
        localStorage.setItem('ndm_user', JSON.stringify(mergedUser));
      } else {
        setError('Could not refresh profile data. Showing cached data.');
      }

      if (overviewRes.status === 'fulfilled') {
        setOverview(overviewRes.value || null);
      }

      if (noticesRes.status === 'fulfilled') {
        const raw = noticesRes.value;
        setNotices(Array.isArray(raw) ? raw : []);
      }
    } catch (err) {
      setError(err?.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
      setNoticesLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    user,
    overview,
    notices,
    noticesLoading,
    loading,
    error,
    reload,
  };
}
