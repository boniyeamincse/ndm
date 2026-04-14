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
import PostCard from '../components/PostCard';
import PostTable from '../components/PostTable';
import PostWorkflowModal from '../components/PostWorkflowModal';
import { usePostActions, usePosts } from '../hooks/usePosts';

const DEFAULT_FILTERS = {
  search: '',
  content_type: '',
  post_category_id: '',
  committee_id: '',
  author_id: '',
  editor_id: '',
  status: '',
  visibility: '',
  featured_only: '',
  homepage_only: '',
  sort_by: 'published_at',
  sort_dir: 'desc',
  page: 1,
  per_page: 20,
};

export default function PostsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [workflow, setWorkflow] = useState({ mode: '', post: null });
  const { items, meta, summary, loading, error, reload } = usePosts(filters);
  const { run, busyAction, actionError } = usePostActions(() => {
    setWorkflow({ mode: '', post: null });
    reload();
  });

  const cards = [
    { label: 'Total Posts', value: summary.total, tone: 'neutral' },
    { label: 'Draft Posts', value: summary.draft, tone: 'muted' },
    { label: 'Pending Review', value: summary.pending_review, tone: 'warning' },
    { label: 'Published Posts', value: summary.published, tone: 'success' },
    { label: 'Archived Posts', value: summary.archived, tone: 'danger' },
    { label: 'Featured Posts', value: summary.featured, tone: 'info' },
  ];

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value, page: 1 }));
  }

  function resetFilters() {
    setSearch('');
    setFilters(DEFAULT_FILTERS);
  }

  function openWorkflow(mode, post) {
    setWorkflow({ mode, post });
  }

  function handleWorkflowConfirm(payload) {
    const { mode, post } = workflow;
    if (!post) return;
    run(mode, post.id, payload);
  }

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title="Blog / News"
          subtitle="Manage organizational posts, news updates, statements, and publishing workflow."
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Content' },
            { label: 'Blog & News' },
          ]}
          actions={(
            <>
              <button type="button" className="ndm-btn ndm-btn--ghost" onClick={reload}><RefreshCcw size={16} /> Refresh</button>
              <button type="button" className="ndm-btn ndm-btn--ghost"><Download size={16} /> Export</button>
              <button type="button" className="ndm-btn ndm-btn--primary" onClick={() => navigate('/admin/posts/create')}><Plus size={16} /> Create Post</button>
            </>
          )}
        />

        <ContentSummaryCards cards={cards} />

        <PageSection>
          <ContentFilterToolbar
            search={search}
            onSearchChange={setSearch}
            onSubmit={(event) => {
              event.preventDefault();
              setFilters((current) => ({ ...current, search, page: 1 }));
            }}
            onReset={resetFilters}
            searchPlaceholder="Search by title, slug, excerpt, or post number"
          >
            <select className="ndm-input" value={filters.content_type} onChange={(event) => updateFilter('content_type', event.target.value)}>
              <option value="">All Types</option>
              <option value="news">News</option>
              <option value="blog">Blog</option>
              <option value="press">Press</option>
              <option value="statement">Statement</option>
              <option value="update">Update</option>
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
            <label className="ndm-checkbox-row">
              <input type="checkbox" checked={Boolean(filters.featured_only)} onChange={(event) => updateFilter('featured_only', event.target.checked ? '1' : '')} />
              <span>Featured only</span>
            </label>
            <label className="ndm-checkbox-row">
              <input type="checkbox" checked={Boolean(filters.homepage_only)} onChange={(event) => updateFilter('homepage_only', event.target.checked ? '1' : '')} />
              <span>Homepage only</span>
            </label>
          </ContentFilterToolbar>

          {error ? <ErrorState message={error} onRetry={reload} /> : null}
          {actionError ? <ErrorState message={actionError} onRetry={reload} /> : null}
          {loading ? <ContentSkeleton rows={6} /> : null}
          {!loading && !error && items.length === 0 ? (
            <ContentEmptyState
              message="No posts matched the current filters."
              action={{ label: 'Create Post', onClick: () => navigate('/admin/posts/create') }}
            />
          ) : null}

          {!loading && !error && items.length > 0 ? (
            <>
              <div className="cnt-desktop-only">
                <PostTable
                  items={items}
                  onView={(id) => navigate(`/admin/posts/${id}`)}
                  onEdit={(id) => navigate(`/admin/posts/${id}/edit`)}
                  onWorkflow={openWorkflow}
                />
              </div>
              <div className="cnt-mobile-only cnt-mobile-grid">
                {items.map((item) => (
                  <PostCard
                    key={item.id}
                    item={item}
                    onView={(id) => navigate(`/admin/posts/${id}`)}
                    onEdit={(id) => navigate(`/admin/posts/${id}/edit`)}
                    onWorkflow={openWorkflow}
                  />
                ))}
              </div>
              <PaginationBar meta={meta} page={filters.page} onPageChange={(page) => setFilters((current) => ({ ...current, page }))} />
            </>
          ) : null}
        </PageSection>
      </PageContainer>

      {workflow.post ? (
        <PostWorkflowModal
          mode={workflow.mode}
          post={workflow.post}
          busy={Boolean(busyAction)}
          onClose={() => setWorkflow({ mode: '', post: null })}
          onConfirm={handleWorkflowConfirm}
        />
      ) : null}
    </AdminContentWrapper>
  );
}
