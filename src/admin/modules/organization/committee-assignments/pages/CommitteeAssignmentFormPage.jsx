import { useNavigate, useParams } from 'react-router-dom';
import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import { ErrorState } from '../../../membership/shared/components/PageStates';
import CommitteeAssignmentForm from '../components/CommitteeAssignmentForm';
import { useCommitteeAssignmentActions, useCommitteeAssignmentDetail } from '../hooks/useCommitteeAssignments';

export default function CommitteeAssignmentFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { data, loading, error } = useCommitteeAssignmentDetail(id);
  const { run, busyAction, actionError } = useCommitteeAssignmentActions(() => navigate(isEdit ? `/admin/committee-assignments/${id}` : '/admin/committee-assignments'));

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title={isEdit ? 'Edit Committee Assignment' : 'Create Committee Assignment'}
          subtitle={isEdit ? 'Update placement, dates, and leadership flags.' : 'Create a new member-to-committee assignment.'}
          breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Organization' }, { label: 'Committee Assignments', path: '/admin/committee-assignments' }, { label: isEdit ? 'Edit Assignment' : 'Create Assignment' }]}
        />
        <PageSection>
          {loading && isEdit ? <div className="ndm-state ndm-state--loading"><div className="ndm-skeleton" /><div className="ndm-skeleton" /></div> : null}
          {error ? <ErrorState message={error} onRetry={() => navigate('/admin/committee-assignments')} /> : null}
          {actionError ? <ErrorState message={actionError} onRetry={() => {}} /> : null}
          {!loading || !isEdit ? <CommitteeAssignmentForm initialValues={data} busy={Boolean(busyAction)} onCancel={() => navigate(isEdit ? `/admin/committee-assignments/${id}` : '/admin/committee-assignments')} onSubmit={(payload) => run(isEdit ? 'update' : 'create', id, payload)} /> : null}
        </PageSection>
      </PageContainer>
    </AdminContentWrapper>
  );
}
