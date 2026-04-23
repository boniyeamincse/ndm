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

/**
 * Turn absolute backend storage URLs into relative paths so Vite proxy handles them.
 * e.g. "http://127.0.0.1:8000/storage/foo.jpg" → "/storage/foo.jpg"
 */
function toRelativeUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.pathname + u.search;
  } catch {
    return url; // already relative
  }
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
          photo_url: toRelativeUrl(profileUser.profile_photo_url || profileMember.photo_url || localUser.photo_url || null),
          profile_photo_url: toRelativeUrl(profileUser.profile_photo_url || localUser.profile_photo_url || null),
          profile_photo_data_url: profileUser.profile_photo_data_url || localUser.profile_photo_data_url || null,
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

  // Re-sync user from localStorage when photo or account changes happen elsewhere (e.g. profile page upload).
  useEffect(() => {
    const onAuthChanged = () => {
      const fresh = getLocalUser();
      setUser(fresh);
    };
    window.addEventListener('auth-changed', onAuthChanged);
    return () => window.removeEventListener('auth-changed', onAuthChanged);
  }, []);

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
