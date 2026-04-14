import { useCallback, useEffect, useState } from 'react';
import { postCategoriesService } from '../services/postCategoriesService';

export function usePostCategories(filters) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: 20, total: 0 });
  const [summary, setSummary] = useState({ total: 0, active: 0, inactive: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [listRes, summaryRes] = await Promise.all([
        postCategoriesService.list(filters),
        postCategoriesService.summary(),
      ]);
      setItems(listRes.items || []);
      setMeta(listRes.meta || { current_page: 1, last_page: 1, per_page: 20, total: 0 });
      setSummary(summaryRes || {});
    } catch (err) {
      setError(err.message || 'Failed to load post categories');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  return { items, meta, summary, loading, error, reload: load };
}

export function usePostCategoryActions(onSuccess) {
  const [busyAction, setBusyAction] = useState('');
  const [actionError, setActionError] = useState('');

  const run = useCallback(async (action, id, payload) => {
    setBusyAction(action);
    setActionError('');
    try {
      switch (action) {
        case 'create':
        case 'update':
          await postCategoriesService.save(action === 'update' ? id : null, payload);
          break;
        case 'toggle-status':
          await postCategoriesService.toggleStatus(id, payload.is_active);
          break;
        case 'delete':
          await postCategoriesService.remove(id);
          break;
        case 'restore':
          await postCategoriesService.restore(id);
          break;
        default:
          break;
      }
      onSuccess?.();
    } catch (err) {
      setActionError(err.message || 'Category action failed');
    } finally {
      setBusyAction('');
    }
  }, [onSuccess]);

  return { run, busyAction, actionError };
}
