import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Briefcase, Network } from 'lucide-react';
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

function fmt(value) {
  return value || '—';
}

function fmtDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-BD', { year: 'numeric', month: 'long', day: '2-digit' });
}

function fmtDateTime(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-BD');
}

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
          title={data ? data.full_name : 'Member Details'}
          subtitle="Full profile - personal info, contact, assignments, status history."
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Members', path: '/admin/members' },
            { label: data?.member_no || 'Detail' },
          ]}
          actions={(
            <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => navigate(-1)}>
              <ArrowLeft size={15} /> Back
            </button>
          )}
        />

        {loading ? <LoadingSkeleton rows={10} /> : null}
        {error ? <ErrorState message={error} onRetry={reload} /> : null}
        {actionError ? <ErrorState message={actionError} /> : null}

        {data && !loading ? (
          <PageSection className="ndm-two-col">
            <div className="ndm-two-col__main">
              <MemberOverviewCard entity={data} />

              <SectionCard title="Personal Information" subtitle="Basic identity and family details.">
                <InfoGrid items={[
                  { label: 'Full Name', value: fmt(data.full_name) },
                  { label: 'Gender', value: fmt(data.gender) },
                  { label: 'Date of Birth', value: fmtDate(data.date_of_birth) },
                  { label: 'Blood Group', value: fmt(data.blood_group) },
                  { label: "Father's Name", value: fmt(data.father_name) },
                  { label: "Mother's Name", value: fmt(data.mother_name) },
                ]} />
                {data.bio ? (
                  <div className="mem-bio-block">
                    <dt className="mem-bio-block__label">Bio</dt>
                    <dd className="mem-bio-block__text">{data.bio}</dd>
                  </div>
                ) : null}
              </SectionCard>

              <SectionCard title="Contact Information" subtitle="Primary and emergency contact details.">
                <InfoGrid items={[
                  { label: 'Email', value: fmt(data.email) },
                  { label: 'Mobile', value: fmt(data.mobile) },
                  { label: 'Emergency Contact Name', value: fmt(data.emergency_contact?.name) },
                  { label: 'Emergency Phone', value: fmt(data.emergency_contact?.phone) },
                ]} />
              </SectionCard>

              <SectionCard title="Academic & Professional" subtitle="Education and occupation details.">
                <InfoGrid items={[
                  { label: 'Institution', value: fmt(data.educational_institution) },
                  { label: 'Department', value: fmt(data.department) },
                  { label: 'Academic Year', value: fmt(data.academic_year) },
                  { label: 'Occupation', value: fmt(data.occupation) },
                ]} />
              </SectionCard>

              <SectionCard title="Address Information" subtitle="Geographic and postal address.">
                <InfoGrid items={[
                  { label: 'Address Line', value: fmt(data.address?.address_line) },
                  { label: 'Village / Area', value: fmt(data.address?.village_area) },
                  { label: 'Post Office', value: fmt(data.address?.post_office) },
                  { label: 'Union', value: fmt(data.address?.union_name) },
                  { label: 'Upazila', value: fmt(data.address?.upazila_name) },
                  { label: 'District', value: fmt(data.address?.district_name) },
                  { label: 'Division', value: fmt(data.address?.division_name) },
                ]} />
              </SectionCard>

              <SectionCard title="Organisation Information" subtitle="Membership record and linked account.">
                <InfoGrid items={[
                  { label: 'Member No', value: fmt(data.member_no) },
                  { label: 'Current Status', value: fmt(data.status) },
                  { label: 'Joined Date', value: fmtDateTime(data.joined_at) },
                  { label: 'Approved Date', value: fmtDateTime(data.approved_at) },
                  { label: 'Linked Account', value: data.user ? `${data.user.name} (${data.user.status})` : 'Not Linked' },
                  { label: 'Last Login', value: data.user?.last_login_at ? fmtDateTime(data.user.last_login_at) : '—' },
                  { label: 'Source Application', value: data.application ? `${data.application.application_no} (${data.application.status})` : '—' },
                ]} />
              </SectionCard>

              <SectionCard title="Committee Assignments Summary" subtitle="Current assignments, leadership roles and reporting structure.">
                <InfoGrid items={[
                  { label: 'Total Assignments', value: fmt(data.assignments_count) },
                  { label: 'Leadership Assignments', value: fmt(data.leadership_assignments_count) },
                  { label: 'Primary Assignment', value: data.assignments_summary || '—' },
                  { label: 'Leadership Summary', value: fmt(data.leadership_summary) },
                ]} />
                <div className="mem-assignment-links">
                  <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => navigate('/admin/committee-assignments')}>
                    <Briefcase size={14} /> View Full Assignments
                  </button>
                  <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => navigate('/admin/reporting-hierarchy')}>
                    <Network size={14} /> View Hierarchy
                  </button>
                </div>
              </SectionCard>

              <SectionCard title="Reporting Hierarchy Summary" subtitle="Leader and subordinate chain summary.">
                <InfoGrid items={[
                  { label: 'Reporting Leader', value: fmt(data.leader_summary) },
                  { label: 'Subordinate Count', value: fmt(data.subordinates_count) },
                  { label: 'Hierarchy Note', value: fmt(data.subordinates_summary) },
                ]} />
              </SectionCard>

              <SectionCard title="Status History" subtitle="Chronological record of all membership status changes.">
                {data.status_histories?.length > 0 ? (
                  <Timeline items={data.status_histories} statusKey="new_status" />
                ) : (
                  <p className="mem-empty-section">No status history recorded yet.</p>
                )}
              </SectionCard>
            </div>

            <div className="ndm-two-col__side">
              <MemberActionPanel
                member={data}
                onEdit={(member) => setEditTarget(member)}
                onStatus={(member, status) => setStatusTarget({ member, status })}
                onViewAssignments={() => navigate('/admin/committee-assignments')}
                onViewHierarchy={() => navigate('/admin/reporting-hierarchy')}
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
        onSubmit={(payload) => updateProfile((editTarget || data)?.id, payload)}
      />
    </AdminContentWrapper>
  );
}
