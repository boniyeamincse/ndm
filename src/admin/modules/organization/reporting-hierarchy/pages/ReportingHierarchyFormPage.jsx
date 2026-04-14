import { useNavigate, useParams } from 'react-router-dom';
import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import { ErrorState } from '../../../membership/shared/components/PageStates';
import ReportingHierarchyForm from '../components/ReportingHierarchyForm';
import { useReportingRelationActions, useReportingRelationDetail } from '../hooks/useReportingHierarchy';

export default function ReportingHierarchyFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { data, loading, error } = useReportingRelationDetail(id);
  const { run, busyAction, actionError } = useReportingRelationActions(() => navigate(isEdit ? `/admin/reporting-hierarchy/${id}` : '/admin/reporting-hierarchy'));

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title={isEdit ? 'Edit Reporting Relation' : 'Create Reporting Relation'}
          subtitle={isEdit ? 'Update superior-subordinate structure.' : 'Create a new superior-subordinate reporting relationship.'}
          breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Organization' }, { label: 'Reporting Hierarchy', path: '/admin/reporting-hierarchy' }, { label: isEdit ? 'Edit Relation' : 'Create Relation' }]}
        />
        <PageSection>
          {loading && isEdit ? <div className="ndm-state ndm-state--loading"><div className="ndm-skeleton" /><div className="ndm-skeleton" /></div> : null}
          {error ? <ErrorState message={error} onRetry={() => navigate('/admin/reporting-hierarchy')} /> : null}
          {actionError ? <ErrorState message={actionError} onRetry={() => {}} /> : null}
          {!loading || !isEdit ? <ReportingHierarchyForm initialValues={data} busy={Boolean(busyAction)} onCancel={() => navigate(isEdit ? `/admin/reporting-hierarchy/${id}` : '/admin/reporting-hierarchy')} onSubmit={(payload) => run(isEdit ? 'update' : 'create', id, payload)} /> : null}
        </PageSection>
      </PageContainer>
    </AdminContentWrapper>
  );
}
