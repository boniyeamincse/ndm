import { useState } from 'react';
import { Plus, RefreshCcw } from 'lucide-react';
import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import { ErrorState } from '../../../membership/shared/components/PageStates';
import PaginationBar from '../../../membership/shared/components/PaginationBar';
import ContentSummaryCards from '../../shared/components/ContentSummaryCards';
import ContentFilterToolbar from '../../shared/components/ContentFilterToolbar';
import ContentTable from '../../shared/components/ContentTable';
import ContentEmptyState from '../../shared/components/ContentEmptyState';
import ContentSkeleton from '../../shared/components/ContentSkeleton';
import PostCategoryForm from '../components/PostCategoryForm';
import { usePostCategories, usePostCategoryActions } from '../hooks/usePostCategories';

export default function PostCategoriesPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ search: '', is_active: '', page: 1, per_page: 20 });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const { items, meta, summary, loading, error, reload } = usePostCategories(filters);
  const { run, busyAction, actionError } = usePostCategoryActions(() => {
    setFormOpen(false);
    setEditing(null);
    reload();
  });

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title="Post Categories"
          subtitle="Organize blog, news, and public content categories."
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Content' },
            { label: 'Post Categories' },
          ]}
          actions={(
            <>
              <button type="button" className="ndm-btn ndm-btn--ghost" onClick={reload}><RefreshCcw size={16} /> Refresh</button>
              <button type="button" className="ndm-btn ndm-btn--primary" onClick={() => setFormOpen(true)}><Plus size={16} /> Add Category</button>
            </>
          )}
        />

        <ContentSummaryCards cards={[
          { label: 'Total Categories', value: summary.total, tone: 'neutral' },
          { label: 'Active Categories', value: summary.active, tone: 'success' },
          { label: 'Inactive Categories', value: summary.inactive, tone: 'warning' },
        ]} />

        <PageSection>
          <ContentFilterToolbar
            search={search}
            onSearchChange={setSearch}
            onSubmit={(event) => { event.preventDefault(); setFilters((current) => ({ ...current, search, page: 1 })); }}
            onReset={() => { setSearch(''); setFilters({ search: '', is_active: '', page: 1, per_page: 20 }); }}
            searchPlaceholder="Search categories"
          >
            <select className="ndm-input" value={filters.is_active} onChange={(event) => setFilters((current) => ({ ...current, is_active: event.target.value, page: 1 }))}>
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </ContentFilterToolbar>

          {error ? <ErrorState message={error} onRetry={reload} /> : null}
          {actionError ? <ErrorState message={actionError} onRetry={reload} /> : null}
          {loading ? <ContentSkeleton rows={4} /> : null}
          {!loading && !error && items.length === 0 ? <ContentEmptyState message="No categories found." action={{ label: 'Add Category', onClick: () => setFormOpen(true) }} /> : null}

          {!loading && !error && items.length > 0 ? (
            <>
              <ContentTable
                testId="post-categories-table"
                columns={[
                  { key: 'name', label: 'Name' },
                  { key: 'slug', label: 'Slug' },
                  { key: 'description', label: 'Description' },
                  { key: 'color', label: 'Color' },
                  { key: 'status', label: 'Status' },
                  { key: 'created_at', label: 'Created At' },
                  { key: 'actions', label: 'Actions' },
                ]}
                rows={items}
                renderRow={(item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.slug}</td>
                    <td>{item.description || '—'}</td>
                    <td><span className="cnt-color-chip" style={{ backgroundColor: item.color }} /> {item.color}</td>
                    <td>{item.is_active ? <span className="cnt-pill cnt-pill--green">Active</span> : <span className="cnt-pill cnt-pill--slate">Inactive</span>}</td>
                    <td>{item.created_at?.slice(0, 10) || '—'}</td>
                    <td>
                      <div className="ndm-table__actions">
                        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => { setEditing(item); setFormOpen(true); }}>Edit</button>
                        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => run('toggle-status', item.id, { is_active: !item.is_active })}>{item.is_active ? 'Deactivate' : 'Activate'}</button>
                        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => run('delete', item.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                )}
              />
              <PaginationBar meta={meta} page={filters.page} onPageChange={(page) => setFilters((current) => ({ ...current, page }))} />
            </>
          ) : null}
        </PageSection>
      </PageContainer>

      {formOpen ? (
        <div className="ndm-modal__overlay" onClick={() => { setFormOpen(false); setEditing(null); }}>
          <div className="ndm-modal" onClick={(event) => event.stopPropagation()}>
            <h3>{editing ? 'Edit Category' : 'Create Category'}</h3>
            <PostCategoryForm
              initialValues={editing}
              busy={Boolean(busyAction)}
              onCancel={() => { setFormOpen(false); setEditing(null); }}
              onSubmit={(payload) => run(editing ? 'update' : 'create', editing?.id, payload)}
            />
          </div>
        </div>
      ) : null}
    </AdminContentWrapper>
  );
}
