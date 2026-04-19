import { useState } from 'react';
import ReportPageLayout from '../../shared/components/ReportPageLayout';
import { useOverviewReport } from '../../shared/hooks/useReports';

export default function OverviewReportPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ search: '', start_date: '', end_date: '', page: 1, per_page: 20 });
  const { data, loading, error, reload } = useOverviewReport(filters);

  const summary = data?.summary ?? {};
  const cards = data ? [
    { label: 'Total Members',            value: summary.total_members            ?? 0, tone: 'neutral' },
    { label: 'Total Committees',         value: summary.total_committees         ?? 0, tone: 'info' },
    { label: 'Active Assignments',       value: summary.active_assignments       ?? 0, tone: 'success' },
    { label: 'Published Posts',          value: summary.published_posts          ?? 0, tone: 'success' },
    { label: 'Published Notices',        value: summary.published_notices        ?? 0, tone: 'info' },
    { label: 'Pending Applications',     value: summary.pending_applications     ?? 0, tone: 'warning' },
    { label: 'Pending Profile Requests', value: summary.pending_profile_requests ?? 0, tone: 'warning' },
  ] : [];

  return (
    <ReportPageLayout
      pageTitle="Overview Report"
      pageSubtitle="Executive control center for organization operations and publishing activity."
      breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Reports' }, { label: 'Overview Report' }]}
      cards={cards}
      filters={filters}
      setFilters={setFilters}
      search={search}
      setSearch={setSearch}
      data={data}
      loading={loading}
      error={error}
      onReload={reload}
      searchPlaceholder="Search overview insights"
      tableColumns={[
        { key: 'entity', label: 'Entity' },
        { key: 'title', label: 'Title' },
        { key: 'module', label: 'Module' },
        { key: 'status', label: 'Status' },
        { key: 'date', label: 'Date' },
      ]}
    />
  );
}
