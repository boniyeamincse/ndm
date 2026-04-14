import { useState } from 'react';
import ReportPageLayout from '../../shared/components/ReportPageLayout';
import { useNoticeReport } from '../../shared/hooks/useReports';

export default function NoticeReportPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ search: '', notice_type: '', priority: '', status: '', visibility: '', audience_type: '', committee: '', pinned: '', start_date: '', end_date: '', page: 1, per_page: 20, renderControls: (update) => (<><input className="ndm-input" value={filters.notice_type} onChange={(e) => update('notice_type', e.target.value)} placeholder="Notice type" /><select className="ndm-input" value={filters.priority} onChange={(e) => update('priority', e.target.value)}><option value="">All Priority</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option><option value="critical">Critical</option></select><select className="ndm-input" value={filters.visibility} onChange={(e) => update('visibility', e.target.value)}><option value="">All Visibility</option><option value="public">Public</option><option value="members_only">Members Only</option><option value="internal">Internal</option></select></>) });
  const { data, loading, error, reload } = useNoticeReport(filters);
  const cards = data ? [
    { label: 'Total Notices', value: data.summary.total, tone: 'neutral' },
    { label: 'Published', value: data.summary.published, tone: 'success' },
    { label: 'Draft', value: data.summary.draft, tone: 'muted' },
    { label: 'Pinned', value: data.summary.pinned, tone: 'info' },
    { label: 'Expired', value: data.summary.expired, tone: 'danger' },
    { label: 'Urgent Notices', value: data.summary.urgent, tone: 'warning' },
  ] : [];
  return <ReportPageLayout pageTitle="Notice Report" pageSubtitle="Track notice urgency, targeting, and expiration risk." breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Reports' }, { label: 'Notice Report' }]} cards={cards} filters={filters} setFilters={setFilters} search={search} setSearch={setSearch} data={data} loading={loading} error={error} onReload={reload} searchPlaceholder="Search notices" tableColumns={[{ key: 'notice_no', label: 'Notice No' }, { key: 'title', label: 'Title' }, { key: 'type', label: 'Type' }, { key: 'priority', label: 'Priority' }, { key: 'status', label: 'Status' }, { key: 'visibility', label: 'Visibility' }, { key: 'audience', label: 'Audience' }, { key: 'pinned', label: 'Pinned' }, { key: 'publish_at', label: 'Publish At' }, { key: 'expires_at', label: 'Expires At' }]} />;
}
