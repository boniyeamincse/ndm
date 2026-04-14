import { useState, useEffect, useCallback } from 'react';
import { applicationService } from '../services/applicationService';

export function useApplications(filters) {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0, per_page: 20 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    applicationService.list(filters)
      .then((res) => {
        setData(res.data || []);
        setMeta(res.meta || { current_page: 1, last_page: 1, total: 0, per_page: 20 });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [JSON.stringify(filters)]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { load(); }, [load]);

  return { data, meta, loading, error, reload: load };
}

export function useApplicationDetail(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    applicationService.get(id)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, reload: load };
}
