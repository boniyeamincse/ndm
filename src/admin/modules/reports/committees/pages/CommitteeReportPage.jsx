import { useState } from 'react';
import ReportPageLayout from '../../shared/components/ReportPageLayout';
import { useCommitteeReport } from '../../shared/hooks/useReports';

export default function CommitteeReportPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ search: '', committee_type: '', status: '', is_current: '', division: '', district: '', start_date: '', end_date: '', page: 1, per_page: 20, renderControls: (update) => (<><input className="ndm-input" value={filters.committee_type} onChange={(e) => update('committee_type', e.target.value)} placeholder="Committee type" /><select className="ndm-input" value={filters.status} onChange={(e) => update('status', e.target.value)}><option value="">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option><option value="dissolved">Dissolved</option><option value="archived">Archived</option></select><select className="ndm-input" value={filters.is_current} onChange={(e) => update('is_current', e.target.value)}><option value="">Current / All</option><option value="1">Current</option><option value="0">Not Current</option></select></>) });
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
