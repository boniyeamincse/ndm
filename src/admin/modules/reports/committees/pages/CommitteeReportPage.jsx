import { useEffect, useMemo, useState } from 'react';
import ReportPageLayout from '../../shared/components/ReportPageLayout';
import { useCommitteeReport } from '../../shared/hooks/useReports';
import { committeeTypesService } from '../../../../organization/committee-types/services/committeeTypesService';
import { BD_GEO } from '../../../../../data/bd-geo';

export default function CommitteeReportPage() {
  const [search, setSearch] = useState('');
  const [committeeTypeOptions, setCommitteeTypeOptions] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    committee_type_id: '',
    status: '',
    is_current: '',
    division_id: '',
    district_id: '',
    start_date: '',
    end_date: '',
    page: 1,
    per_page: 20,
    renderControls: () => null,
  });

  const districtOptions = useMemo(() => {
    const division = BD_GEO.find((entry) => String(entry.id) === String(filters.division_id));
    return division?.districts || [];
  }, [filters.division_id]);

  useEffect(() => {
    let alive = true;

    async function loadCommitteeTypes() {
      try {
        const res = await committeeTypesService.list({ per_page: 100, sort_by: 'hierarchy_order', sort_dir: 'asc' });
        if (alive) {
          setCommitteeTypeOptions(res.items || []);
        }
      } catch {
        if (alive) {
          setCommitteeTypeOptions([]);
        }
      }
    }

    loadCommitteeTypes();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    setFilters((current) => ({
      ...current,
      renderControls: (update) => (
        <>
          <select className="ndm-input" value={current.committee_type_id} onChange={(event) => update('committee_type_id', event.target.value)}>
            <option value="">All Committee Types</option>
            {committeeTypeOptions.map((type) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
          <select className="ndm-input" value={current.status} onChange={(event) => update('status', event.target.value)}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="dissolved">Dissolved</option>
            <option value="archived">Archived</option>
          </select>
          <select className="ndm-input" value={current.is_current} onChange={(event) => update('is_current', event.target.value)}>
            <option value="">Current / All</option>
            <option value="1">Current</option>
            <option value="0">Not Current</option>
          </select>
          <select
            className="ndm-input"
            value={current.division_id}
            onChange={(event) => {
              const value = event.target.value;
              setFilters((prev) => ({ ...prev, division_id: value, district_id: '', page: 1 }));
            }}
          >
            <option value="">All Divisions</option>
            {BD_GEO.map((division) => (
              <option key={division.id} value={division.id}>{division.name}</option>
            ))}
          </select>
          <select className="ndm-input" value={current.district_id} onChange={(event) => update('district_id', event.target.value)} disabled={!current.division_id}>
            <option value="">All Districts</option>
            {districtOptions.map((district) => (
              <option key={district.id} value={district.id}>{district.name}</option>
            ))}
          </select>
        </>
      ),
    }));
  }, [committeeTypeOptions, districtOptions]);

  const { data, loading, error, reload } = useCommitteeReport(filters);
  const cards = data ? [
    { label: 'Total Committees', value: data.summary.total, tone: 'neutral' },
    { label: 'Active', value: data.summary.active, tone: 'success' },
    { label: 'Inactive', value: data.summary.inactive, tone: 'warning' },
    { label: 'Dissolved', value: data.summary.dissolved, tone: 'danger' },
    { label: 'Archived', value: data.summary.archived, tone: 'muted' },
    { label: 'Current Committees', value: data.summary.current, tone: 'info' },
  ] : [];
  return <ReportPageLayout pageTitle="Committee Report" pageSubtitle="Track committee status, formation trend, and organizational coverage." breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Reports' }, { label: 'Committee Report' }]} cards={cards} filters={filters} setFilters={setFilters} search={search} setSearch={setSearch} data={data} loading={loading} error={error} onReload={reload} searchPlaceholder="Search committees" tableColumns={[{ key: 'committee_no', label: 'Committee No' }, { key: 'name', label: 'Name' }, { key: 'type', label: 'Type' }, { key: 'location', label: 'Location' }, { key: 'status', label: 'Status' }, { key: 'current', label: 'Current' }, { key: 'start_date', label: 'Start Date' }, { key: 'parent', label: 'Parent Committee' }]} />;
}
