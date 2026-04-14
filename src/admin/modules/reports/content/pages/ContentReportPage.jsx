import { useState } from 'react';
import ReportPageLayout from '../../shared/components/ReportPageLayout';
import { useContentReport } from '../../shared/hooks/useReports';

export default function ContentReportPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ search: '', content_type: '', category: '', author: '', status: '', visibility: '', featured: '', start_date: '', end_date: '', page: 1, per_page: 20, renderControls: (update) => (<><input className="ndm-input" value={filters.content_type} onChange={(e) => update('content_type', e.target.value)} placeholder="Content type" /><input className="ndm-input" value={filters.category} onChange={(e) => update('category', e.target.value)} placeholder="Category" /><select className="ndm-input" value={filters.status} onChange={(e) => update('status', e.target.value)}><option value="">All Status</option><option value="draft">Draft</option><option value="pending_review">Pending Review</option><option value="published">Published</option><option value="archived">Archived</option></select></>) });
  const { data, loading, error, reload } = useContentReport(filters);
  const cards = data ? [
    { label: 'Total Posts', value: data.summary.total, tone: 'neutral' },
    { label: 'Drafts', value: data.summary.drafts, tone: 'muted' },
    { label: 'Pending Review', value: data.summary.pending_review, tone: 'warning' },
    { label: 'Published', value: data.summary.published, tone: 'success' },
    { label: 'Archived', value: data.summary.archived, tone: 'danger' },
    { label: 'Featured Posts', value: data.summary.featured, tone: 'info' },
  ] : [];
  return <ReportPageLayout pageTitle="Content Report" pageSubtitle="Review editorial throughput, category spread, and publishing visibility." breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Reports' }, { label: 'Content Report' }]} cards={cards} filters={filters} setFilters={setFilters} search={search} setSearch={setSearch} data={data} loading={loading} error={error} onReload={reload} searchPlaceholder="Search posts" tableColumns={[{ key: 'post_no', label: 'Post No' }, { key: 'title', label: 'Title' }, { key: 'type', label: 'Type' }, { key: 'category', label: 'Category' }, { key: 'author', label: 'Author' }, { key: 'status', label: 'Status' }, { key: 'visibility', label: 'Visibility' }, { key: 'featured', label: 'Featured' }, { key: 'published_at', label: 'Published At' }]} />;
}
