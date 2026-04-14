import { useCallback, useEffect, useMemo, useState } from 'react';
import { committeesService } from '../services/committeesService';

export function useCommittees(filters) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: 20, total: 0 });
  const [summary, setSummary] = useState({ total: 0, active: 0, inactive: 0, dissolved: 0, archived: 0, current: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const normalized = useMemo(() => ({ ...filters }), [JSON.stringify(filters)]); // eslint-disable-line react-hooks/exhaustive-deps

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [listRes, summaryRes] = await Promise.all([
        committeesService.list(normalized),
        committeesService.summary(),
      ]);
      setItems(listRes.items);
      setMeta(listRes.meta);
      setSummary(summaryRes);
    } catch (err) {
      setError(err.message || 'Failed to load committees');
    } finally {
      setLoading(false);
    }
  }, [normalized]);

  useEffect(() => { load(); }, [load]);

  return { items, meta, summary, loading, error, reload: load };
}

export function useCommitteeDetail(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const detail = await committeesService.detail(id);
      setData(detail);
    } catch (err) {
      setError(err.message || 'Failed to load committee');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, reload: load };
}

export function useCommitteesTree(filters) {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const normalized = useMemo(() => ({ ...filters }), [JSON.stringify(filters)]); // eslint-disable-line react-hooks/exhaustive-deps

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setNodes(await committeesService.tree(normalized));
    } catch (err) {
      setError(err.message || 'Failed to load committee tree');
    } finally {
      setLoading(false);
    }
  }, [normalized]);

  useEffect(() => { load(); }, [load]);

  return { nodes, loading, error, reload: load };
}

export function useCommitteeActions(onDone) {
  const [busyAction, setBusyAction] = useState('');
  const [actionError, setActionError] = useState('');

  const run = useCallback(async (action, id, payload = {}) => {
    setBusyAction(action);
    setActionError('');
    try {
      if (action === 'create') await committeesService.create(payload);
      if (action === 'update') await committeesService.update(id, payload);
      if (action === 'status') await committeesService.updateStatus(id, payload);
      if (action === 'delete') await committeesService.remove(id);
      if (action === 'restore') await committeesService.restore(id);
      if (onDone) onDone(action);
      return true;
    } catch (err) {
      setActionError(err.message || 'Committee action failed');
      return false;
    } finally {
      setBusyAction('');
    }
  }, [onDone]);

  return { busyAction, actionError, run, clearError: () => setActionError('') };
}

export function useCommitteeMembers(committeeId) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!committeeId) return;
    setLoading(true);
    setError('');
    try {
      setItems(await committeesService.committeeMembers(committeeId));
    } catch (err) {
      setError(err.message || 'Failed to load committee members');
    } finally {
      setLoading(false);
    }
  }, [committeeId]);

  useEffect(() => { load(); }, [load]);

  return { items, loading, error, reload: load };
}
