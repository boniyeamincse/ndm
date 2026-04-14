export function normalizeListPayload(payload, fallbackKey = 'items') {
  const data = payload?.data;

  if (Array.isArray(data)) {
    return {
      items: data,
      meta: payload?.meta || { current_page: 1, last_page: 1, per_page: 20, total: data.length },
    };
  }

  if (data && Array.isArray(data[fallbackKey])) {
    return {
      items: data[fallbackKey],
      meta: payload?.meta || data.meta || { current_page: 1, last_page: 1, per_page: 20, total: data[fallbackKey].length },
    };
  }

  return {
    items: [],
    meta: payload?.meta || { current_page: 1, last_page: 1, per_page: 20, total: 0 },
  };
}

export function extractEntity(payload, key = 'entity') {
  if (!payload) return null;
  if (payload.data?.[key]) return payload.data[key];
  if (payload.data) return payload.data;
  return payload;
}

export function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

export function joinLocation(parts = []) {
  return parts.filter(Boolean).join(', ') || '—';
}
