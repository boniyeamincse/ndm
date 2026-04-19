import { useState } from 'react';
import { Plus, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import FilterToolbar from '../../../membership/shared/components/FilterToolbar';
import SummaryStatCard from '../../../membership/shared/components/SummaryStatCard';
import PaginationBar from '../../../membership/shared/components/PaginationBar';
import { EmptyState, ErrorState, LoadingSkeleton } from '../../../membership/shared/components/PageStates';
import { useRoleActions, useRoles } from '../hooks/useRoles';
import RolesTable from '../components/RolesTable';
import RoleFormModal from '../components/RoleFormModal';

const DEFAULT_FILTERS = {
  search: '',
  sort_by: 'created_at',
  sort_order: 'desc',
  page: 1,
  per_page: 20,
};

export default function RolesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [modal, setModal] = useState({ open: false, mode: 'create', role: null });
  const [assignRole, setAssignRole] = useState(null);

  const { items, meta, summary, loading, error, reload } = useRoles(filters);
  const { run, busyAction, actionError } = useRoleActions(() => {
    setModal({ open: false, mode: 'create', role: null });
    setAssignRole(null);
    reload();
  });

  function applyFilters(event) {
    event.preventDefault();
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  }

  function resetFilters() {
    setSearch('');
    setFilters(DEFAULT_FILTERS);
  }

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title="Roles"
          subtitle="Create and manage system roles and permission access."
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'System' },
            { label: 'Roles' },
          ]}
          actions={(
            <>
              <button type="button" className="ndm-btn ndm-btn--ghost" onClick={reload}><RefreshCcw size={16} /> Refresh</button>
              <button type="button" className="ndm-btn ndm-btn--primary" onClick={() => setModal({ open: true, mode: 'create', role: null })}><Plus size={16} /> Create Role</button>
            </>
          )}
        />

        <section className="ndm-summary-grid">
          <SummaryStatCard title="Total Roles" value={summary.total || 0} tone="neutral" />
          <SummaryStatCard title="System Roles" value={summary.system || 0} tone="info" />
          <SummaryStatCard title="Custom Roles" value={summary.custom || 0} tone="success" />
          <SummaryStatCard title="Roles In Use" value={summary.in_use || 0} tone="warning" />
        </section>

        <PageSection>
          <FilterToolbar
            search={search}
            onSearchChange={setSearch}
            onSubmit={applyFilters}
            onReset={resetFilters}
            searchPlaceholder="Search by role name"
          >
            <select className="ndm-input" value={filters.sort_by} onChange={(event) => setFilters((prev) => ({ ...prev, sort_by: event.target.value }))}>
              <option value="created_at">Sort by Latest</option>
              <option value="name">Sort by Name</option>
            </select>
            <select className="ndm-input" value={filters.sort_order} onChange={(event) => setFilters((prev) => ({ ...prev, sort_order: event.target.value }))}>
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </FilterToolbar>

          {error ? <ErrorState message={error} onRetry={reload} /> : null}
          {actionError ? <ErrorState message={actionError} onRetry={reload} /> : null}
          {loading ? <LoadingSkeleton rows={8} /> : null}
          {!loading && !error && items.length === 0 ? <EmptyState title="No roles found" subtitle="Create your first custom role to start managing access." /> : null}

          {!loading && !error && items.length > 0 ? (
            <>
              <RolesTable
                items={items}
                onView={(id) => navigate(`/admin/roles/${id}`)}
                onEdit={(role) => setModal({ open: true, mode: 'edit', role })}
                onAssignPermissions={(role) => setAssignRole(role)}
                onDelete={(role) => run('delete', { id: role.id })}
              />
              <PaginationBar meta={meta} page={filters.page} onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))} />
            </>
          ) : null}
        </PageSection>

        <RoleFormModal
          open={modal.open}
          mode={modal.mode}
          role={modal.role}
          busy={busyAction === 'create' || busyAction === 'update'}
          onClose={() => setModal({ open: false, mode: 'create', role: null })}
          onSubmit={(payload) => {
            if (modal.mode === 'edit') {
              run('update', { ...payload, id: modal.role.id });
              run('sync_permissions', { id: modal.role.id, permissions: payload.permissions || [] });
              return;
            }
            run('create', payload);
          }}
        />

        <RoleFormModal
          open={Boolean(assignRole)}
          mode="edit"
          role={assignRole}
          busy={busyAction === 'sync_permissions'}
          onClose={() => setAssignRole(null)}
          onSubmit={(payload) => run('sync_permissions', { id: assignRole.id, permissions: payload.permissions || [] })}
        />
      </PageContainer>
    </AdminContentWrapper>
  );
}
