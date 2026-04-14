import { useState } from 'react';
import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import OrganizationFilterToolbar from '../../shared/components/OrganizationFilterToolbar';
import OrganizationSkeleton from '../../shared/components/OrganizationSkeleton';
import OrganizationEmptyState from '../../shared/components/OrganizationEmptyState';
import { ErrorState } from '../../../membership/shared/components/PageStates';
import HierarchyTree from '../../shared/components/HierarchyTree';
import CommitteeStatusBadge from '../../shared/components/CommitteeStatusBadge';
import CommitteeTypeBadge from '../../shared/components/CommitteeTypeBadge';
import { useCommitteesTree } from '../hooks/useCommittees';

export default function CommitteesTreePage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', committee_type_id: '', root_id: '' });
  const { nodes, loading, error, reload } = useCommitteesTree(filters);

  const filteredNodes = nodes.filter((node) => !search || `${node.name} ${node.committee_type_name}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title="Committees Tree"
          subtitle="Explore the nested committee hierarchy with current status and type visibility."
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Organization' },
            { label: 'Committees Tree' },
          ]}
        />

        <PageSection>
          <OrganizationFilterToolbar
            search={search}
            onSearchChange={setSearch}
            onSubmit={(event) => event.preventDefault()}
            onReset={() => { setSearch(''); setFilters({ status: '', committee_type_id: '', root_id: '' }); }}
            searchPlaceholder="Search committee tree"
          >
            <select className="ndm-input" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </select>
            <input className="ndm-input" placeholder="Root ID" value={filters.root_id} onChange={(event) => setFilters((current) => ({ ...current, root_id: event.target.value }))} />
          </OrganizationFilterToolbar>

          {loading ? <OrganizationSkeleton rows={6} /> : null}
          {error ? <ErrorState message={error} onRetry={reload} /> : null}
          {!loading && !error && filteredNodes.length === 0 ? <OrganizationEmptyState title="No tree nodes available" subtitle="Try clearing the filters or loading a different root." /> : null}

          {!loading && !error && filteredNodes.length > 0 ? (
            <HierarchyTree
              nodes={filteredNodes}
              renderLabel={(node) => (
                <div className="org-tree-label">
                  <div>
                    <p className="org-tree-label__title">{node.name}</p>
                    <p className="org-tree-label__meta">{node.committee_no}</p>
                  </div>
                  <div className="org-tree-label__badges">
                    <CommitteeTypeBadge value={node.committee_type_name} />
                    <CommitteeStatusBadge value={node.status} />
                    {node.is_current ? <span className="org-pill org-pill--green">Current</span> : null}
                  </div>
                </div>
              )}
            />
          ) : null}
        </PageSection>
      </PageContainer>
    </AdminContentWrapper>
  );
}
