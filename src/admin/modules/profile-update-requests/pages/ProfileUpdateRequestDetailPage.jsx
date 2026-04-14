import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminPageHeader from '../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../components/AdminContentWrapper';
import InfoGrid from '../../membership/shared/components/InfoGrid';
import { ErrorState, LoadingSkeleton } from '../../membership/shared/components/PageStates';
import SectionCard from '../../membership/shared/components/SectionCard';
import ApproveProfileRequestModal from '../components/ApproveProfileRequestModal';
import ProfileRequestActionPanel from '../components/ProfileRequestActionPanel';
import ProfileRequestChangesCard from '../components/ProfileRequestChangesCard';
import ProfileRequestOverviewCard from '../components/ProfileRequestOverviewCard';
import ProfileRequestTimeline from '../components/ProfileRequestTimeline';
import RejectProfileRequestModal from '../components/RejectProfileRequestModal';
import { useProfileUpdateRequestActions, useProfileUpdateRequestDetail } from '../hooks/useProfileUpdateRequests';

export default function ProfileUpdateRequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modal, setModal] = useState('');
  const { data, loading, error, reload } = useProfileUpdateRequestDetail(id);
  const { run, busyAction, actionError } = useProfileUpdateRequestActions(() => { setModal(''); reload(); });

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title="Profile Update Request Detail"
          subtitle="Review requested changes, compare profile data, and take a review action."
          breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Requests' }, { label: 'Profile Update Requests', path: '/admin/profile-update-requests' }, { label: 'Request Detail' }]}
        />

        {loading ? <LoadingSkeleton rows={8} /> : null}
        {error ? <ErrorState message={error} onRetry={reload} /> : null}
        {actionError ? <ErrorState message={actionError} onRetry={reload} /> : null}

        {data ? (
          <PageSection className="ndm-two-col">
            <div className="ndm-two-col__main">
              <ProfileRequestOverviewCard request={data} />
              <ProfileRequestChangesCard changes={data.requested_changes || []} />
              <SectionCard title="Current Existing Data Snapshot">
                <InfoGrid items={[
                  { label: 'Requester', value: data.requester?.name },
                  { label: 'Member Name', value: data.member?.name },
                  { label: 'Member No', value: data.member?.member_no },
                  { label: 'District', value: data.member?.district },
                ]} />
              </SectionCard>
              <SectionCard title="Submitted Note">
                <p>{data.submitted_note || 'No note submitted.'}</p>
              </SectionCard>
              <SectionCard title="Review Metadata">
                <InfoGrid items={[
                  { label: 'Status', value: data.status },
                  { label: 'Reviewed By', value: data.reviewed_by?.name || '—' },
                  { label: 'Reviewed At', value: data.reviewed_at ? new Date(data.reviewed_at).toLocaleString() : '—' },
                  { label: 'Rejection Reason', value: data.rejection_reason || '—' },
                ]} />
              </SectionCard>
              <SectionCard title="Request History Timeline">
                <ProfileRequestTimeline items={data.history || []} />
              </SectionCard>
            </div>
            <div className="ndm-two-col__side">
              <ProfileRequestActionPanel request={data} onApprove={() => setModal('approve')} onReject={() => setModal('reject')} onBack={() => navigate('/admin/profile-update-requests')} />
            </div>
          </PageSection>
        ) : null}
      </PageContainer>

      <ApproveProfileRequestModal open={modal === 'approve'} request={data} busy={Boolean(busyAction)} onClose={() => setModal('')} onSubmit={(payload) => run('approve', data.id, payload)} />
      <RejectProfileRequestModal open={modal === 'reject'} request={data} busy={Boolean(busyAction)} onClose={() => setModal('')} onSubmit={(payload) => run('reject', data.id, payload)} />
    </AdminContentWrapper>
  );
}
