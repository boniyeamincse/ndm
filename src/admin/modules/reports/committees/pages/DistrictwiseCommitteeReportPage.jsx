import { useEffect, useMemo, useState } from 'react';
import ReportPageLayout from '../../shared/components/ReportPageLayout';
import { useCommitteeReport } from '../../shared/hooks/useReports';
import { committeeTypesService } from '../../../organization/committee-types/services/committeeTypesService';
import { BD_GEO } from '../../../../../data/bd-geo';

function splitLocation(location = '') {
  const [division = '', district = ''] = String(location).split('/').map((part) => part.trim());
  return {
    division: division || 'Unknown Division',
    district: district || 'Unknown District',
  };
}

export default function DistrictwiseCommitteeReportPage() {
  const [search, setSearch] = useState('');
  const [committeeTypeOptions, setCommitteeTypeOptions] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    committee_type_id: '',
    division_id: '',
    district_id: '',
    is_current: '',
    status: 'active',
    start_date: '',
    end_date: '',
    page: 1,
    per_page: 200,
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
          <select className="ndm-input" value={current.is_current} onChange={(event) => update('is_current', event.target.value)}>
            <option value="">Current / All</option>
            <option value="1">Current</option>
            <option value="0">Not Current</option>
          </select>
        </>
      ),
    }));
  }, [committeeTypeOptions, districtOptions]);

  const { data, loading, error, reload } = useCommitteeReport(filters);

  const tableRows = useMemo(
    () => (data?.rows || []).map((row) => {
      const location = splitLocation(row.location);
      return {
        ...row,
        division: location.division,
        district: location.district,
      };
    }),
    [data?.rows],
  );

  const derivedSummary = useMemo(() => {
    const divisions = new Set(tableRows.map((row) => row.division).filter(Boolean));
    const districts = new Set(tableRows.map((row) => row.district).filter(Boolean));
    const types = new Set(tableRows.map((row) => row.type).filter(Boolean));
    const currentCount = tableRows.filter((row) => String(row.current).toLowerCase() === 'yes').length;

    return {
      total_active: tableRows.length,
      division_coverage: divisions.size,
      district_coverage: districts.size,
      committee_types: types.size,
      current_active: currentCount,
    };
  }, [tableRows]);

  const cards = [
    { label: 'Active Committees', value: derivedSummary.total_active, tone: 'success' },
    { label: 'Division Coverage', value: derivedSummary.division_coverage, tone: 'info' },
    { label: 'District Coverage', value: derivedSummary.district_coverage, tone: 'neutral' },
    { label: 'Active Committee Types', value: derivedSummary.committee_types, tone: 'warning' },
    { label: 'Current Active', value: derivedSummary.current_active, tone: 'success' },
  ];

  const reportData = {
    ...(data || {}),
    rows: tableRows,
    meta: null,
  };

  return (
    <ReportPageLayout
      pageTitle="District-wise Committee Report"
      pageSubtitle="See which divisions and districts have active committees and current organizational coverage."
      breadcrumbs={[
        { label: 'Admin', path: '/admin/dashboard' },
        { label: 'Reports' },
        { label: 'District-wise Committee Report' },
      ]}
      cards={cards}
      filters={filters}
      setFilters={setFilters}
      search={search}
      setSearch={setSearch}
      data={reportData}
      loading={loading}
      error={error}
      onReload={reload}
      searchPlaceholder="Search active committees by name, type, division, or district"
      tableColumns={[
        { key: 'committee_no', label: 'Committee No' },
        { key: 'name', label: 'Committee Name' },
        { key: 'type', label: 'Committee Type' },
        { key: 'division', label: 'Division' },
        { key: 'district', label: 'District' },
        { key: 'current', label: 'Current' },
        { key: 'start_date', label: 'Start Date' },
        { key: 'parent', label: 'Parent Committee' },
      ]}
    />
  );
}
