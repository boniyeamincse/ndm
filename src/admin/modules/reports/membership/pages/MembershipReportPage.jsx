import { useState } from 'react';
import ReportPageLayout from '../../shared/components/ReportPageLayout';
import { useMembershipReport } from '../../shared/hooks/useReports';

export default function MembershipReportPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ search: '', status: '', division: '', district: '', source: '', reviewer: '', approved_by: '', start_date: '', end_date: '', page: 1, per_page: 20, renderControls: (update) => (<><select className="ndm-input" value={filters.status} onChange={(e) => update('status', e.target.value)}><option value="">All Status</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="on_hold">On Hold</option></select><input className="ndm-input" value={filters.division} onChange={(e) => update('division', e.target.value)} placeholder="Division" /><input className="ndm-input" value={filters.reviewer} onChange={(e) => update('reviewer', e.target.value)} placeholder="Reviewer" /></>) });
  const { data, loading, error, reload } = useMembershipReport(filters);
  const cards = data ? [
    { label: 'Total Applications', value: data.summary.total, tone: 'neutral' },
    { label: 'Pending', value: data.summary.pending, tone: 'warning' },
    { label: 'Approved', value: data.summary.approved, tone: 'success' },
    { label: 'Rejected', value: data.summary.rejected, tone: 'danger' },
    { label: 'On Hold', value: data.summary.on_hold, tone: 'muted' },
    { label: 'Approval Rate', value: data.summary.approval_rate, tone: 'info' },
  ] : [];
  return <ReportPageLayout pageTitle="Membership Report" pageSubtitle="Monitor application status, reviewer throughput, and location trends." breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Reports' }, { label: 'Membership Report' }]} cards={cards} filters={filters} setFilters={setFilters} search={search} setSearch={setSearch} data={data} loading={loading} error={error} onReload={reload} searchPlaceholder="Search applications" tableColumns={[{ key: 'application_no', label: 'Application No' }, { key: 'applicant', label: 'Applicant' }, { key: 'contact', label: 'Contact' }, { key: 'location', label: 'Location' }, { key: 'status', label: 'Status' }, { key: 'submitted_at', label: 'Submitted At' }, { key: 'reviewed_by', label: 'Reviewed By' }, { key: 'decision_at', label: 'Approved/Rejected At' }]} />;
}
