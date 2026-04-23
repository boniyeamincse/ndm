import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';

// ─── Data adaptors ────────────────────────────────────────────────────────────
// The backend uses generic {label, value} for chart series.
// Chart components expect field-specific names — adapt here so components stay clean.

function adaptTrendData(raw = []) {
  // {label:"2025-05", value:0} → {month:"May 25", new_members:0, total_members:0}
  return raw.map(({ label, value }) => {
    const [yr, mo] = label.split('-');
    const monthStr = new Date(`${yr}-${mo}-01`).toLocaleString('en-US', { month: 'short' });
    return { month: `${monthStr} ${yr.slice(2)}`, new_members: value, total_members: value };
  });
}

function adaptStatusData(raw = []) {
  // {label:"active", value:1} → {status:"active", count:1}
  return raw.map(({ label, value }, i) => ({ id: i, status: label, count: value }));
}

function adaptTypeData(raw = []) {
  // {label:"active", value:3} → {type:"active", count:3}
  return raw.map(({ label, value }, i) => ({ id: i, type: label, count: value }));
}

// Module name → color-map key used in RecentActivityList
const MODULE_TYPE_MAP = {
  applications: 'application',
  members:      'member',
  committees:   'committee',
  posts:        'post',
  notices:      'notice',
  assignments:  'member',
  hierarchy:    'member',
  system:       'system',
};

function adaptActivities(raw = []) {
  return raw.map((item, i) => ({
    ...item,
    id: item.id ?? `${item.module}-${i}`,
    type: MODULE_TYPE_MAP[item.module] || 'system',
  }));
}

function adaptPendingItems(raw = []) {
  // {type, label, count, action_url, priority} → {id, label, count, route, priority}
  return raw.map((item, i) => ({
    ...item,
    id: item.id ?? item.type ?? i,
    route: item.route || item.action_url || null,
  }));
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

// Hook: fetch dashboard stats cards
export function useDashboardStats() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await dashboardService.getStats();
      setData(result || null);
    } catch (err) {
      setData(null);
      setError(err?.message || 'Failed to load dashboard stats.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}

// Hook: fetch pending items
export function usePendingItems() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const raw = await dashboardService.getPendingItems();
      setData(adaptPendingItems(Array.isArray(raw) ? raw : []));
    } catch (err) {
      setData([]);
      setError(err?.message || 'Failed to load pending items.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}

// Hook: fetch recent activities
export function useRecentActivities() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const raw = await dashboardService.getRecentActivities(10);
      setData(adaptActivities(Array.isArray(raw) ? raw : []));
    } catch (err) {
      setData([]);
      setError(err?.message || 'Failed to load recent activity.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}

// Hook: fetch latest content (notices + posts)
export function useLatestContent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await dashboardService.getLatestContent();
      setData(result || { latest_notices: [], latest_posts: [] });
    } catch (err) {
      setData({ latest_notices: [], latest_posts: [] });
      setError(err?.message || 'Failed to load latest content.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}

// Hook: fetch charts data
export function useDashboardCharts(period = '12m') {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const raw = await dashboardService.getCharts(period);
      setData({
        membershipTrend: adaptTrendData(raw?.membership_application_trend?.data || raw?.member_growth?.data || []),
        applicationStatus: adaptStatusData(raw?.members_by_status?.data || []),
        committeeTypes: adaptTypeData(raw?.committees_by_status?.data || []),
      });
    } catch (err) {
      setData({
        membershipTrend: [],
        applicationStatus: [],
        committeeTypes: [],
      });
      setError(err?.message || 'Failed to load dashboard charts.');
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}

