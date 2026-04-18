import { useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import { ErrorState } from '../../../membership/shared/components/PageStates';
import CommitteeAssignmentForm from '../components/CommitteeAssignmentForm';
import { useCommitteeAssignmentActions, useCommitteeAssignmentDetail } from '../hooks/useCommitteeAssignments';

export default function CommitteeAssignmentFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(id);
  const { data, loading, error } = useCommitteeAssignmentDetail(id);
  const { run, busyAction, actionError } = useCommitteeAssignmentActions(() => navigate(isEdit ? `/admin/committee-assignments/${id}` : '/admin/committee-assignments'));
  const prefill = useMemo(() => {
    if (isEdit) return null;

    const committeeId = searchParams.get('committee_id');
    const committeeName = searchParams.get('committee_name');
    const committeeTypeId = searchParams.get('committee_type_id');
    const committeeTypeName = searchParams.get('committee_type_name');
    const positionId = searchParams.get('position_id');
    const positionName = searchParams.get('position_name');

    if (!committeeId && !positionId) {
      return null;
    }

    return {
      committee_id: committeeId || '',
      committee: committeeId ? {
        id: committeeId,
        name: committeeName || '',
        committee_type_id: committeeTypeId || '',
        committee_type_name: committeeTypeName || '',
      } : null,
      position_id: positionId || '',
      position: positionId ? {
        id: positionId,
        name: positionName || '',
      } : null,
    };
  }, [isEdit, searchParams]);

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title={isEdit ? 'Edit Committee Assignment' : 'Create Committee Assignment'}
          subtitle={isEdit ? 'Update placement, dates, and leadership flags.' : prefill?.committee?.name ? `Assign a member into ${prefill.committee.name}${prefill.position?.name ? ` as ${prefill.position.name}` : ''}.` : 'Create a new member-to-committee assignment.'}
          breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Organization' }, { label: 'Committee Assignments', path: '/admin/committee-assignments' }, { label: isEdit ? 'Edit Assignment' : 'Create Assignment' }]}
        />
        <PageSection>
          {loading && isEdit ? <div className="ndm-state ndm-state--loading"><div className="ndm-skeleton" /><div className="ndm-skeleton" /></div> : null}
          {error ? <ErrorState message={error} onRetry={() => navigate('/admin/committee-assignments')} /> : null}
          {actionError ? <ErrorState message={actionError} onRetry={() => {}} /> : null}
          {!loading || !isEdit ? <CommitteeAssignmentForm initialValues={isEdit ? data : prefill} busy={Boolean(busyAction)} onCancel={() => navigate(isEdit ? `/admin/committee-assignments/${id}` : '/admin/committee-assignments')} onSubmit={(payload) => run(isEdit ? 'update' : 'create', id, payload)} /> : null}
        </PageSection>
      </PageContainer>
    </AdminContentWrapper>
  );
}
