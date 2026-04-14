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
import HierarchyRelationTypeBadge from '../../shared/components/HierarchyRelationTypeBadge';
import { useReportingRelations } from '../hooks/useReportingHierarchy';

export default function ReportingHierarchyPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ search: '', committee_id: '', committee_type_id: '', relation_type: '', primary_only: '', active_only: '', from: '', to: '', sort_by: 'start_date', sort_dir: 'desc', page: 1, per_page: 20 });
  const { items, meta, summary, loading, error, reload } = useReportingRelations(filters);

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title="Reporting Hierarchy"
          subtitle="Manage superior-subordinate relationships and committee reporting structure."
          breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Organization' }, { label: 'Reporting Hierarchy' }]}
          actions={<button type="button" className="ndm-btn ndm-btn--primary" onClick={() => navigate('/admin/reporting-hierarchy/create')}><Plus size={16} /> Create Relation</button>}
        />
        <OrganizationSummaryCards cards={[
          { label: 'Total Relations', value: summary.total, tone: 'neutral' },
          { label: 'Active Relations', value: summary.active, tone: 'success' },
          { label: 'Primary Relations', value: summary.primary, tone: 'info' },
          { label: 'Direct Reports', value: summary.direct, tone: 'danger' },
          { label: 'Functional Reports', value: summary.functional, tone: 'warning' },
          { label: 'Advisory Reports', value: summary.advisory, tone: 'muted' },
        ]} />

        <PageSection>
          <OrganizationFilterToolbar
            search={search}
            onSearchChange={setSearch}
            onSubmit={(event) => { event.preventDefault(); setFilters((current) => ({ ...current, search, page: 1 })); }}
            onReset={() => { setSearch(''); setFilters({ search: '', committee_id: '', committee_type_id: '', relation_type: '', primary_only: '', active_only: '', from: '', to: '', sort_by: 'start_date', sort_dir: 'desc', page: 1, per_page: 20 }); }}
            searchPlaceholder="Search relation no, subordinate, superior or committee"
          >
            <select className="ndm-input" value={filters.relation_type} onChange={(event) => setFilters((current) => ({ ...current, relation_type: event.target.value, page: 1 }))}><option value="">All Relation Types</option><option value="direct">Direct</option><option value="functional">Functional</option><option value="advisory">Advisory</option></select>
            <select className="ndm-input" value={filters.primary_only} onChange={(event) => setFilters((current) => ({ ...current, primary_only: event.target.value, page: 1 }))}><option value="">Primary Any</option><option value="1">Primary Only</option></select>
            <select className="ndm-input" value={filters.active_only} onChange={(event) => setFilters((current) => ({ ...current, active_only: event.target.value, page: 1 }))}><option value="">Active Any</option><option value="1">Active Only</option></select>
          </OrganizationFilterToolbar>

          {error ? <ErrorState message={error} onRetry={reload} /> : null}
          {loading ? <OrganizationSkeleton rows={8} /> : null}
          {!loading && !error && items.length === 0 ? <OrganizationEmptyState title="No reporting relations found" subtitle="Create a reporting relation to define hierarchy." /> : null}
          {!loading && !error && items.length > 0 ? (
            <>
              <OrganizationTable
                columns={[
                  { key: 'relation_no', label: 'Relation No' },
                  { key: 'subordinate', label: 'Subordinate' },
                  { key: 'superior', label: 'Superior' },
                  { key: 'committee', label: 'Committee' },
                  { key: 'relation_type', label: 'Relation Type' },
                  { key: 'primary', label: 'Primary' },
                  { key: 'active', label: 'Active' },
                  { key: 'dates', label: 'Dates' },
                  { key: 'actions', label: 'Actions' },
                ]}
                rows={items}
                testId="reporting-relations-table"
                renderRow={(item) => (
                  <tr key={item.id}>
                    <td className="ndm-table__mono">{item.relation_no}</td>
                    <td>{item.subordinate_name}</td>
                    <td>{item.superior_name}</td>
                    <td>{item.committee_name}</td>
                    <td><HierarchyRelationTypeBadge value={item.relation_type} /></td>
                    <td>{item.is_primary ? <span className="org-pill org-pill--green">Primary</span> : '—'}</td>
                    <td>{item.is_active ? <span className="org-pill org-pill--green">Active</span> : <span className="org-pill org-pill--slate">Inactive</span>}</td>
                    <td>{item.start_date || '—'} - {item.end_date || 'Present'}</td>
                    <td><button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => navigate(`/admin/reporting-hierarchy/${item.id}`)}>View</button></td>
                  </tr>
                )}
              />
              <PaginationBar meta={meta} page={filters.page} onPageChange={(page) => setFilters((current) => ({ ...current, page }))} />
            </>
          ) : null}
        </PageSection>
      </PageContainer>
    </AdminContentWrapper>
  );
}
