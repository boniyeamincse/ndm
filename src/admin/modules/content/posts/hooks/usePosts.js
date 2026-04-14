import { useCallback, useEffect, useMemo, useState } from 'react';
import { postsService } from '../services/postsService';

export function usePosts(filters) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: 20, total: 0 });
  const [summary, setSummary] = useState({ total: 0, draft: 0, pending_review: 0, published: 0, archived: 0, featured: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const normalized = useMemo(() => ({ ...filters }), [JSON.stringify(filters)]); // eslint-disable-line react-hooks/exhaustive-deps

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [listRes, summaryRes] = await Promise.all([
        postsService.list(normalized),
        postsService.summary(),
      ]);
      setItems(listRes.items || []);
      setMeta(listRes.meta || { current_page: 1, last_page: 1, per_page: 20, total: 0 });
      setSummary(summaryRes || {});
    } catch (err) {
      setError(err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [normalized]);

  useEffect(() => { load(); }, [load]);

  return { items, meta, summary, loading, error, reload: load };
}

export function usePostDetail(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      setData(await postsService.detail(id));
    } catch (err) {
      setError(err.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, reload: load };
}

export function usePostsSummary() {
  const [summary, setSummary] = useState({ total: 0, draft: 0, pending_review: 0, published: 0, archived: 0, featured: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setSummary(await postsService.summary());
    } catch (err) {
      setError(err.message || 'Failed to load post summary');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { summary, loading, error, reload: load };
}

export function usePostActions(onSuccess) {
  const [busyAction, setBusyAction] = useState('');
  const [actionError, setActionError] = useState('');

  const run = useCallback(async (action, id, payload) => {
    setBusyAction(action);
    setActionError('');
    try {
      switch (action) {
        case 'create':
        case 'update':
          await postsService.save(action === 'update' ? id : null, payload);
          break;
        case 'publish':
          await postsService.publish(id, payload);
          break;
        case 'unpublish':
          await postsService.unpublish(id);
          break;
        case 'archive':
          await postsService.archive(id);
          break;
        case 'feature':
          await postsService.feature(id, payload);
          break;
        case 'delete':
          await postsService.remove(id);
          break;
        case 'restore':
          await postsService.restore(id);
          break;
        default:
          break;
      }
      onSuccess?.();
    } catch (err) {
      setActionError(err.message || 'Action failed');
    } finally {
      setBusyAction('');
    }
  }, [onSuccess]);

  return { run, busyAction, actionError };
}
