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
import AssignmentStatusBadge from '../../shared/components/AssignmentStatusBadge';
import AssignmentTypeBadge from '../../shared/components/AssignmentTypeBadge';
import { useCommitteeAssignmentActions, useCommitteeAssignments } from '../hooks/useCommitteeAssignments';
import TransferAssignmentModal from '../components/TransferAssignmentModal';

export default function CommitteeAssignmentsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ search: '', member_id: '', committee_id: '', committee_type_id: '', position_id: '', assignment_type: '', status: '', active_only: '', primary_only: '', leadership_only: '', from: '', to: '', sort_by: 'start_date', sort_dir: 'desc', page: 1, per_page: 20 });
  const [transferTarget, setTransferTarget] = useState(null);
  const { items, meta, summary, loading, error, reload } = useCommitteeAssignments(filters);
  const { run, busyAction, actionError } = useCommitteeAssignmentActions(() => { setTransferTarget(null); reload(); });

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title="Committee Assignments"
          subtitle="Manage member placement, positions, and office bearer roles inside committees."
          breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Organization' }, { label: 'Committee Assignments' }]}
          actions={<button type="button" className="ndm-btn ndm-btn--primary" onClick={() => navigate('/admin/committee-assignments/create')}><Plus size={16} /> Create Assignment</button>}
        />
        <OrganizationSummaryCards cards={[
          { label: 'Total Assignments', value: summary.total, tone: 'neutral' },
          { label: 'Active Assignments', value: summary.active, tone: 'success' },
          { label: 'Inactive Assignments', value: summary.inactive, tone: 'warning' },
          { label: 'Completed Assignments', value: summary.completed, tone: 'muted' },
          { label: 'Office Bearers', value: summary.office_bearers, tone: 'info' },
          { label: 'Leadership Assignments', value: summary.leadership, tone: 'danger' },
        ]} />

        <PageSection>
          <OrganizationFilterToolbar
            search={search}
            onSearchChange={setSearch}
            onSubmit={(event) => { event.preventDefault(); setFilters((current) => ({ ...current, search, page: 1 })); }}
            onReset={() => { setSearch(''); setFilters({ search: '', member_id: '', committee_id: '', committee_type_id: '', position_id: '', assignment_type: '', status: '', active_only: '', primary_only: '', leadership_only: '', from: '', to: '', sort_by: 'start_date', sort_dir: 'desc', page: 1, per_page: 20 }); }}
            searchPlaceholder="Search assignment no, member, committee or position"
          >
            <select className="ndm-input" value={filters.assignment_type} onChange={(event) => setFilters((current) => ({ ...current, assignment_type: event.target.value, page: 1 }))}><option value="">All Types</option><option value="office_bearer">Office Bearer</option><option value="general_member">General Member</option></select>
            <select className="ndm-input" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value, page: 1 }))}><option value="">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option><option value="completed">Completed</option></select>
            <select className="ndm-input" value={filters.primary_only} onChange={(event) => setFilters((current) => ({ ...current, primary_only: event.target.value, page: 1 }))}><option value="">Primary Any</option><option value="1">Primary Only</option></select>
            <select className="ndm-input" value={filters.leadership_only} onChange={(event) => setFilters((current) => ({ ...current, leadership_only: event.target.value, page: 1 }))}><option value="">Leadership Any</option><option value="1">Leadership Only</option></select>
          </OrganizationFilterToolbar>

          {error ? <ErrorState message={error} onRetry={reload} /> : null}
          {actionError ? <ErrorState message={actionError} onRetry={reload} /> : null}
          {loading ? <OrganizationSkeleton rows={8} /> : null}
          {!loading && !error && items.length === 0 ? <OrganizationEmptyState title="No assignments found" subtitle="Refine filters or create a new assignment." /> : null}

          {!loading && !error && items.length > 0 ? (
            <>
              <OrganizationTable
                columns={[
                  { key: 'assignment_no', label: 'Assignment No' },
                  { key: 'member', label: 'Member' },
                  { key: 'committee', label: 'Committee' },
                  { key: 'position', label: 'Position' },
                  { key: 'assignment_type', label: 'Assignment Type' },
                  { key: 'primary', label: 'Primary' },
                  { key: 'leadership', label: 'Leadership' },
                  { key: 'status', label: 'Status' },
                  { key: 'dates', label: 'Dates' },
                  { key: 'actions', label: 'Actions' },
                ]}
                rows={items}
                testId="committee-assignments-table"
                renderRow={(item) => (
                  <tr key={item.id}>
                    <td className="ndm-table__mono">{item.assignment_no}</td>
                    <td>{item.member_name}</td>
                    <td>{item.committee_name}</td>
                    <td>{item.position_name}</td>
                    <td><AssignmentTypeBadge value={item.assignment_type} /></td>
                    <td>{item.is_primary ? <span className="org-pill org-pill--green">Primary</span> : '—'}</td>
                    <td>{item.is_leadership ? <span className="org-pill org-pill--red">Leadership</span> : '—'}</td>
                    <td><AssignmentStatusBadge value={item.status || (item.is_active ? 'active' : 'inactive')} /></td>
                    <td>{item.start_date || '—'} - {item.end_date || 'Present'}</td>
                    <td>
                      <div className="ndm-table__actions">
                        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => navigate(`/admin/committee-assignments/${item.id}`)}>View</button>
                        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => navigate(`/admin/committee-assignments/${item.id}/edit`)}>Edit</button>
                        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => setTransferTarget(item)}>Transfer</button>
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

      <TransferAssignmentModal assignment={transferTarget} busy={busyAction === 'transfer'} onClose={() => setTransferTarget(null)} onSubmit={(payload) => run('transfer', transferTarget.id, payload)} />
    </AdminContentWrapper>
  );
}
