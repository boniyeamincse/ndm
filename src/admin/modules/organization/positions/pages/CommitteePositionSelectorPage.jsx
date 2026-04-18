import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BriefcaseBusiness } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import PaginationBar from '../../../membership/shared/components/PaginationBar';
import { ErrorState } from '../../../membership/shared/components/PageStates';
import OrganizationFilterToolbar from '../../shared/components/OrganizationFilterToolbar';
import OrganizationTable from '../../shared/components/OrganizationTable';
import OrganizationSkeleton from '../../shared/components/OrganizationSkeleton';
import OrganizationEmptyState from '../../shared/components/OrganizationEmptyState';
import { useCommittees } from '../../committees/hooks/useCommittees';
import { committeeTypesService } from '../../committee-types/services/committeeTypesService';

export default function CommitteePositionSelectorPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [committeeTypeOptions, setCommitteeTypeOptions] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: 'active',
    is_current: '1',
    committee_type_id: '',
    sort_by: 'name',
    sort_dir: 'asc',
    page: 1,
    per_page: 20,
  });

  const { items, meta, loading, error, reload } = useCommittees(filters);

  useEffect(() => {
    let alive = true;

    async function loadCommitteeTypes() {
      try {
        const result = await committeeTypesService.list({ per_page: 100, sort_by: 'hierarchy_order', sort_dir: 'asc' });
        if (alive) {
          setCommitteeTypeOptions(result.items || []);
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

  const activeCommitteeTypeChip = useMemo(() => {
    if (!filters.committee_type_id) return 'all';
    return String(filters.committee_type_id);
  }, [filters.committee_type_id]);

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title="Committee Positions"
          subtitle="Choose a committee to manage its mapped positions and assign members quickly."
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Organization' },
            { label: 'Committee Positions' },
          ]}
        />

        <PageSection>
          <div className="org-quick-chips">
            <button
              type="button"
              className={`org-quick-chip ${activeCommitteeTypeChip === 'all' ? 'org-quick-chip--active' : ''}`}
              onClick={() => setFilters((current) => ({ ...current, committee_type_id: '', page: 1 }))}
            >
              All Types
            </button>
            {committeeTypeOptions.map((type) => (
              <button
                key={type.id}
                type="button"
                className={`org-quick-chip ${activeCommitteeTypeChip === String(type.id) ? 'org-quick-chip--active' : ''}`}
                onClick={() => setFilters((current) => ({ ...current, committee_type_id: String(type.id), page: 1 }))}
              >
                {type.name}
              </button>
            ))}
          </div>

          <OrganizationFilterToolbar
            search={search}
            onSearchChange={setSearch}
            onSubmit={(event) => {
              event.preventDefault();
              setFilters((current) => ({ ...current, search, page: 1 }));
            }}
            onReset={() => {
              setSearch('');
              setFilters({
                search: '',
                status: 'active',
                is_current: '1',
                committee_type_id: '',
                sort_by: 'name',
                sort_dir: 'asc',
                page: 1,
                per_page: 20,
              });
            }}
            searchPlaceholder="Search active committee by name, code, or committee number"
          />

          {loading ? <OrganizationSkeleton rows={8} /> : null}
          {error ? <ErrorState message={error} onRetry={reload} /> : null}
          {!loading && !error && items.length === 0 ? <OrganizationEmptyState title="No active committee found" subtitle="Try changing your search text." /> : null}

          {!loading && !error && items.length > 0 ? (
            <>
              <OrganizationTable
                columns={[
                  { key: 'committee', label: 'Committee' },
                  { key: 'type', label: 'Type' },
                  { key: 'location', label: 'Location' },
                  { key: 'status', label: 'Status' },
                  { key: 'actions', label: 'Actions' },
                ]}
                rows={items}
                testId="committee-position-selector-table"
                renderRow={(item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="org-position-name-cell">
                        <div className="org-position-name">{item.name}</div>
                        <div className="org-position-code">{item.code || item.committee_no || 'No code'}</div>
                      </div>
                    </td>
                    <td>{item.committee_type_name || 'Committee'}</td>
                    <td>{[item.division_name, item.district_name, item.upazila_name, item.union_name].filter(Boolean).join(', ') || 'Central'}</td>
                    <td><span className="org-pill org-pill--green">{item.status || 'active'}</span></td>
                    <td>
                      <div className="ndm-table__actions">
                        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => navigate(`/admin/committees/${item.id}`)}>View Committee</button>
                        <button type="button" className="ndm-btn ndm-btn--primary" onClick={() => navigate(`/admin/committees/${item.id}/positions`)}>
                          <BriefcaseBusiness size={14} /> Manage Positions
                        </button>
                        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => navigate(`/admin/committee-assignments/create?committee_id=${item.id}&committee_name=${encodeURIComponent(item.name || '')}&committee_type_id=${item.committee_type_id || ''}&committee_type_name=${encodeURIComponent(item.committee_type_name || '')}`)}>
                          <ArrowRight size={14} /> Add Member
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