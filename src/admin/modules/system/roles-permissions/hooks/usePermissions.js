import { useCallback, useEffect, useState } from 'react';
import { permissionsService } from '../services/permissionsService';

export function usePermissionsGrouped() {
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setGrouped(await permissionsService.grouped());
    } catch (err) {
      setError(err.message || 'Failed to load permissions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { grouped, loading, error, reload: load };
}
