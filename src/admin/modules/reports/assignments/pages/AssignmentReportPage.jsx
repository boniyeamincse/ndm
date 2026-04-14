import { useState } from 'react';
import ReportPageLayout from '../../shared/components/ReportPageLayout';
import { useAssignmentReport } from '../../shared/hooks/useReports';

export default function AssignmentReportPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ search: '', committee: '', committee_type: '', member: '', position: '', assignment_type: '', status: '', is_primary: '', is_leadership: '', start_date: '', end_date: '', page: 1, per_page: 20, renderControls: (update) => (<><input className="ndm-input" value={filters.committee} onChange={(e) => update('committee', e.target.value)} placeholder="Committee" /><input className="ndm-input" value={filters.position} onChange={(e) => update('position', e.target.value)} placeholder="Position" /><select className="ndm-input" value={filters.status} onChange={(e) => update('status', e.target.value)}><option value="">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option><option value="completed">Completed</option></select></>) });
  const { data, loading, error, reload } = useAssignmentReport(filters);
  const cards = data ? [
    { label: 'Total Assignments', value: data.summary.total, tone: 'neutral' },
    { label: 'Active', value: data.summary.active, tone: 'success' },
    { label: 'Inactive', value: data.summary.inactive, tone: 'warning' },
    { label: 'Completed', value: data.summary.completed, tone: 'muted' },
    { label: 'Office Bearers', value: data.summary.office_bearers, tone: 'info' },
    { label: 'Leadership Assignments', value: data.summary.leadership, tone: 'info' },
  ] : [];
  return <ReportPageLayout pageTitle="Assignment Report" pageSubtitle="Inspect committee assignment coverage, leadership seats, and term status." breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Reports' }, { label: 'Assignment Report' }]} cards={cards} filters={filters} setFilters={setFilters} search={search} setSearch={setSearch} data={data} loading={loading} error={error} onReload={reload} searchPlaceholder="Search assignments" tableColumns={[{ key: 'assignment_no', label: 'Assignment No' }, { key: 'member', label: 'Member' }, { key: 'committee', label: 'Committee' }, { key: 'position', label: 'Position' }, { key: 'assignment_type', label: 'Assignment Type' }, { key: 'primary', label: 'Primary' }, { key: 'leadership', label: 'Leadership' }, { key: 'status', label: 'Status' }, { key: 'start_date', label: 'Start Date' }, { key: 'end_date', label: 'End Date' }]} />;
}
