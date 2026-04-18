import { useEffect, useState } from 'react';
import { RefreshCcw, Plus, GitBranch } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import PaginationBar from '../../../membership/shared/components/PaginationBar';
import { ErrorState } from '../../../membership/shared/components/PageStates';
import OrganizationSummaryCards from '../../shared/components/OrganizationSummaryCards';
import OrganizationFilterToolbar from '../../shared/components/OrganizationFilterToolbar';
import OrganizationEmptyState from '../../shared/components/OrganizationEmptyState';
import OrganizationSkeleton from '../../shared/components/OrganizationSkeleton';
import CommitteeTable from '../components/CommitteeTable';
import CommitteeCard from '../components/CommitteeCard';
import CommitteeStatusModal from '../components/CommitteeStatusModal';
import { useCommitteeActions, useCommittees } from '../hooks/useCommittees';
import { committeeTypesService } from '../../committee-types/services/committeeTypesService';
import { BD_GEO } from '../../../../../data/bd-geo';

export default function CommitteesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    committee_type_id: '',
    status: '',
    is_current: '',
    division_id: '',
    district_id: '',
    upazila_id: '',
    union_id: '',
    parent_id: '',
    sort_by: 'start_date',
    sort_dir: 'desc',
    page: 1,
    per_page: 20,
  });
  const [committeeTypeOptions, setCommitteeTypeOptions] = useState([]);
  const [statusTarget, setStatusTarget] = useState(null);

  const { items, meta, summary, loading, error, reload } = useCommittees(filters);
  const { run, busyAction, actionError } = useCommitteeActions(() => {
    setStatusTarget(null);
    reload();
  });

  const cards = [
    { label: 'Total Committees', value: summary.total, tone: 'neutral' },
    { label: 'Active Committees', value: summary.active, tone: 'success' },
    { label: 'Inactive Committees', value: summary.inactive, tone: 'warning' },
    { label: 'Dissolved Committees', value: summary.dissolved, tone: 'danger' },
    { label: 'Archived Committees', value: summary.archived, tone: 'muted' },
    { label: 'Current Committees', value: summary.current, tone: 'info' },
  ];

  useEffect(() => {
    let alive = true;

    async function loadCommitteeTypes() {
      try {
        const res = await committeeTypesService.list({ per_page: 100, sort_by: 'hierarchy_order', sort_dir: 'asc' });
        if (alive) {
          setCommitteeTypeOptions(res.items || []);
        }
      } catch {
        if (alive) {
          setCommitteeTypeOptions([]);
        }
      }
    }

    loadCommitteeTypes();
    return () => {
      alive = false;
    };
  }, []);

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value, page: 1 }));
  }

  function submitFilters(event) {
    event.preventDefault();
    setFilters((current) => ({ ...current, search, page: 1 }));
  }

  function resetFilters() {
    setSearch('');
    setFilters({
      search: '',
      committee_type_id: '',
      status: '',
      is_current: '',
      division_id: '',
      district_id: '',
      upazila_id: '',
      union_id: '',
      parent_id: '',
      sort_by: 'start_date',
      sort_dir: 'desc',
      page: 1,
      per_page: 20,
    });
  }

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title="Committees"
          subtitle="Manage the full organization committee structure from central to union level."
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Organization' },
            { label: 'Committees' },
          ]}
          actions={(
            <>
              <button type="button" className="ndm-btn ndm-btn--primary" onClick={() => navigate('/admin/committees/create')}><Plus size={16} /> Add Committee</button>
              <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => navigate('/admin/committees-tree')}><GitBranch size={16} /> View Tree</button>
              <button type="button" className="ndm-btn ndm-btn--ghost" onClick={reload}><RefreshCcw size={16} /> Refresh</button>
            </>
          )}
        />

        <OrganizationSummaryCards cards={cards} />

        <PageSection>
          <OrganizationFilterToolbar
            search={search}
            onSearchChange={setSearch}
            onSubmit={submitFilters}
            onReset={resetFilters}
            searchPlaceholder="Search by committee no, name or code"
          >
            <select className="ndm-input" value={filters.committee_type_id} onChange={(event) => updateFilter('committee_type_id', event.target.value)}>
              <option value="">All Committee Types</option>
              {committeeTypeOptions.map((type) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            <select className="ndm-input" value={filters.status} onChange={(event) => updateFilter('status', event.target.value)}>
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="dissolved">Dissolved</option>
              <option value="archived">Archived</option>
            </select>
            <select className="ndm-input" value={filters.is_current} onChange={(event) => updateFilter('is_current', event.target.value)}>
              <option value="">Any Term</option>
              <option value="1">Current</option>
              <option value="0">Past</option>
            </select>
            <select className="ndm-input" value={filters.division_id} onChange={(event) => updateFilter('division_id', event.target.value)}>
              <option value="">All Divisions</option>
              {BD_GEO.map((division) => (
                <option key={division.id} value={division.id}>{division.name}</option>
              ))}
            </select>
          </OrganizationFilterToolbar>

          {error ? <ErrorState message={error} onRetry={reload} /> : null}
          {actionError ? <ErrorState message={actionError} onRetry={reload} /> : null}
          {loading ? <OrganizationSkeleton rows={8} /> : null}

          {!loading && !error && items.length === 0 ? <OrganizationEmptyState title="No committees found" subtitle="Adjust the filters or create a new committee." /> : null}

          {!loading && !error && items.length > 0 ? (
            <>
              <div className="ndm-desktop-only">
                <CommitteeTable
                  items={items}
                  onView={(id) => navigate(`/admin/committees/${id}`)}
                  onEdit={(id) => navigate(`/admin/committees/${id}/edit`)}
                  onStatus={(item) => setStatusTarget(item)}
                  onDelete={(item) => run(item.deleted_at ? 'restore' : 'delete', item.id)}
                  onTree={(id) => navigate(`/admin/committees/${id}/hierarchy-tree`)}
                  onChildren={(id) => navigate(`/admin/committees/${id}/members`)}
                />
              </div>
              <div className="ndm-mobile-only ndm-mobile-list">
                {items.map((item) => (
                  <CommitteeCard
                    key={item.id}
                    item={item}
                    onView={(id) => navigate(`/admin/committees/${id}`)}
                    onTree={(id) => navigate(`/admin/committees/${id}/hierarchy-tree`)}
                    onChildren={(id) => navigate(`/admin/committees/${id}/members`)}
                  />
                ))}
              </div>
              <PaginationBar meta={meta} page={filters.page} onPageChange={(page) => setFilters((current) => ({ ...current, page }))} />
            </>
          ) : null}
        </PageSection>
      </PageContainer>

      <CommitteeStatusModal
        committee={statusTarget}
        busy={busyAction === 'status'}
        onClose={() => setStatusTarget(null)}
        onSubmit={(payload) => run('status', statusTarget.id, payload)}
      />
    </AdminContentWrapper>
  );
}
