import { useState } from 'react';
import ReportPageLayout from '../../shared/components/ReportPageLayout';
import { useOverviewReport } from '../../shared/hooks/useReports';

export default function OverviewReportPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ search: '', start_date: '', end_date: '', page: 1, per_page: 20 });
  const { data, loading, error, reload } = useOverviewReport(filters);

  const cards = data ? [
    { label: 'Total Members', value: data.summary.total_members, tone: 'neutral' },
    { label: 'Total Committees', value: data.summary.total_committees, tone: 'info' },
    { label: 'Active Assignments', value: data.summary.active_assignments, tone: 'success' },
    { label: 'Published Posts', value: data.summary.published_posts, tone: 'success' },
    { label: 'Published Notices', value: data.summary.published_notices, tone: 'info' },
    { label: 'Pending Applications', value: data.summary.pending_applications, tone: 'warning' },
    { label: 'Pending Profile Requests', value: data.summary.pending_profile_requests, tone: 'warning' },
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
