import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import InfoGrid from '../../../membership/shared/components/InfoGrid';
import { ErrorState } from '../../../membership/shared/components/PageStates';
import InfoSectionCard from '../../../organization/shared/components/InfoSectionCard';
import PreviewCard from '../../shared/components/PreviewCard';
import PublishingInfoCard from '../../shared/components/PublishingInfoCard';
import SeoInfoCard from '../../shared/components/SeoInfoCard';
import StatusTimeline from '../../shared/components/StatusTimeline';
import PostOverviewCard from '../components/PostOverviewCard';
import PostActionPanel from '../components/PostActionPanel';
import PostWorkflowModal from '../components/PostWorkflowModal';
import { usePostActions, usePostDetail } from '../hooks/usePosts';

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workflowMode, setWorkflowMode] = useState('');
  const { data, loading, error, reload } = usePostDetail(id);
  const { run, busyAction, actionError } = usePostActions(() => {
    setWorkflowMode('');
    reload();
  });

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title="Post Detail"
          subtitle="Review editorial content, targeting, metadata, and publishing history."
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Content' },
            { label: 'Blog / News', path: '/admin/posts' },
            { label: 'Post Detail' },
          ]}
        />

        {loading ? <div className="ndm-state ndm-state--loading"><div className="ndm-skeleton" /><div className="ndm-skeleton" /><div className="ndm-skeleton" /></div> : null}
        {error ? <ErrorState message={error} onRetry={reload} /> : null}
        {actionError ? <ErrorState message={actionError} onRetry={reload} /> : null}

        {data ? (
          <PageSection className="ndm-two-col">
            <div className="ndm-two-col__main">
              <PostOverviewCard post={data} />

              <PreviewCard title="Post Preview" subtitle="A simple approximation of how the post may appear publicly.">
                {data.featured_image_url ? <img className="cnt-preview-card__image" src={data.featured_image_url} alt={data.featured_image_alt || data.title} /> : null}
                <div className="cnt-preview-card__content" dangerouslySetInnerHTML={{ __html: data.content || '<p>No content available.</p>' }} />
              </PreviewCard>

              <InfoSectionCard title="Basic Information">
                <InfoGrid items={[
                  { label: 'Title', value: data.title },
                  { label: 'Post No', value: data.post_no },
                  { label: 'Category', value: data.category_name },
                  { label: 'Content Type', value: data.content_type },
                ]} />
              </InfoSectionCard>

              <InfoSectionCard title="Category & Committee Targeting">
                <InfoGrid items={[
                  { label: 'Category', value: data.category_name },
                  { label: 'Committee', value: data.committee_name },
                  { label: 'Author', value: data.author_name },
                  { label: 'Editor', value: data.editor_name },
                ]} />
              </InfoSectionCard>

              <InfoSectionCard title="Tags">
                <div className="cnt-tag-list">
                  {(data.tags || []).length ? data.tags.map((tag) => <span key={tag} className="cnt-tag-chip">{tag}</span>) : 'No tags assigned.'}
                </div>
              </InfoSectionCard>

              <SeoInfoCard data={data} />
              <PublishingInfoCard data={data} />

              <InfoSectionCard title="Status History Timeline">
                <StatusTimeline items={data.status_history || []} />
              </InfoSectionCard>
            </div>

            <div className="ndm-two-col__side">
              <PostActionPanel post={data} onWorkflowOpen={setWorkflowMode} />
              <PreviewCard title="Public Readiness" subtitle="Quick editorial checklist for external publishing.">
                <ul className="cnt-checklist">
                  <li>{data.excerpt ? 'Excerpt ready' : 'Excerpt missing'}</li>
                  <li>{data.featured_image_url ? 'Featured image ready' : 'Featured image missing'}</li>
                  <li>{data.meta_title ? 'SEO metadata set' : 'SEO metadata incomplete'}</li>
                  <li>{data.visibility === 'public' ? 'Public facing' : 'Restricted visibility'}</li>
                </ul>
              </PreviewCard>
              <div className="ndm-modal__actions cnt-inline-actions">
                <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => navigate(`/admin/posts/${id}/edit`)}>Edit Post</button>
                <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => navigate('/admin/posts')}>Back to List</button>
              </div>
            </div>
          </PageSection>
        ) : null}
      </PageContainer>

      {workflowMode && data ? (
        <PostWorkflowModal
          mode={workflowMode}
          post={data}
          busy={Boolean(busyAction)}
          onClose={() => setWorkflowMode('')}
          onConfirm={(payload) => run(workflowMode, data.id, payload)}
        />
      ) : null}
    </AdminContentWrapper>
  );
}
