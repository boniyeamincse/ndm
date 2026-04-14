import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';
import {
  mockDashboardStats,
  mockPendingItems,
  mockRecentActivities,
  mockLatestNotices,
  mockLatestPosts,
  mockMembershipTrend,
  mockApplicationStatus,
  mockCommitteeTypes,
} from '../mock/dashboardMock';

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

  useEffect(() => {
    dashboardService.getStats()
      .then(setData)
      .catch(() => setData(mockDashboardStats))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

// Hook: fetch pending items
export function usePendingItems() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dashboardService.getPendingItems()
      .then((raw) => setData(adaptPendingItems(Array.isArray(raw) ? raw : [])))
      .catch(() => setData(mockPendingItems))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

// Hook: fetch recent activities
export function useRecentActivities() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dashboardService.getRecentActivities(10)
      .then((raw) => setData(adaptActivities(Array.isArray(raw) ? raw : [])))
      .catch(() => setData(mockRecentActivities))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

// Hook: fetch latest content (notices + posts)
export function useLatestContent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dashboardService.getLatestContent()
      .then(setData)
      .catch(() => setData({ latest_notices: mockLatestNotices, latest_posts: mockLatestPosts }))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

// Hook: fetch charts data
export function useDashboardCharts(period = '12m') {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dashboardService.getCharts(period)
      .then((raw) => setData({
        membershipTrend:  adaptTrendData(raw?.membership_application_trend?.data || raw?.member_growth?.data || []),
        applicationStatus: adaptStatusData(raw?.members_by_status?.data || []),
        committeeTypes:    adaptTypeData(raw?.committees_by_status?.data || []),
      }))
      .catch(() => setData({
        membershipTrend:  mockMembershipTrend,
        applicationStatus: mockApplicationStatus,
        committeeTypes:    mockCommitteeTypes,
      }))
      .finally(() => setLoading(false));
  }, [period]);

  return { data, loading, error };
}

