import { useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import InfoGrid from '../../../membership/shared/components/InfoGrid';
import { ErrorState } from '../../../membership/shared/components/PageStates';
import InfoSectionCard from '../../../organization/shared/components/InfoSectionCard';
import AttachmentList from '../../shared/components/AttachmentList';
import PreviewCard from '../../shared/components/PreviewCard';
import PublishingInfoCard from '../../shared/components/PublishingInfoCard';
import SeoInfoCard from '../../shared/components/SeoInfoCard';
import StatusTimeline from '../../shared/components/StatusTimeline';
import NoticeActionPanel from '../components/NoticeActionPanel';
import NoticeAttachmentsUploader from '../components/NoticeAttachmentsUploader';
import NoticeOverviewCard from '../components/NoticeOverviewCard';
import NoticeWorkflowModal from '../components/NoticeWorkflowModal';
import { useNoticeActions, useNoticeDetail } from '../hooks/useNotices';

export default function NoticeDetailPage() {
  const { id } = useParams();
  const [workflowMode, setWorkflowMode] = useState('');
  const [attachmentModal, setAttachmentModal] = useState(false);
  const [queuedFiles, setQueuedFiles] = useState([]);
  const { data, loading, error, reload } = useNoticeDetail(id);
  const { run, busyAction, actionError } = useNoticeActions(() => {
    setWorkflowMode('');
    setAttachmentModal(false);
    setQueuedFiles([]);
    reload();
  });

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title="Notice Detail"
          subtitle="Review visibility, attachments, audience rules, and publishing history."
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Content' },
            { label: 'Notices', path: '/admin/notices' },
            { label: 'Notice Detail' },
          ]}
        />

        {loading ? <div className="ndm-state ndm-state--loading"><div className="ndm-skeleton" /><div className="ndm-skeleton" /><div className="ndm-skeleton" /></div> : null}
        {error ? <ErrorState message={error} onRetry={reload} /> : null}
        {actionError ? <ErrorState message={actionError} onRetry={reload} /> : null}

        {data ? (
          <PageSection className="ndm-two-col">
            <div className="ndm-two-col__main">
              <NoticeOverviewCard notice={data} />

              <PreviewCard title="Notice Content Preview" subtitle="Approximate public/internal rendering.">
                {data.featured_image_url ? <img className="cnt-preview-card__image" src={data.featured_image_url} alt={data.featured_image_alt || data.title} /> : null}
                <div className="cnt-preview-card__content" dangerouslySetInnerHTML={{ __html: data.content || '<p>No notice content.</p>' }} />
              </PreviewCard>

              <InfoSectionCard title="Basic Information">
                <InfoGrid items={[
                  { label: 'Title', value: data.title },
                  { label: 'Notice No', value: data.notice_no },
                  { label: 'Type', value: data.notice_type },
                  { label: 'Priority', value: data.priority },
                ]} />
              </InfoSectionCard>

              <InfoSectionCard title="Audience / Visibility Rules">
                <InfoGrid items={[
                  { label: 'Visibility', value: data.visibility },
                  { label: 'Audience Type', value: data.audience_type },
                  { label: 'Acknowledgement Required', value: data.requires_acknowledgement ? 'Yes' : 'No' },
                  { label: 'Pinned', value: data.is_pinned ? 'Yes' : 'No' },
                ]} />
                {data.audience_rules?.length ? (
                  <div className="cnt-rule-list">
                    {data.audience_rules.map((rule) => <span key={rule.id} className="cnt-rule-chip">{rule.rule_type}: {rule.rule_value}</span>)}
                  </div>
                ) : null}
              </InfoSectionCard>

              <InfoSectionCard title="Committee Targeting">
                <InfoGrid items={[
                  { label: 'Committee', value: data.committee_name },
                  { label: 'Author', value: data.author_name },
                  { label: 'Approver', value: data.approver_name },
                ]} />
              </InfoSectionCard>

              <AttachmentList items={data.attachments || []} removable onRemove={(item) => run('delete-attachment', data.id, { attachmentId: item.id })} />
              <SeoInfoCard data={data} />
              <PublishingInfoCard data={data} />

              <InfoSectionCard title="Status History Timeline">
                <StatusTimeline items={data.status_history || []} />
              </InfoSectionCard>
            </div>

            <div className="ndm-two-col__side">
              <NoticeActionPanel notice={data} onWorkflowOpen={setWorkflowMode} onAttachmentOpen={() => setAttachmentModal(true)} />
              <PreviewCard title="Public Content Readiness" subtitle="Operational checks before distribution.">
                <ul className="cnt-checklist">
                  <li>{data.summary ? 'Summary ready' : 'Summary missing'}</li>
                  <li>{data.attachment_count ? `${data.attachment_count} attachment(s) present` : 'No attachments'}</li>
                  <li>{data.expires_at ? 'Expiry configured' : 'No expiry configured'}</li>
                  <li>{data.visibility === 'public' ? 'Publicly visible' : 'Restricted audience'}</li>
                </ul>
              </PreviewCard>
            </div>
          </PageSection>
        ) : null}
      </PageContainer>

      {workflowMode && data ? (
        <NoticeWorkflowModal
          mode={workflowMode}
          notice={data}
          busy={Boolean(busyAction)}
          onClose={() => setWorkflowMode('')}
          onConfirm={(payload) => run(workflowMode, data.id, payload)}
        />
      ) : null}

      {attachmentModal && data ? (
        <div className="ndm-modal__overlay" onClick={() => setAttachmentModal(false)}>
          <div className="ndm-modal" onClick={(event) => event.stopPropagation()}>
            <h3>Add Attachments</h3>
            <NoticeAttachmentsUploader files={queuedFiles} onFilesChange={setQueuedFiles} />
            <div className="ndm-modal__actions">
              <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => setAttachmentModal(false)}>Cancel</button>
              <button type="button" className="ndm-btn ndm-btn--primary" disabled={Boolean(busyAction) || queuedFiles.length === 0} onClick={() => run('upload-attachments', data.id, { files: queuedFiles })}>Upload Files</button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminContentWrapper>
  );
}
