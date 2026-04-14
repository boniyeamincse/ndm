import { useState } from 'react';
import ReportPageLayout from '../../shared/components/ReportPageLayout';
import { useActivityReport } from '../../shared/hooks/useReports';

export default function ActivityReportPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ search: '', module: '', actor: '', activity_type: '', related_entity_type: '', start_date: '', end_date: '', page: 1, per_page: 20, renderControls: (update) => (<><input className="ndm-input" value={filters.module} onChange={(e) => update('module', e.target.value)} placeholder="Module" /><input className="ndm-input" value={filters.actor} onChange={(e) => update('actor', e.target.value)} placeholder="Actor" /><input className="ndm-input" value={filters.activity_type} onChange={(e) => update('activity_type', e.target.value)} placeholder="Activity type" /></>) });
  const { data, loading, error, reload } = useActivityReport(filters);
  const cards = data ? [
    { label: 'Total Activities', value: data.summary.total, tone: 'neutral' },
    { label: 'Approvals', value: data.summary.approvals, tone: 'success' },
    { label: 'Publications', value: data.summary.publications, tone: 'info' },
    { label: 'Status Changes', value: data.summary.status_changes, tone: 'warning' },
    { label: 'Committee Actions', value: data.summary.committee_actions, tone: 'muted' },
    { label: 'Profile Request Reviews', value: data.summary.profile_reviews, tone: 'danger' },
  ] : [];
  return <ReportPageLayout pageTitle="Activity Report" pageSubtitle="Inspect cross-module admin actions, approvals, and publication flow." breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Reports' }, { label: 'Activity Report' }]} cards={cards} filters={filters} setFilters={setFilters} search={search} setSearch={setSearch} data={data} loading={loading} error={error} onReload={reload} searchPlaceholder="Search activities" tableColumns={[{ key: 'module', label: 'Module' }, { key: 'action', label: 'Action' }, { key: 'title', label: 'Title' }, { key: 'actor', label: 'Actor' }, { key: 'related_entity', label: 'Related Entity' }, { key: 'created_at', label: 'Created At' }]} />;
}
