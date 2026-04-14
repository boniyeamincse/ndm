import { useState } from 'react';
import { Download, Plus, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import PaginationBar from '../../../membership/shared/components/PaginationBar';
import { ErrorState } from '../../../membership/shared/components/PageStates';
import ContentSummaryCards from '../../shared/components/ContentSummaryCards';
import ContentFilterToolbar from '../../shared/components/ContentFilterToolbar';
import ContentEmptyState from '../../shared/components/ContentEmptyState';
import ContentSkeleton from '../../shared/components/ContentSkeleton';
import NoticeCard from '../components/NoticeCard';
import NoticeTable from '../components/NoticeTable';
import NoticeWorkflowModal from '../components/NoticeWorkflowModal';
import { useNoticeActions, useNotices } from '../hooks/useNotices';

const DEFAULT_FILTERS = {
  search: '',
  notice_type: '',
  priority: '',
  status: '',
  visibility: '',
  audience_type: '',
  committee_id: '',
  author_id: '',
  approver_id: '',
  pinned_only: '',
  requires_acknowledgement: '',
  active_only: '',
  sort_by: 'publish_at',
  sort_dir: 'desc',
  page: 1,
  per_page: 20,
};

export default function NoticesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [workflow, setWorkflow] = useState({ mode: '', notice: null });
  const { items, meta, summary, loading, error, reload } = useNotices(filters);
  const { run, busyAction, actionError } = useNoticeActions(() => {
    setWorkflow({ mode: '', notice: null });
    reload();
  });

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value, page: 1 }));
  }

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title="Notices"
          subtitle="Manage official notices, circulars, urgent announcements, and audience-targeted communication."
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Content' },
            { label: 'Notices' },
          ]}
          actions={(
            <>
              <button type="button" className="ndm-btn ndm-btn--ghost" onClick={reload}><RefreshCcw size={16} /> Refresh</button>
              <button type="button" className="ndm-btn ndm-btn--ghost"><Download size={16} /> Export</button>
              <button type="button" className="ndm-btn ndm-btn--primary" onClick={() => navigate('/admin/notices/create')}><Plus size={16} /> Create Notice</button>
            </>
          )}
        />

        <ContentSummaryCards cards={[
          { label: 'Total Notices', value: summary.total, tone: 'neutral' },
          { label: 'Draft Notices', value: summary.draft, tone: 'muted' },
          { label: 'Published Notices', value: summary.published, tone: 'success' },
          { label: 'Pinned Notices', value: summary.pinned, tone: 'info' },
          { label: 'Expired Notices', value: summary.expired, tone: 'danger' },
          { label: 'Urgent Notices', value: summary.urgent, tone: 'warning' },
        ]} />

        <PageSection>
          <ContentFilterToolbar
            search={search}
            onSearchChange={setSearch}
            onSubmit={(event) => { event.preventDefault(); setFilters((current) => ({ ...current, search, page: 1 })); }}
            onReset={() => { setSearch(''); setFilters(DEFAULT_FILTERS); }}
            searchPlaceholder="Search by title, slug, summary, or notice number"
          >
            <select className="ndm-input" value={filters.priority} onChange={(event) => updateFilter('priority', event.target.value)}>
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
              <option value="critical">Critical</option>
            </select>
            <select className="ndm-input" value={filters.status} onChange={(event) => updateFilter('status', event.target.value)}>
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending_review">Pending Review</option>
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
              <option value="archived">Archived</option>
            </select>
            <select className="ndm-input" value={filters.visibility} onChange={(event) => updateFilter('visibility', event.target.value)}>
              <option value="">All Visibility</option>
              <option value="public">Public</option>
              <option value="members_only">Members Only</option>
              <option value="internal">Internal</option>
            </select>
            <select className="ndm-input" value={filters.audience_type} onChange={(event) => updateFilter('audience_type', event.target.value)}>
              <option value="">All Audiences</option>
              <option value="all">All</option>
              <option value="committee_specific">Committee Specific</option>
              <option value="leadership_only">Leadership Only</option>
              <option value="members_only">Members Only</option>
              <option value="custom">Custom</option>
            </select>
            <label className="ndm-checkbox-row">
              <input type="checkbox" checked={Boolean(filters.pinned_only)} onChange={(event) => updateFilter('pinned_only', event.target.checked ? '1' : '')} />
              <span>Pinned only</span>
            </label>
            <label className="ndm-checkbox-row">
              <input type="checkbox" checked={Boolean(filters.requires_acknowledgement)} onChange={(event) => updateFilter('requires_acknowledgement', event.target.checked ? '1' : '')} />
              <span>Acknowledgement required</span>
            </label>
          </ContentFilterToolbar>

          {error ? <ErrorState message={error} onRetry={reload} /> : null}
          {actionError ? <ErrorState message={actionError} onRetry={reload} /> : null}
          {loading ? <ContentSkeleton rows={6} /> : null}
          {!loading && !error && items.length === 0 ? <ContentEmptyState message="No notices matched the current filters." action={{ label: 'Create Notice', onClick: () => navigate('/admin/notices/create') }} /> : null}

          {!loading && !error && items.length > 0 ? (
            <>
              <div className="cnt-desktop-only">
                <NoticeTable
                  items={items}
                  onView={(id) => navigate(`/admin/notices/${id}`)}
                  onEdit={(id) => navigate(`/admin/notices/${id}/edit`)}
                  onWorkflow={(mode, notice) => setWorkflow({ mode, notice })}
                  onManageAttachments={(notice) => navigate(`/admin/notices/${notice.id}`)}
                />
              </div>
              <div className="cnt-mobile-only cnt-mobile-grid">
                {items.map((item) => (
                  <NoticeCard
                    key={item.id}
                    item={item}
                    onView={(id) => navigate(`/admin/notices/${id}`)}
                    onEdit={(id) => navigate(`/admin/notices/${id}/edit`)}
                    onWorkflow={(mode, notice) => setWorkflow({ mode, notice })}
                    onManageAttachments={(notice) => navigate(`/admin/notices/${notice.id}`)}
                  />
                ))}
              </div>
              <PaginationBar meta={meta} page={filters.page} onPageChange={(page) => setFilters((current) => ({ ...current, page }))} />
            </>
          ) : null}
        </PageSection>
      </PageContainer>

      {workflow.notice ? (
        <NoticeWorkflowModal
          mode={workflow.mode}
          notice={workflow.notice}
          busy={Boolean(busyAction)}
          onClose={() => setWorkflow({ mode: '', notice: null })}
          onConfirm={(payload) => run(workflow.mode, workflow.notice.id, payload)}
        />
      ) : null}
    </AdminContentWrapper>
  );
}
