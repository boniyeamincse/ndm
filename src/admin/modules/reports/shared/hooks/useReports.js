import { useCallback, useEffect, useMemo, useState } from 'react';
import { reportsService } from '../services/reportsService';

function useReport(reportKey, filters) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const normalized = useMemo(() => ({ ...filters }), [JSON.stringify(filters)]); // eslint-disable-line react-hooks/exhaustive-deps

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await reportsService.getReport(reportKey, normalized));
    } catch (err) {
      setError(err.message || `Failed to load ${reportKey} report`);
    } finally {
      setLoading(false);
    }
  }, [normalized, reportKey]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, reload: load };
}

export function useOverviewReport(filters) { return useReport('overview', filters); }
export function useMembershipReport(filters) { return useReport('membership', filters); }
export function useCommitteeReport(filters) { return useReport('committees', filters); }
export function useAssignmentReport(filters) { return useReport('assignments', filters); }
export function useContentReport(filters) { return useReport('content', filters); }
export function useNoticeReport(filters) { return useReport('notices', filters); }
export function useActivityReport(filters) { return useReport('activity', filters); }
