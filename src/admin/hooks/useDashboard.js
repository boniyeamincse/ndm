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

// Hook: fetch dashboard stats cards
export function useDashboardStats() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dashboardService.getStats()
      .then(setData)
      .catch(() => setData(mockDashboardStats)) // graceful fallback to mock
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
      .then(setData)
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
      .then(setData)
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
      .then(setData)
      .catch(() => setData({
        membership_application_trend: { data: mockMembershipTrend },
        member_growth: { data: mockMembershipTrend },
        members_by_status: { data: mockApplicationStatus },
        committees_by_status: { data: mockCommitteeTypes },
      }))
      .finally(() => setLoading(false));
  }, [period]);

  return { data, loading, error };
}
