import { useNavigate, useParams } from 'react-router-dom';
import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import { ErrorState } from '../../../membership/shared/components/PageStates';
import PostForm from '../components/PostForm';
import { usePostActions, usePostDetail } from '../hooks/usePosts';

export default function PostFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { data, loading, error } = usePostDetail(id);
  const { run, busyAction, actionError } = usePostActions(() => {
    navigate(isEdit ? `/admin/posts/${id}` : '/admin/posts');
  });

  function handleSubmit(payload) {
    run(isEdit ? 'update' : 'create', id, payload);
  }

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title={isEdit ? 'Edit Post' : 'Create Post'}
          subtitle={isEdit ? 'Update editorial content, publishing settings, and public metadata.' : 'Create a new blog post, news update, or official statement.'}
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Content' },
            { label: 'Blog / News', path: '/admin/posts' },
            { label: isEdit ? 'Edit Post' : 'Create Post' },
          ]}
        />

        <PageSection>
          {loading && isEdit ? <div className="ndm-state ndm-state--loading"><div className="ndm-skeleton" /><div className="ndm-skeleton" /><div className="ndm-skeleton" /></div> : null}
          {error ? <ErrorState message={error} onRetry={() => navigate('/admin/posts')} /> : null}
          {actionError ? <ErrorState message={actionError} onRetry={() => {}} /> : null}
          {!loading || !isEdit ? (
            <PostForm
              initialValues={data}
              busy={Boolean(busyAction)}
              onCancel={() => navigate(isEdit ? `/admin/posts/${id}` : '/admin/posts')}
              onSubmit={handleSubmit}
            />
          ) : null}
        </PageSection>
      </PageContainer>
    </AdminContentWrapper>
  );
}
