import { useNavigate, useParams } from 'react-router-dom';
import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import OrganizationSkeleton from '../../shared/components/OrganizationSkeleton';
import OrganizationEmptyState from '../../shared/components/OrganizationEmptyState';
import OrganizationTable from '../../shared/components/OrganizationTable';
import { ErrorState } from '../../../membership/shared/components/PageStates';
import AssignmentStatusBadge from '../../shared/components/AssignmentStatusBadge';
import AssignmentTypeBadge from '../../shared/components/AssignmentTypeBadge';
import { useCommitteeMembers } from '../hooks/useCommittees';

export default function CommitteeMembersPage() {
  const navigate = useNavigate();
  const { committeeId } = useParams();
  const { items, loading, error, reload } = useCommitteeMembers(committeeId);

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title="Committee Members"
          subtitle="Leadership-first committee member listing with assignment visibility."
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Organization' },
            { label: 'Committee Members' },
          ]}
        />

        <PageSection>
          {loading ? <OrganizationSkeleton rows={8} /> : null}
          {error ? <ErrorState message={error} onRetry={reload} /> : null}
          {!loading && !error && items.length === 0 ? <OrganizationEmptyState title="No committee members found" subtitle="This committee has no assignment records yet." /> : null}

          {!loading && !error && items.length > 0 ? (
            <OrganizationTable
              columns={[
                { key: 'member', label: 'Member' },
                { key: 'position', label: 'Position' },
                { key: 'assignment_type', label: 'Assignment Type' },
                { key: 'primary', label: 'Primary' },
                { key: 'leadership', label: 'Leadership' },
                { key: 'status', label: 'Status' },
                { key: 'dates', label: 'Dates' },
                { key: 'actions', label: 'Actions' },
              ]}
              rows={items}
              testId="committee-members-table"
              renderRow={(item) => (
                <tr key={item.id}>
                  <td>{item.member_name || item.member?.full_name || '—'}</td>
                  <td>{item.position_name || item.position?.name || '—'}</td>
                  <td><AssignmentTypeBadge value={item.assignment_type} /></td>
                  <td>{item.is_primary ? <span className="org-pill org-pill--green">Primary</span> : '—'}</td>
                  <td>{item.is_leadership ? <span className="org-pill org-pill--red">Leadership</span> : '—'}</td>
                  <td><AssignmentStatusBadge value={item.status || (item.is_active ? 'active' : 'inactive')} /></td>
                  <td>{item.start_date || '—'} - {item.end_date || 'Present'}</td>
                  <td><button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => navigate(`/admin/committee-assignments/${item.id}`)}>View</button></td>
                </tr>
              )}
            />
          ) : null}
        </PageSection>
      </PageContainer>
    </AdminContentWrapper>
  );
}