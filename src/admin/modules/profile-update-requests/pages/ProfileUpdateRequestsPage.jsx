import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminPageHeader from '../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../components/AdminContentWrapper';
import PaginationBar from '../../membership/shared/components/PaginationBar';
import { ErrorState } from '../../membership/shared/components/PageStates';
import ContentSummaryCards from '../../content/shared/components/ContentSummaryCards';
import ContentFilterToolbar from '../../content/shared/components/ContentFilterToolbar';
import ContentEmptyState from '../../content/shared/components/ContentEmptyState';
import ContentSkeleton from '../../content/shared/components/ContentSkeleton';
import ApproveProfileRequestModal from '../components/ApproveProfileRequestModal';
import ProfileUpdateRequestCard from '../components/ProfileUpdateRequestCard';
import ProfileUpdateRequestsTable from '../components/ProfileUpdateRequestsTable';
import RejectProfileRequestModal from '../components/RejectProfileRequestModal';
import { useProfileUpdateRequestActions, useProfileUpdateRequests } from '../hooks/useProfileUpdateRequests';
import { PROFILE_REQUEST_ROUTE_CONFIG } from '../types/profileUpdateRequestTypes';

export default function ProfileUpdateRequestsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const routeConfig = PROFILE_REQUEST_ROUTE_CONFIG[location.pathname] || PROFILE_REQUEST_ROUTE_CONFIG['/admin/profile-update-requests'];
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ search: '', request_type: '', status: routeConfig.status, reviewer: '', start_date: '', end_date: '', sort: 'submitted_at:desc', page: 1, per_page: 20 });
  const [modal, setModal] = useState({ action: '', item: null });
  const { items, meta, summary, loading, error, reload } = useProfileUpdateRequests(filters);
  const { run, busyAction, actionError } = useProfileUpdateRequestActions(() => { setModal({ action: '', item: null }); reload(); });

  const cards = useMemo(() => ([
    { label: 'Total Requests', value: summary.total, tone: 'neutral' },
    { label: 'Pending', value: summary.pending, tone: 'warning' },
    { label: 'Approved', value: summary.approved, tone: 'success' },
    { label: 'Rejected', value: summary.rejected, tone: 'danger' },
    { label: 'Cancelled', value: summary.cancelled, tone: 'muted' },
    { label: 'Recent Requests', value: summary.recent, tone: 'info' },
  ]), [summary]);

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title={routeConfig.title}
          subtitle={routeConfig.subtitle}
          breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Requests' }, { label: 'Profile Update Requests' }]}
        />
        <ContentSummaryCards cards={cards} />
        <PageSection>
          <ContentFilterToolbar
            search={search}
            onSearchChange={setSearch}
            onSubmit={(event) => { event.preventDefault(); setFilters((current) => ({ ...current, search, page: 1 })); }}
            onReset={() => { setSearch(''); setFilters({ search: '', request_type: '', status: routeConfig.status, reviewer: '', start_date: '', end_date: '', sort: 'submitted_at:desc', page: 1, per_page: 20 }); }}
            searchPlaceholder="Search by request no, user name, or member no"
          >
            <select className="ndm-input" value={filters.request_type} onChange={(event) => setFilters((current) => ({ ...current, request_type: event.target.value, page: 1 }))}>
              <option value="">All Request Types</option>
              <option value="profile_correction">Profile Correction</option>
              <option value="identity_update">Identity Update</option>
              <option value="committee_affiliation">Committee Affiliation</option>
              <option value="contact_update">Contact Update</option>
            </select>
            <select className="ndm-input" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value, page: 1 }))}>
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <input className="ndm-input" value={filters.reviewer} onChange={(event) => setFilters((current) => ({ ...current, reviewer: event.target.value, page: 1 }))} placeholder="Reviewer" />
          </ContentFilterToolbar>

          {error ? <ErrorState message={error} onRetry={reload} /> : null}
          {actionError ? <ErrorState message={actionError} onRetry={reload} /> : null}
          {loading ? <ContentSkeleton rows={6} /> : null}
          {!loading && !error && items.length === 0 ? <ContentEmptyState message="No profile update requests matched the current filters." /> : null}

          {!loading && !error && items.length > 0 ? (
            <>
              <div className="cnt-desktop-only">
                <ProfileUpdateRequestsTable items={items} onView={(id) => navigate(`/admin/profile-update-requests/${id}`)} onAction={(action, item) => setModal({ action, item })} />
              </div>
              <div className="cnt-mobile-only cnt-mobile-grid">
                {items.map((item) => <ProfileUpdateRequestCard key={item.id} item={item} onView={(id) => navigate(`/admin/profile-update-requests/${id}`)} onAction={(action, entry) => setModal({ action, item: entry })} />)}
              </div>
              <PaginationBar meta={meta} page={filters.page} onPageChange={(page) => setFilters((current) => ({ ...current, page }))} />
            </>
          ) : null}
        </PageSection>
      </PageContainer>

      <ApproveProfileRequestModal open={modal.action === 'approve'} request={modal.item} busy={Boolean(busyAction)} onClose={() => setModal({ action: '', item: null })} onSubmit={(payload) => run('approve', modal.item.id, payload)} />
      <RejectProfileRequestModal open={modal.action === 'reject'} request={modal.item} busy={Boolean(busyAction)} onClose={() => setModal({ action: '', item: null })} onSubmit={(payload) => run('reject', modal.item.id, payload)} />
    </AdminContentWrapper>
  );
}
