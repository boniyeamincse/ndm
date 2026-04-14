import { useCallback, useEffect, useMemo, useState } from 'react';
import { noticesService } from '../services/noticesService';

export function useNotices(filters) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: 20, total: 0 });
  const [summary, setSummary] = useState({ total: 0, draft: 0, published: 0, pinned: 0, expired: 0, urgent: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const normalized = useMemo(() => ({ ...filters }), [JSON.stringify(filters)]); // eslint-disable-line react-hooks/exhaustive-deps

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [listRes, summaryRes] = await Promise.all([
        noticesService.list(normalized),
        noticesService.summary(),
      ]);
      setItems(listRes.items || []);
      setMeta(listRes.meta || { current_page: 1, last_page: 1, per_page: 20, total: 0 });
      setSummary(summaryRes || {});
    } catch (err) {
      setError(err.message || 'Failed to load notices');
    } finally {
      setLoading(false);
    }
  }, [normalized]);

  useEffect(() => { load(); }, [load]);

  return { items, meta, summary, loading, error, reload: load };
}

export function useNoticeDetail(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      setData(await noticesService.detail(id));
    } catch (err) {
      setError(err.message || 'Failed to load notice');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, reload: load };
}

export function useNoticesSummary() {
  const [summary, setSummary] = useState({ total: 0, draft: 0, published: 0, pinned: 0, expired: 0, urgent: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setSummary(await noticesService.summary());
    } catch (err) {
      setError(err.message || 'Failed to load notice summary');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { summary, loading, error, reload: load };
}

export function useNoticeActions(onSuccess) {
  const [busyAction, setBusyAction] = useState('');
  const [actionError, setActionError] = useState('');

  const run = useCallback(async (action, id, payload) => {
    setBusyAction(action);
    setActionError('');
    try {
      switch (action) {
        case 'create':
        case 'update':
          await noticesService.save(action === 'update' ? id : null, payload);
          break;
        case 'publish':
          await noticesService.publish(id, payload);
          break;
        case 'unpublish':
          await noticesService.unpublish(id);
          break;
        case 'archive':
          await noticesService.archive(id);
          break;
        case 'pin':
          await noticesService.pin(id, payload.is_pinned);
          break;
        case 'delete':
          await noticesService.remove(id);
          break;
        case 'restore':
          await noticesService.restore(id);
          break;
        case 'upload-attachments':
          await noticesService.uploadAttachment(id, payload.files);
          break;
        case 'delete-attachment':
          await noticesService.removeAttachment(id, payload.attachmentId);
          break;
        default:
          break;
      }
      onSuccess?.();
    } catch (err) {
      setActionError(err.message || 'Notice action failed');
    } finally {
      setBusyAction('');
    }
  }, [onSuccess]);

  return { run, busyAction, actionError };
}

export function useNoticeAttachments(id) {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const detail = await noticesService.detail(id);
      setAttachments(detail.attachments || []);
    } catch (err) {
      setError(err.message || 'Failed to load attachments');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  return { attachments, loading, error, reload: load, setAttachments };
}
