import { useCallback, useEffect, useMemo, useState } from 'react';
import { membersService } from '../services/membersService';

function filterByRouteRules(items, routeConfig, recentPeriodDays) {
  let result = items;

  if (routeConfig?.leadershipOnly) {
    result = result.filter((item) => item.leadership_summary || item.is_leadership || item.position_name);
  }

  if (routeConfig?.recentDays || recentPeriodDays) {
    const days = recentPeriodDays || routeConfig.recentDays;
    const threshold = Date.now() - (days * 86400000);
    result = result
      .filter((item) => item.joined_at && new Date(item.joined_at).getTime() >= threshold)
      .sort((a, b) => new Date(b.joined_at) - new Date(a.joined_at));
  }

  return result;
}

export function useMembers(filters, routeConfig) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: 20, total: 0 });
  const [summary, setSummary] = useState({ total: 0, active: 0, inactive: 0, suspended: 0, leadership: 0, newMembers: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const normalized = useMemo(() => ({ ...filters }), [JSON.stringify(filters)]); // eslint-disable-line react-hooks/exhaustive-deps

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [listRes, summaryRes] = await Promise.all([
        membersService.list(normalized),
        membersService.summary(),
      ]);

      const filtered = filterByRouteRules(listRes.items, routeConfig, normalized.recent_period_days);
      const leadership = listRes.items.filter((item) => item.leadership_summary || item.is_leadership || item.position_name).length;
      const newMembers = listRes.items.filter((item) => item.joined_at && (Date.now() - new Date(item.joined_at).getTime()) <= (30 * 86400000)).length;

      setItems(filtered);
      setMeta({ ...listRes.meta, total: routeConfig?.leadershipOnly || routeConfig?.recentDays ? filtered.length : listRes.meta.total });
      setSummary({
        total: summaryRes.total,
        active: summaryRes.active,
        inactive: summaryRes.inactive,
        suspended: summaryRes.suspended,
        leadership,
        newMembers,
      });
    } catch (err) {
      setError(err.message || 'Failed to load members');
    } finally {
      setLoading(false);
    }
  }, [normalized, routeConfig]);

  useEffect(() => {
    load();
  }, [load]);

  return { items, meta, summary, loading, error, reload: load };
}

export function useMemberDetail(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const detail = await membersService.detail(id);
      setData(detail);
    } catch (err) {
      setError(err.message || 'Failed to load member detail');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}

export function useMemberActions(onDone) {
  const [busyAction, setBusyAction] = useState('');
  const [actionError, setActionError] = useState('');

  const updateProfile = useCallback(async (id, body) => {
    setBusyAction('update');
    setActionError('');
    try {
      await membersService.update(id, body);
      if (onDone) onDone('update');
      return true;
    } catch (err) {
      setActionError(err.message || 'Member update failed');
      return false;
    } finally {
      setBusyAction('');
    }
  }, [onDone]);

  const updateStatus = useCallback(async (id, body) => {
    setBusyAction('status');
    setActionError('');
    try {
      await membersService.updateStatus(id, body);
      if (onDone) onDone('status');
      return true;
    } catch (err) {
      setActionError(err.message || 'Member status update failed');
      return false;
    } finally {
      setBusyAction('');
    }
  }, [onDone]);

  return {
    busyAction,
    actionError,
    updateProfile,
    updateStatus,
    clearError: () => setActionError(''),
  };
}
