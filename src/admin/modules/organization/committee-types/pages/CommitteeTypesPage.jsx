import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import PaginationBar from '../../../membership/shared/components/PaginationBar';
import { ErrorState } from '../../../membership/shared/components/PageStates';
import OrganizationSummaryCards from '../../shared/components/OrganizationSummaryCards';
import OrganizationFilterToolbar from '../../shared/components/OrganizationFilterToolbar';
import OrganizationTable from '../../shared/components/OrganizationTable';
import OrganizationSkeleton from '../../shared/components/OrganizationSkeleton';
import OrganizationEmptyState from '../../shared/components/OrganizationEmptyState';
import CommitteeTypeForm from '../components/CommitteeTypeForm';
import { useCommitteeTypeActions, useCommitteeTypes } from '../hooks/useCommitteeTypes';

export default function CommitteeTypesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ search: '', is_active: '', sort_by: 'hierarchy_order', sort_dir: 'asc', page: 1, per_page: 20 });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const { items, meta, summary, loading, error, reload } = useCommitteeTypes(filters);
  const { run, busyAction, actionError } = useCommitteeTypeActions(() => { setFormOpen(false); setEditing(null); reload(); });

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title="Committee Types"
          subtitle="Manage committee level definitions and hierarchy order."
          breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Organization' }, { label: 'Committee Types' }]}
          actions={<button type="button" className="ndm-btn ndm-btn--primary" onClick={() => setFormOpen(true)}><Plus size={16} /> Add Type</button>}
        />

        <OrganizationSummaryCards cards={[
          { label: 'Total Types', value: summary.total, tone: 'neutral' },
          { label: 'Active Types', value: summary.active, tone: 'success' },
          { label: 'Inactive Types', value: summary.inactive, tone: 'warning' },
        ]} />

        <PageSection>
          <OrganizationFilterToolbar
            search={search}
            onSearchChange={setSearch}
            onSubmit={(event) => { event.preventDefault(); setFilters((current) => ({ ...current, search, page: 1 })); }}
            onReset={() => { setSearch(''); setFilters({ search: '', is_active: '', sort_by: 'hierarchy_order', sort_dir: 'asc', page: 1, per_page: 20 }); }}
            searchPlaceholder="Search committee types"
          >
            <select className="ndm-input" value={filters.is_active} onChange={(event) => setFilters((current) => ({ ...current, is_active: event.target.value, page: 1 }))}>
              <option value="">All Status</option>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </OrganizationFilterToolbar>

          {error ? <ErrorState message={error} onRetry={reload} /> : null}
          {actionError ? <ErrorState message={actionError} onRetry={reload} /> : null}
          {loading ? <OrganizationSkeleton rows={6} /> : null}
          {!loading && !error && items.length === 0 ? <OrganizationEmptyState title="No committee types found" subtitle="Create a type to define organization levels." /> : null}

          {!loading && !error && items.length > 0 ? (
            <>
              <OrganizationTable
                columns={[
                  { key: 'name', label: 'Name' },
                  { key: 'slug', label: 'Slug' },
                  { key: 'code', label: 'Code' },
                  { key: 'hierarchy_order', label: 'Hierarchy Order' },
                  { key: 'description', label: 'Description' },
                  { key: 'status', label: 'Status' },
                  { key: 'actions', label: 'Actions' },
                ]}
                rows={items}
                testId="committee-types-table"
                renderRow={(item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.slug}</td>
                    <td>{item.code}</td>
                    <td>{item.hierarchy_order}</td>
                    <td>{item.description || '—'}</td>
                    <td>{item.is_active ? <span className="org-pill org-pill--green">Active</span> : <span className="org-pill org-pill--slate">Inactive</span>}</td>
                    <td>
                      <div className="ndm-table__actions">
                        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => navigate(`/admin/committee-types/${item.id}`)}>View</button>
                        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => { setEditing(item); setFormOpen(true); }}>Edit</button>
                        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => run(item.deleted_at ? 'restore' : 'delete', item.id)}>{item.deleted_at ? 'Restore' : 'Delete'}</button>
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
            <h3>{editing ? 'Edit Committee Type' : 'Create Committee Type'}</h3>
            <CommitteeTypeForm
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
