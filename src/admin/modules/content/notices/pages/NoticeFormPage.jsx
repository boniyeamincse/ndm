import { useNavigate, useParams } from 'react-router-dom';
import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import { ErrorState } from '../../../membership/shared/components/PageStates';
import NoticeForm from '../components/NoticeForm';
import { useNoticeActions, useNoticeDetail } from '../hooks/useNotices';

export default function NoticeFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { data, loading, error } = useNoticeDetail(id);
  const { run, busyAction, actionError } = useNoticeActions(() => {
    navigate(isEdit ? `/admin/notices/${id}` : '/admin/notices');
  });

  function handleSubmit(payload) {
    run(isEdit ? 'update' : 'create', id, payload);
  }

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title={isEdit ? 'Edit Notice' : 'Create Notice'}
          subtitle={isEdit ? 'Update notice content, audience targeting, and publishing windows.' : 'Create a new official notice, circular, or urgent communication.'}
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Content' },
            { label: 'Notices', path: '/admin/notices' },
            { label: isEdit ? 'Edit Notice' : 'Create Notice' },
          ]}
        />

        <PageSection>
          {loading && isEdit ? <div className="ndm-state ndm-state--loading"><div className="ndm-skeleton" /><div className="ndm-skeleton" /><div className="ndm-skeleton" /></div> : null}
          {error ? <ErrorState message={error} onRetry={() => navigate('/admin/notices')} /> : null}
          {actionError ? <ErrorState message={actionError} onRetry={() => {}} /> : null}
          {!loading || !isEdit ? (
            <NoticeForm
              initialValues={data}
              busy={Boolean(busyAction)}
              onCancel={() => navigate(isEdit ? `/admin/notices/${id}` : '/admin/notices')}
              onSubmit={handleSubmit}
            />
          ) : null}
        </PageSection>
      </PageContainer>
    </AdminContentWrapper>
  );
}
