import { useCallback, useEffect, useMemo, useState } from 'react';
import { profileUpdateRequestsService } from '../services/profileUpdateRequestsService';

export function useProfileUpdateRequests(filters) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: 20, total: 0 });
  const [summary, setSummary] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, cancelled: 0, recent: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const normalized = useMemo(() => ({ ...filters }), [JSON.stringify(filters)]); // eslint-disable-line react-hooks/exhaustive-deps

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await profileUpdateRequestsService.list(normalized);
      setItems(result.items || []);
      setMeta(result.meta || { current_page: 1, last_page: 1, per_page: 20, total: 0 });
      setSummary(result.summary || { total: 0, pending: 0, approved: 0, rejected: 0, cancelled: 0, recent: 0 });
    } catch (err) {
      setError(err.message || 'Failed to load profile update requests');
    } finally {
      setLoading(false);
    }
  }, [normalized]);

  useEffect(() => { load(); }, [load]);

  return { items, meta, summary, loading, error, reload: load };
}

export function useProfileUpdateRequestDetail(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      setData(await profileUpdateRequestsService.detail(id));
    } catch (err) {
      setError(err.message || 'Failed to load request details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, reload: load };
}

export function useProfileUpdateRequestActions(onSuccess) {
  const [busyAction, setBusyAction] = useState('');
  const [actionError, setActionError] = useState('');

  const run = useCallback(async (action, id, payload) => {
    setBusyAction(action);
    setActionError('');
    try {
      if (action === 'approve') await profileUpdateRequestsService.approve(id, payload);
      if (action === 'reject') await profileUpdateRequestsService.reject(id, payload);
      onSuccess?.();
      return true;
    } catch (err) {
      setActionError(err.message || 'Request action failed');
      return false;
    } finally {
      setBusyAction('');
    }
  }, [onSuccess]);

  return { run, busyAction, actionError };
}
