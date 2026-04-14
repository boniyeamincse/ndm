import { useCallback, useEffect, useMemo, useState } from 'react';
import { reportingHierarchyService } from '../services/reportingHierarchyService';

export function useReportingRelations(filters) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0, per_page: 20 });
  const [summary, setSummary] = useState({ total: 0, active: 0, primary: 0, direct: 0, functional: 0, advisory: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const normalized = useMemo(() => ({ ...filters }), [JSON.stringify(filters)]); // eslint-disable-line react-hooks/exhaustive-deps

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [result, summaryResult] = await Promise.all([
        reportingHierarchyService.list(normalized),
        reportingHierarchyService.summary(),
      ]);
      setItems(result.items);
      setMeta(result.meta);
      setSummary(summaryResult);
    } catch (err) {
      setError(err.message || 'Failed to load reporting relations');
    } finally {
      setLoading(false);
    }
  }, [normalized]);
  useEffect(() => { load(); }, [load]);
  return { items, meta, summary, loading, error, reload: load };
}

export function useReportingRelationDetail(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      setData(await reportingHierarchyService.detail(id));
    } catch (err) {
      setError(err.message || 'Failed to load hierarchy detail');
    } finally {
      setLoading(false);
    }
  }, [id]);
  useEffect(() => { load(); }, [load]);
  return { data, loading, error, reload: load };
}

export function useReportingRelationActions(onDone) {
  const [busyAction, setBusyAction] = useState('');
  const [actionError, setActionError] = useState('');
  const run = useCallback(async (action, id, payload = {}) => {
    setBusyAction(action);
    setActionError('');
    try {
      if (action === 'create') await reportingHierarchyService.create(payload);
      if (action === 'update') await reportingHierarchyService.update(id, payload);
      if (action === 'status') await reportingHierarchyService.updateStatus(id, payload);
      if (action === 'delete') await reportingHierarchyService.remove(id);
      if (action === 'restore') await reportingHierarchyService.restore(id);
      if (onDone) onDone(action);
      return true;
    } catch (err) {
      setActionError(err.message || 'Hierarchy action failed');
      return false;
    } finally {
      setBusyAction('');
    }
  }, [onDone]);
  return { busyAction, actionError, run, clearError: () => setActionError('') };
}

export function useCommitteeHierarchyTree(committeeId) {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    if (!committeeId) return;
    setLoading(true);
    setError('');
    try {
      setNodes(await reportingHierarchyService.committeeHierarchyTree(committeeId));
    } catch (err) {
      setError(err.message || 'Failed to load committee hierarchy tree');
    } finally {
      setLoading(false);
    }
  }, [committeeId]);
  useEffect(() => { load(); }, [load]);
  return { nodes, loading, error, reload: load };
}

export function useLeaderLookup(assignmentId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    if (!assignmentId) return;
    setLoading(true);
    setError('');
    try {
      setData(await reportingHierarchyService.leaderLookup(assignmentId));
    } catch (err) {
      setError(err.message || 'Failed to lookup leader');
    } finally {
      setLoading(false);
    }
  }, [assignmentId]);
  useEffect(() => { load(); }, [load]);
  return { data, loading, error, reload: load };
}

export function useSubordinates(assignmentId) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    if (!assignmentId) return;
    setLoading(true);
    setError('');
    try {
      setItems(await reportingHierarchyService.subordinates(assignmentId));
    } catch (err) {
      setError(err.message || 'Failed to load subordinates');
    } finally {
      setLoading(false);
    }
  }, [assignmentId]);
  useEffect(() => { load(); }, [load]);
  return { items, loading, error, reload: load };
}
