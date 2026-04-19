import { useCallback, useEffect, useMemo, useState } from 'react';
import { rolesService } from '../services/rolesService';

export function useRoles(filters) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: 20, total: 0 });
  const [summary, setSummary] = useState({ total: 0, system: 0, custom: 0, in_use: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const normalized = useMemo(() => ({ ...filters }), [JSON.stringify(filters)]); // eslint-disable-line react-hooks/exhaustive-deps

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [listRes, summaryRes] = await Promise.all([
        rolesService.list(normalized),
        rolesService.summary(),
      ]);
      setItems(listRes.items || []);
      setMeta(listRes.meta || { current_page: 1, last_page: 1, per_page: 20, total: 0 });
      setSummary(summaryRes || { total: 0, system: 0, custom: 0, in_use: 0 });
    } catch (err) {
      setError(err.message || 'Failed to load roles');
    } finally {
      setLoading(false);
    }
  }, [normalized]);

  useEffect(() => { load(); }, [load]);

  return { items, meta, summary, loading, error, reload: load };
}

export function useRoleDetail(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      setData(await rolesService.detail(id));
    } catch (err) {
      setError(err.message || 'Failed to load role detail');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, reload: load };
}

export function useRoleActions(onSuccess) {
  const [busyAction, setBusyAction] = useState('');
  const [actionError, setActionError] = useState('');

  const run = useCallback(async (action, payload = {}) => {
    setBusyAction(action);
    setActionError('');
    try {
      if (action === 'create') await rolesService.create(payload);
      if (action === 'update') await rolesService.update(payload.id, payload);
      if (action === 'delete') await rolesService.remove(payload.id);
      if (action === 'sync_permissions') await rolesService.syncPermissions(payload.id, payload.permissions || []);
      onSuccess?.();
      return true;
    } catch (err) {
      setActionError(err.message || 'Action failed');
      return false;
    } finally {
      setBusyAction('');
    }
  }, [onSuccess]);

  return { run, busyAction, actionError, clearActionError: () => setActionError('') };
}
