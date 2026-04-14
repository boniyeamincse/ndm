import { useCallback, useEffect, useMemo, useState } from 'react';
import { committeeTypesService } from '../services/committeeTypesService';

export function useCommitteeTypes(filters) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0, per_page: 20 });
  const [summary, setSummary] = useState({ total: 0, active: 0, inactive: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const normalized = useMemo(() => ({ ...filters }), [JSON.stringify(filters)]); // eslint-disable-line react-hooks/exhaustive-deps

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await committeeTypesService.list(normalized);
      setItems(result.items);
      setMeta(result.meta);
      setSummary({
        total: result.meta.total,
        active: result.items.filter((item) => item.is_active).length,
        inactive: result.items.filter((item) => !item.is_active).length,
      });
    } catch (err) {
      setError(err.message || 'Failed to load committee types');
    } finally {
      setLoading(false);
    }
  }, [normalized]);

  useEffect(() => { load(); }, [load]);
  return { items, meta, summary, loading, error, reload: load };
}

export function useCommitteeTypeDetail(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      setData(await committeeTypesService.detail(id));
    } catch (err) {
      setError(err.message || 'Failed to load committee type');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);
  return { data, loading, error, reload: load };
}

export function useCommitteeTypeActions(onDone) {
  const [busyAction, setBusyAction] = useState('');
  const [actionError, setActionError] = useState('');

  const run = useCallback(async (action, id, payload = {}) => {
    setBusyAction(action);
    setActionError('');
    try {
      if (action === 'create') await committeeTypesService.create(payload);
      if (action === 'update') await committeeTypesService.update(id, payload);
      if (action === 'delete') await committeeTypesService.remove(id);
      if (action === 'restore') await committeeTypesService.restore(id);
      if (onDone) onDone(action);
      return true;
    } catch (err) {
      setActionError(err.message || 'Committee type action failed');
      return false;
    } finally {
      setBusyAction('');
    }
  }, [onDone]);

  return { busyAction, actionError, run, clearError: () => setActionError('') };
}
