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
  getMemberSettings: () => request('/member/settings'),
  updateMemberAccountSettings: (data) => request('/member/settings/account', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
  updateMemberPrivacySettings: (data) => request('/member/settings/privacy', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
  updateMemberNotificationSettings: (data) => request('/member/settings/notifications', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
  updateMemberPassword: (data) => request('/member/settings/password', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
  getMemberIdCard: () => request('/member/id-card'),
  downloadMemberIdCard: async () => {
    const res = await fetch(`${API_BASE}/member/id-card?download=1`, {
      headers: authHeaders(),
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      const error = new Error(payload.message || `Request failed (${res.status})`);
      error.status = res.status;
      error.payload = payload;
      throw error;
    }

    return res.blob();
  },
  getCommitteeAssignments: (params = {}) => request(withQuery('/me/committee-assignments', params)),
  getMemberNotices: (params = {}) => request(withQuery('/member/notices', params)),

  // ── Committee Workspace ─────────────────────────────────────────────────
  getMyCommittee: () => request('/member/committee'),
  getCommitteeMembers: () => request('/member/committee/members'),
  getCommitteeActivities: () => request('/member/committee/activities'),
  applyForCommittee: (data) => request('/member/committee/apply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),

  // ── Events ──────────────────────────────────────────────────────────────
  getUpcomingEvents: () => request('/member/events/upcoming'),
  getRegisteredEvents: () => request('/member/events/registered'),
  getEventHistory: () => request('/member/events/history'),
  joinEvent: (id) => request(`/member/events/${id}/join`, { method: 'POST' }),

  // ── Applications ────────────────────────────────────────────────────────
  getApplications: () => request('/member/applications'),
  getMembershipStatus: () => request('/member/applications/membership-status'),
  applyForEvent: (data) => request('/member/applications/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
  requestCertificate: (data) => request('/member/applications/certificate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),

  // ── Communication ────────────────────────────────────────────────────────
  getMessages: () => request('/member/messages'),
  sendMessage: (data) => request('/member/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
  sendMessageToAllMembers: (data) => request('/member/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...data,
      send_to_all: true,
    }),
  }),
  getAnnouncements: () => request('/member/announcements'),
  getDiscussions: () => request('/member/discussions'),
  createDiscussion: (data) => request('/member/discussions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
  uploadMyProfilePhoto: async (file) => {
    const formData = new FormData();
    formData.append('photo', file);

    return request('/me/profile/photo', {
      method: 'POST',
      body: formData,
    });
  },
  getDashboard: () => request('/dashboard/member'),
  logout: () => request('/auth/logout', { method: 'POST' }),
};
