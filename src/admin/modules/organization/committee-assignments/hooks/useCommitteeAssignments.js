import { useCallback, useEffect, useMemo, useState } from 'react';
import { committeeAssignmentsService } from '../services/committeeAssignmentsService';

export function useCommitteeAssignments(filters) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0, per_page: 20 });
  const [summary, setSummary] = useState({ total: 0, active: 0, inactive: 0, completed: 0, office_bearers: 0, leadership: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const normalized = useMemo(() => ({ ...filters }), [JSON.stringify(filters)]); // eslint-disable-line react-hooks/exhaustive-deps

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [result, summaryResult] = await Promise.all([
        committeeAssignmentsService.list(normalized),
        committeeAssignmentsService.summary(),
      ]);
      setItems(result.items);
      setMeta(result.meta);
      setSummary(summaryResult);
    } catch (err) {
      setError(err.message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  }, [normalized]);

  useEffect(() => { load(); }, [load]);
  return { items, meta, summary, loading, error, reload: load };
}

export function useCommitteeAssignmentDetail(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      setData(await committeeAssignmentsService.detail(id));
    } catch (err) {
      setError(err.message || 'Failed to load assignment detail');
    } finally {
      setLoading(false);
    }
  }, [id]);
  useEffect(() => { load(); }, [load]);
  return { data, loading, error, reload: load };
}

export function useCommitteeAssignmentActions(onDone) {
  const [busyAction, setBusyAction] = useState('');
  const [actionError, setActionError] = useState('');
  const run = useCallback(async (action, id, payload = {}) => {
    setBusyAction(action);
    setActionError('');
    try {
      if (action === 'create') await committeeAssignmentsService.create(payload);
      if (action === 'update') await committeeAssignmentsService.update(id, payload);
      if (action === 'status') await committeeAssignmentsService.updateStatus(id, payload);
      if (action === 'transfer') await committeeAssignmentsService.transfer(id, payload);
      if (action === 'delete') await committeeAssignmentsService.remove(id);
      if (action === 'restore') await committeeAssignmentsService.restore(id);
      if (onDone) onDone(action);
      return true;
    } catch (err) {
      setActionError(err.message || 'Assignment action failed');
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
      setItems(await committeeAssignmentsService.committeeMembers(committeeId));
    } catch (err) {
      setError(err.message || 'Failed to load committee members');
    } finally {
      setLoading(false);
    }
  }, [committeeId]);
  useEffect(() => { load(); }, [load]);
  return { items, loading, error, reload: load };
}

export function useMemberCommitteeAssignments(memberId) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    if (!memberId) return;
    setLoading(true);
    setError('');
    try {
      setItems(await committeeAssignmentsService.memberAssignments(memberId));
    } catch (err) {
      setError(err.message || 'Failed to load member assignments');
    } finally {
      setLoading(false);
    }
  }, [memberId]);
  useEffect(() => { load(); }, [load]);
  return { items, loading, error, reload: load };
}
