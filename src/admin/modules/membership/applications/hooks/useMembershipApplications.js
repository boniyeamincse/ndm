import { useCallback, useEffect, useMemo, useState } from 'react';
import { membershipApplicationsService } from '../services/membershipApplicationsService';

export function useMembershipApplications(filters) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: 20, total: 0 });
  const [summary, setSummary] = useState({ total: 0, pending: 0, under_review: 0, approved: 0, rejected: 0, on_hold: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const normalized = useMemo(() => ({ ...filters }), [JSON.stringify(filters)]); // eslint-disable-line react-hooks/exhaustive-deps

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [listRes, summaryRes] = await Promise.all([
        membershipApplicationsService.list(normalized),
        membershipApplicationsService.summary({ search: normalized.search }),
      ]);

      setItems(listRes.items);
      setMeta(listRes.meta);
      setSummary(summaryRes);
    } catch (err) {
      setError(err.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, [normalized]);

  useEffect(() => {
    load();
  }, [load]);

  return { items, meta, summary, loading, error, reload: load };
}

export function useMembershipApplicationDetail(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const detail = await membershipApplicationsService.detail(id);
      setData(detail);
    } catch (err) {
      setError(err.message || 'Failed to load application details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}

export function useMembershipApplicationActions(onDone) {
  const [busyAction, setBusyAction] = useState('');
  const [actionError, setActionError] = useState('');

  const run = useCallback(async (action, id, payload) => {
    setBusyAction(action);
    setActionError('');

    try {
      if (action === 'review') await membershipApplicationsService.review(id, payload?.remarks || '');
      if (action === 'approve') await membershipApplicationsService.approve(id, payload?.remarks || '');
      if (action === 'reject') await membershipApplicationsService.reject(id, payload?.rejection_reason || '');
      if (action === 'hold') await membershipApplicationsService.hold(id, payload?.remarks || '');
      if (onDone) onDone(action);
      return true;
    } catch (err) {
      setActionError(err.message || 'Action failed');
      return false;
    } finally {
      setBusyAction('');
    }
  }, [onDone]);

  return { busyAction, actionError, run, clearError: () => setActionError('') };
}
