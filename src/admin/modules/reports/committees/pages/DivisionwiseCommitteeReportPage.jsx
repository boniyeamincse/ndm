import { useEffect, useMemo, useState } from 'react';
import ReportPageLayout from '../../shared/components/ReportPageLayout';
import ReportDataTable from '../../shared/components/ReportDataTable';
import ReportSectionCard from '../../shared/components/ReportSectionCard';
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

function normalizeDate(value) {
  if (!value) return '—';
  const text = String(value);
  return text.length >= 10 ? text.slice(0, 10) : text;
}

export default function DivisionwiseCommitteeReportPage() {
  const [search, setSearch] = useState('');
  const [committeeTypeOptions, setCommitteeTypeOptions] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    committee_type_id: '',
    division_id: '',
    is_current: '',
    status: 'active',
    start_date: '',
    end_date: '',
    page: 1,
    per_page: 500,
    renderControls: () => null,
  });

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
          <select className="ndm-input" value={current.division_id} onChange={(event) => update('division_id', event.target.value)}>
            <option value="">All Divisions</option>
            {BD_GEO.map((division) => (
              <option key={division.id} value={division.id}>{division.name}</option>
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
  }, [committeeTypeOptions]);

  const { data, loading, error, reload } = useCommitteeReport(filters);

  const grouped = useMemo(() => {
    const groups = new Map();

    (data?.rows || []).forEach((row) => {
      const location = splitLocation(row.location);
      const key = location.division;
      if (!groups.has(key)) {
        groups.set(key, {
          division: key,
          total_active: 0,
          current_active: 0,
          districts: new Set(),
          committee_types: new Set(),
          latest_start_date: null,
        });
      }

      const entry = groups.get(key);
      entry.total_active += 1;
      if (String(row.current).toLowerCase() === 'yes') {
        entry.current_active += 1;
      }

      if (location.district && location.district !== 'Unknown District') {
        entry.districts.add(location.district);
      }

      if (row.type) {
        entry.committee_types.add(row.type);
      }

      if (row.start_date && (!entry.latest_start_date || String(row.start_date) > String(entry.latest_start_date))) {
        entry.latest_start_date = row.start_date;
      }
    });

    return Array.from(groups.values())
      .map((entry) => ({
        division: entry.division,
        total_active: entry.total_active,
        current_active: entry.current_active,
        district_coverage: entry.districts.size,
        committee_types: entry.committee_types.size,
        latest_start_date: normalizeDate(entry.latest_start_date),
      }))
      .sort((a, b) => b.total_active - a.total_active || a.division.localeCompare(b.division));
  }, [data?.rows]);

  const districtGrouped = useMemo(() => {
    const groups = new Map();

    (data?.rows || []).forEach((row) => {
      const location = splitLocation(row.location);
      const key = `${location.division}__${location.district}`;

      if (!groups.has(key)) {
        groups.set(key, {
          division: location.division,
          district: location.district,
          total_active: 0,
          current_active: 0,
          committee_types: new Set(),
          latest_start_date: null,
        });
      }

      const entry = groups.get(key);
      entry.total_active += 1;

      if (String(row.current).toLowerCase() === 'yes') {
        entry.current_active += 1;
      }

      if (row.type) {
        entry.committee_types.add(row.type);
      }

      if (row.start_date && (!entry.latest_start_date || String(row.start_date) > String(entry.latest_start_date))) {
        entry.latest_start_date = row.start_date;
      }
    });

    return Array.from(groups.values())
      .map((entry) => ({
        division: entry.division,
        district: entry.district,
        total_active: entry.total_active,
        current_active: entry.current_active,
        committee_types: entry.committee_types.size,
        latest_start_date: normalizeDate(entry.latest_start_date),
      }))
      .sort((a, b) => b.total_active - a.total_active || a.division.localeCompare(b.division) || a.district.localeCompare(b.district));
  }, [data?.rows]);

  const summary = useMemo(() => {
    const totalActive = grouped.reduce((sum, item) => sum + item.total_active, 0);
    const totalCurrent = grouped.reduce((sum, item) => sum + item.current_active, 0);
    const coveredDivisions = grouped.length;
    const coveredDistricts = grouped.reduce((sum, item) => sum + item.district_coverage, 0);

    return {
      totalActive,
      totalCurrent,
      coveredDivisions,
      coveredDistricts,
      averagePerDivision: coveredDivisions ? (totalActive / coveredDivisions).toFixed(1) : '0',
    };
  }, [grouped]);

  const cards = [
    { label: 'Active Committees', value: summary.totalActive, tone: 'success' },
    { label: 'Current Active', value: summary.totalCurrent, tone: 'info' },
    { label: 'Covered Divisions', value: summary.coveredDivisions, tone: 'neutral' },
    { label: 'Covered District Slots', value: summary.coveredDistricts, tone: 'warning' },
    { label: 'Avg / Division', value: summary.averagePerDivision, tone: 'muted' },
  ];

  const reportData = {
    ...(data || {}),
    charts: [
      {
        id: 'division_active_totals',
        title: 'Active Committees by Division',
        type: 'bar',
        data: grouped.map((item) => ({ label: item.division, value: item.total_active })),
      },
      {
        id: 'division_current_totals',
        title: 'Current Active by Division',
        type: 'bar',
        data: grouped.map((item) => ({ label: item.division, value: item.current_active })),
      },
    ],
    rows: grouped,
    meta: null,
  };

  const districtSummarySection = (
    <ReportSectionCard title="District-wise Comparison">
      <ReportDataTable
        columns={[
          { key: 'division', label: 'Division' },
          { key: 'district', label: 'District' },
          { key: 'total_active', label: 'Active Committees' },
          { key: 'current_active', label: 'Current Active' },
          { key: 'committee_types', label: 'Committee Types' },
          { key: 'latest_start_date', label: 'Latest Start Date' },
        ]}
        rows={districtGrouped}
      />
    </ReportSectionCard>
  );

  return (
    <ReportPageLayout
      pageTitle="Division-wise Summary Report"
      pageSubtitle="Division level snapshot of active committees, district coverage, and current committee strength."
      breadcrumbs={[
        { label: 'Admin', path: '/admin/dashboard' },
        { label: 'Reports' },
        { label: 'Division-wise Summary Report' },
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
      extraSections={districtSummarySection}
      searchPlaceholder="Search division summary"
      tableColumns={[
        { key: 'division', label: 'Division' },
        { key: 'total_active', label: 'Active Committees' },
        { key: 'current_active', label: 'Current Active' },
        { key: 'district_coverage', label: 'District Coverage' },
        { key: 'committee_types', label: 'Committee Types' },
        { key: 'latest_start_date', label: 'Latest Start Date' },
      ]}
    />
  );
}
