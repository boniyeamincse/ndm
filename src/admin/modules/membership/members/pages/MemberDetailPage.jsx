import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import SectionCard from '../../shared/components/SectionCard';
import InfoGrid from '../../shared/components/InfoGrid';
import Timeline from '../../shared/components/Timeline';
import { ErrorState, LoadingSkeleton } from '../../shared/components/PageStates';
import MemberOverviewCard from '../components/MemberOverviewCard';
import MemberActionPanel from '../components/MemberActionPanel';
import UpdateMemberStatusModal from '../components/UpdateMemberStatusModal';
import EditMemberModal from '../components/EditMemberModal';
import { useMemberActions, useMemberDetail } from '../hooks/useMembers';

export default function MemberDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [editTarget, setEditTarget] = useState(null);
  const [statusTarget, setStatusTarget] = useState({ member: null, status: '' });

  const { data, loading, error, reload } = useMemberDetail(id);
  const { busyAction, actionError, updateProfile, updateStatus } = useMemberActions(() => {
    setEditTarget(null);
    setStatusTarget({ member: null, status: '' });
    reload();
  });

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title="Member Details"
          subtitle="Profile, status timeline, assignments and leadership snapshot."
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Members', path: '/admin/members' },
            { label: 'Member Details' },
          ]}
          actions={<button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => navigate(-1)}>Back</button>}
        />

        {loading ? <LoadingSkeleton rows={10} /> : null}
        {error ? <ErrorState message={error} onRetry={reload} /> : null}
        {actionError ? <ErrorState message={actionError} onRetry={reload} /> : null}

        {data && !loading ? (
          <PageSection className="ndm-two-col">
            <div className="ndm-two-col__main">
              <MemberOverviewCard entity={data} />

              <SectionCard title="Personal & Contact">
                <InfoGrid
                  items={[
                    { label: 'Full Name', value: data.full_name },
                    { label: 'Email', value: data.email },
                    { label: 'Mobile', value: data.mobile },
                    { label: 'Gender', value: data.gender },
                    { label: 'Date of Birth', value: data.date_of_birth },
                    { label: 'Blood Group', value: data.blood_group },
                    { label: 'Emergency Contact', value: `${data.emergency_contact?.name || ''} ${data.emergency_contact?.phone || ''}`.trim() },
                  ]}
                />
              </SectionCard>

              <SectionCard title="Academic & Address">
                <InfoGrid
                  items={[
                    { label: 'Institution', value: data.educational_institution },
                    { label: 'Department', value: data.department },
                    { label: 'Academic Year', value: data.academic_year },
                    { label: 'District', value: data.address?.district },
                    { label: 'Division', value: data.address?.division },
                    { label: 'Address', value: data.address?.address_line },
                  ]}
                />
              </SectionCard>

              <SectionCard title="Committee & Leadership Summary">
                <InfoGrid
                  items={[
                    { label: 'Committee Assignments', value: data.assignments_summary || 'Available from committee assignments module' },
                    { label: 'Leadership Summary', value: data.leadership_summary || 'No leadership assignment' },
                    { label: 'Reporting Leader', value: data.leader_summary || 'No leader configured' },
                    { label: 'Subordinates', value: data.subordinates_summary || 'No subordinate data' },
                  ]}
                />
              </SectionCard>

              <SectionCard title="Status History Timeline">
                <Timeline items={data.status_histories || []} statusKey="new_status" />
              </SectionCard>
            </div>

            <div className="ndm-two-col__side">
              <MemberActionPanel
                member={data}
                onEdit={(member) => setEditTarget(member)}
                onStatus={(member, status) => setStatusTarget({ member, status })}
                onViewAssignments={() => navigate('/admin/committee-member-assignments')}
                onViewHierarchy={() => navigate('/admin/member-reporting-relations')}
              />
            </div>
          </PageSection>
        ) : null}
      </PageContainer>

      <UpdateMemberStatusModal
        member={statusTarget.member}
        targetStatus={statusTarget.status}
        busy={busyAction === 'status'}
        onClose={() => setStatusTarget({ member: null, status: '' })}
        onSubmit={(payload) => updateStatus(statusTarget.member.id, payload)}
      />

      <EditMemberModal
        member={editTarget || data}
        busy={busyAction === 'update'}
        onClose={() => setEditTarget(null)}
        onSubmit={(payload) => updateProfile((editTarget || data).id, payload)}
      />
    </AdminContentWrapper>
  );
}
