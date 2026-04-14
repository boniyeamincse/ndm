import { useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import OrganizationFilterToolbar from '../../shared/components/OrganizationFilterToolbar';
import OrganizationSkeleton from '../../shared/components/OrganizationSkeleton';
import OrganizationEmptyState from '../../shared/components/OrganizationEmptyState';
import HierarchyTree from '../../shared/components/HierarchyTree';
import HierarchyRelationTypeBadge from '../../shared/components/HierarchyRelationTypeBadge';
import { ErrorState } from '../../../membership/shared/components/PageStates';
import { buildTree } from '../../shared/utils/tree';
import { useCommitteeHierarchyTree } from '../hooks/useReportingHierarchy';

export default function CommitteeHierarchyTreePage() {
  const { committeeId } = useParams();
  const [search, setSearch] = useState('');
  const [activeOnly, setActiveOnly] = useState(true);
  const [relationType, setRelationType] = useState('');
  const [includeNonPrimary, setIncludeNonPrimary] = useState(false);
  const { nodes, loading, error, reload } = useCommitteeHierarchyTree(committeeId);

  const flat = Array.isArray(nodes) ? nodes : [];
  const filtered = flat.filter((node) => {
    if (activeOnly && node.is_active === false) return false;
    if (!includeNonPrimary && node.is_primary === false) return false;
    if (relationType && node.relation_type !== relationType) return false;
    if (search && !`${node.member_name || ''} ${node.position_name || ''}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const treeNodes = buildTree(filtered, 'id', 'parent_id');

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title="Committee Hierarchy Tree"
          subtitle="Organization chart view of superior and subordinate relationships."
          breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Organization' }, { label: 'Committee Hierarchy Tree' }]}
        />
        <PageSection>
          <OrganizationFilterToolbar
            search={search}
            onSearchChange={setSearch}
            onSubmit={(event) => event.preventDefault()}
            onReset={() => { setSearch(''); setActiveOnly(true); setRelationType(''); setIncludeNonPrimary(false); }}
            searchPlaceholder="Search member or position in tree"
          >
            <select className="ndm-input" value={relationType} onChange={(event) => setRelationType(event.target.value)}><option value="">All Relation Types</option><option value="direct">Direct</option><option value="functional">Functional</option><option value="advisory">Advisory</option></select>
            <label className="ndm-checkbox-row"><input type="checkbox" checked={activeOnly} onChange={(event) => setActiveOnly(event.target.checked)} /> Active only</label>
            <label className="ndm-checkbox-row"><input type="checkbox" checked={includeNonPrimary} onChange={(event) => setIncludeNonPrimary(event.target.checked)} /> Include non-primary</label>
          </OrganizationFilterToolbar>

          {loading ? <OrganizationSkeleton rows={6} /> : null}
          {error ? <ErrorState message={error} onRetry={reload} /> : null}
          {!loading && !error && treeNodes.length === 0 ? <OrganizationEmptyState title="No hierarchy nodes found" subtitle="Adjust filters to show the reporting tree." /> : null}
          {!loading && !error && treeNodes.length > 0 ? (
            <HierarchyTree
              nodes={treeNodes}
              renderLabel={(node) => (
                <div className="org-tree-label org-tree-label--person">
                  <div className="org-tree-label__avatar">{(node.member_name || 'N').slice(0, 1)}</div>
                  <div>
                    <p className="org-tree-label__title">{node.member_name || 'Unknown Member'}</p>
                    <p className="org-tree-label__meta">{node.member_no || '—'} · {node.position_name || '—'}</p>
                  </div>
                  <div className="org-tree-label__badges">
                    {node.is_leadership ? <span className="org-pill org-pill--red">Leadership</span> : null}
                    <HierarchyRelationTypeBadge value={node.relation_type} />
                    {node.children?.length ? <span className="org-pill org-pill--slate">{node.children.length} reports</span> : null}
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