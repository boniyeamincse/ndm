import { useMemo, useState } from 'react';
import { Plus, UserPlus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import PaginationBar from '../../../membership/shared/components/PaginationBar';
import { ErrorState } from '../../../membership/shared/components/PageStates';
import OrganizationSummaryCards from '../../shared/components/OrganizationSummaryCards';
import OrganizationFilterToolbar from '../../shared/components/OrganizationFilterToolbar';
import OrganizationTable from '../../shared/components/OrganizationTable';
import OrganizationSkeleton from '../../shared/components/OrganizationSkeleton';
import OrganizationEmptyState from '../../shared/components/OrganizationEmptyState';
import PositionCategoryBadge from '../../shared/components/PositionCategoryBadge';
import PositionScopeBadge from '../../shared/components/PositionScopeBadge';
import { useCommitteeDetail } from '../../committees/hooks/useCommittees';
import { usePositions } from '../hooks/usePositions';

function committeeAwareSummary(items = []) {
  return items.reduce((acc, item) => {
    acc.total += 1;
    if (item.is_active) acc.active += 1;
    if (!item.is_active) acc.inactive += 1;
    if (item.is_leadership) acc.leadership += 1;
    if (item.scope === 'committee_specific') acc.committee_specific += 1;
    if (item.scope === 'global') acc.global += 1;
    return acc;
  }, {
    total: 0,
    active: 0,
    inactive: 0,
    leadership: 0,
    committee_specific: 0,
    global: 0,
  });
}

export default function CommitteePositionsPage() {
  const navigate = useNavigate();
  const { committeeId } = useParams();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ search: '', category: '', scope: '', is_active: '', is_leadership: '', sort_by: 'hierarchy_rank', sort_dir: 'asc', page: 1, per_page: 20 });

  const { data: committee, loading: committeeLoading, error: committeeError, reload: reloadCommittee } = useCommitteeDetail(committeeId);

  const positionFilters = useMemo(() => ({
    ...filters,
    committee_type_id: committee?.committee_type_id || '',
  }), [filters, committee?.committee_type_id]);

  const { items, meta, loading: positionsLoading, error: positionsError, reload: reloadPositions } = usePositions(positionFilters);
  const summary = useMemo(() => committeeAwareSummary(items), [items]);

  const isLoading = committeeLoading || positionsLoading;
  const hasError = committeeError || positionsError;

  const createPositionLink = committee
    ? `/admin/positions/create?committee_id=${committee.id}&committee_name=${encodeURIComponent(committee.name || '')}&committee_type_id=${committee.committee_type_id || ''}&committee_type_name=${encodeURIComponent(committee.committee_type_name || '')}`
    : '/admin/positions/create';

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title="Committee Positions"
          subtitle={committee ? `Manage positions mapped to ${committee.name}.` : 'Manage committee-specific position mappings and assignments.'}
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Organization' },
            { label: 'Committees', path: '/admin/committees' },
            { label: committee?.name || 'Committee Positions' },
          ]}
          actions={(
            <button type="button" className="ndm-btn ndm-btn--primary" onClick={() => navigate(createPositionLink)} disabled={!committee}>
              <Plus size={16} /> Add Position For Committee
            </button>
          )}
        />

        <OrganizationSummaryCards cards={[
          { label: 'Total Positions', value: summary.total, tone: 'neutral' },
          { label: 'Active Positions', value: summary.active, tone: 'success' },
          { label: 'Inactive Positions', value: summary.inactive, tone: 'muted' },
          { label: 'Leadership Positions', value: summary.leadership, tone: 'danger' },
          { label: 'Committee Specific Positions', value: summary.committee_specific, tone: 'info' },
          { label: 'Global Positions', value: summary.global, tone: 'warning' },
        ]} />

        <PageSection>
          <OrganizationFilterToolbar
            search={search}
            onSearchChange={setSearch}
            onSubmit={(event) => {
              event.preventDefault();
              setFilters((current) => ({ ...current, search, page: 1 }));
            }}
            onReset={() => {
              setSearch('');
              setFilters({ search: '', category: '', scope: '', is_active: '', is_leadership: '', sort_by: 'hierarchy_rank', sort_dir: 'asc', page: 1, per_page: 20 });
            }}
            searchPlaceholder="Search position name or code"
          >
            <select className="ndm-input" value={filters.category} onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value, page: 1 }))}>
              <option value="">All Categories</option>
              <option value="leadership">Leadership</option>
              <option value="executive">Executive</option>
              <option value="general">General</option>
            </select>
            <select className="ndm-input" value={filters.scope} onChange={(event) => setFilters((current) => ({ ...current, scope: event.target.value, page: 1 }))}>
              <option value="">All Scope</option>
              <option value="committee_specific">Committee Specific</option>
              <option value="global">Global</option>
            </select>
            <select className="ndm-input" value={filters.is_leadership} onChange={(event) => setFilters((current) => ({ ...current, is_leadership: event.target.value, page: 1 }))}>
              <option value="">Any Leadership</option>
              <option value="1">Leadership Only</option>
              <option value="0">Non Leadership</option>
            </select>
            <select className="ndm-input" value={filters.is_active} onChange={(event) => setFilters((current) => ({ ...current, is_active: event.target.value, page: 1 }))}>
              <option value="">Any Status</option>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </OrganizationFilterToolbar>

          {hasError ? <ErrorState message={hasError} onRetry={() => { reloadCommittee(); reloadPositions(); }} /> : null}
          {isLoading ? <OrganizationSkeleton rows={8} /> : null}
          {!isLoading && !hasError && items.length === 0 ? <OrganizationEmptyState title="No positions found for this committee type" subtitle="Create a position and map it to this committee type." /> : null}

          {!isLoading && !hasError && items.length > 0 ? (
            <>
              <OrganizationTable
                columns={[
                  { key: 'name', label: 'Name' },
                  { key: 'category', label: 'Category' },
                  { key: 'scope', label: 'Scope' },
                  { key: 'hierarchy_rank', label: 'Rank' },
                  { key: 'active', label: 'Status' },
                  { key: 'actions', label: 'Actions' },
                ]}
                rows={items}
                testId="committee-positions-table"
                renderRow={(item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="org-position-name-cell">
                        <div className="org-position-name">{item.name}</div>
                        <div className="org-position-code">{item.code || 'No code'}</div>
                      </div>
                    </td>
                    <td><PositionCategoryBadge value={item.category} /></td>
                    <td><PositionScopeBadge value={item.scope} /></td>
                    <td>{item.hierarchy_rank || '—'}</td>
                    <td>{item.is_active ? <span className="org-pill org-pill--green">Active</span> : <span className="org-pill org-pill--slate">Inactive</span>}</td>
                    <td>
                      <div className="ndm-table__actions">
                        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => navigate(`/admin/positions/${item.id}`)}>View</button>
                        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => navigate(`/admin/positions/${item.id}/edit`)}>Edit</button>
                        <button
                          type="button"
                          className="ndm-btn ndm-btn--primary"
                          onClick={() => navigate(`/admin/committee-assignments/create?committee_id=${committee.id}&committee_name=${encodeURIComponent(committee.name || '')}&committee_type_id=${committee.committee_type_id || ''}&committee_type_name=${encodeURIComponent(committee.committee_type_name || '')}&position_id=${item.id}&position_name=${encodeURIComponent(item.name || '')}`)}
                        >
                          <UserPlus size={14} /> Add Member
                        </button>
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
    </AdminContentWrapper>
  );
}