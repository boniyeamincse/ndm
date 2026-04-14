import { useCallback, useEffect, useMemo, useState } from 'react';
import { positionsService } from '../services/positionsService';

export function usePositions(filters) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0, per_page: 20 });
  const [summary, setSummary] = useState({ total: 0, active: 0, leadership: 0, committee_specific: 0, global: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const normalized = useMemo(() => ({ ...filters }), [JSON.stringify(filters)]); // eslint-disable-line react-hooks/exhaustive-deps

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [result, summaryResult] = await Promise.all([
        positionsService.list(normalized),
        positionsService.summary(),
      ]);
      setItems(result.items);
      setMeta(result.meta);
      setSummary(summaryResult);
    } catch (err) {
      setError(err.message || 'Failed to load positions');
    } finally {
      setLoading(false);
    }
  }, [normalized]);

  useEffect(() => { load(); }, [load]);
  return { items, meta, summary, loading, error, reload: load };
}

export function usePositionDetail(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      setData(await positionsService.detail(id));
    } catch (err) {
      setError(err.message || 'Failed to load position');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);
  return { data, loading, error, reload: load };
}

export function usePositionActions(onDone) {
  const [busyAction, setBusyAction] = useState('');
  const [actionError, setActionError] = useState('');
  const run = useCallback(async (action, id, payload = {}) => {
    setBusyAction(action);
    setActionError('');
    try {
      if (action === 'create') await positionsService.create(payload);
      if (action === 'update') await positionsService.update(id, payload);
      if (action === 'status') await positionsService.updateStatus(id, payload);
      if (action === 'delete') await positionsService.remove(id);
      if (action === 'restore') await positionsService.restore(id);
      if (onDone) onDone(action);
      return true;
    } catch (err) {
      setActionError(err.message || 'Position action failed');
      return false;
    } finally {
      setBusyAction('');
    }
  }, [onDone]);
  return { busyAction, actionError, run, clearError: () => setActionError('') };
}
