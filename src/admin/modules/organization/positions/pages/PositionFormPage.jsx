import { useNavigate, useParams } from 'react-router-dom';
import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import { ErrorState } from '../../../membership/shared/components/PageStates';
import PositionForm from '../components/PositionForm';
import { usePositionActions, usePositionDetail } from '../hooks/usePositions';

export default function PositionFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { data, loading, error } = usePositionDetail(id);
  const { run, busyAction, actionError } = usePositionActions(() => navigate(isEdit ? `/admin/positions/${id}` : '/admin/positions'));

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title={isEdit ? 'Edit Position' : 'Create Position'}
          subtitle={isEdit ? 'Update role metadata, scope, and mappings.' : 'Create a new position with hierarchy and mapping controls.'}
          breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Organization' }, { label: 'Positions', path: '/admin/positions' }, { label: isEdit ? 'Edit Position' : 'Create Position' }]}
        />
        <PageSection>
          {loading && isEdit ? <div className="ndm-state ndm-state--loading"><div className="ndm-skeleton" /><div className="ndm-skeleton" /></div> : null}
          {error ? <ErrorState message={error} onRetry={() => navigate('/admin/positions')} /> : null}
          {actionError ? <ErrorState message={actionError} onRetry={() => {}} /> : null}
          {!loading || !isEdit ? <PositionForm initialValues={data} busy={Boolean(busyAction)} onCancel={() => navigate(isEdit ? `/admin/positions/${id}` : '/admin/positions')} onSubmit={(payload) => run(isEdit ? 'update' : 'create', id, payload)} /> : null}
        </PageSection>
      </PageContainer>
    </AdminContentWrapper>
  );
}