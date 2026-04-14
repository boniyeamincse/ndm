import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import InfoGrid from '../../../membership/shared/components/InfoGrid';
import { ErrorState } from '../../../membership/shared/components/PageStates';
import CommitteeOverviewCard from '../components/CommitteeOverviewCard';
import CommitteeActionPanel from '../components/CommitteeActionPanel';
import CommitteeStatusModal from '../components/CommitteeStatusModal';
import { useCommitteeActions, useCommitteeDetail } from '../hooks/useCommittees';
import InfoSectionCard from '../../shared/components/InfoSectionCard';
import StatusTimeline from '../../shared/components/StatusTimeline';

export default function CommitteeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [statusTarget, setStatusTarget] = useState(null);
  const { data, loading, error, reload } = useCommitteeDetail(id);
  const { run, busyAction, actionError } = useCommitteeActions(() => {
    setStatusTarget(null);
    reload();
  });

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title="Committee Detail"
          subtitle="Inspect committee identity, structure, and operational context."
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Organization' },
            { label: 'Committees', path: '/admin/committees' },
            { label: 'Committee Detail' },
          ]}
        />

        {loading ? <div className="ndm-state ndm-state--loading"><div className="ndm-skeleton" /><div className="ndm-skeleton" /><div className="ndm-skeleton" /></div> : null}
        {error ? <ErrorState message={error} onRetry={reload} /> : null}
        {actionError ? <ErrorState message={actionError} onRetry={reload} /> : null}

        {data ? (
          <PageSection className="ndm-two-col">
            <div className="ndm-two-col__main">
              <CommitteeOverviewCard committee={data} />

              <InfoSectionCard title="Basic Information">
                <InfoGrid items={[
                  { label: 'Committee Name', value: data.name },
                  { label: 'Committee No', value: data.committee_no },
                  { label: 'Committee Type', value: data.committee_type_name },
                  { label: 'Code', value: data.code },
                ]} />
              </InfoSectionCard>

              <InfoSectionCard title="Location Information">
                <InfoGrid items={[
                  { label: 'Division', value: data.division_name },
                  { label: 'District', value: data.district_name },
                  { label: 'Upazila', value: data.upazila_name },
                  { label: 'Union', value: data.union_name },
                  { label: 'Address', value: data.address_line },
                ]} />
              </InfoSectionCard>

              <InfoSectionCard title="Parent / Child Structure">
                <InfoGrid items={[
                  { label: 'Parent Committee', value: data.parent_name || 'Root Committee' },
                  { label: 'Child Committees', value: data.child_committees_count || 0 },
                  { label: 'Current Term', value: data.is_current ? 'Yes' : 'No' },
                ]} />
              </InfoSectionCard>

              <InfoSectionCard title="Office Contact Info">
                <InfoGrid items={[
                  { label: 'Office Phone', value: data.office_phone },
                  { label: 'Office Email', value: data.office_email },
                  { label: 'Description', value: data.description },
                  { label: 'Notes', value: data.notes },
                ]} />
              </InfoSectionCard>

              <InfoSectionCard title="Formation / Approval Info">
                <InfoGrid items={[
                  { label: 'Formed By', value: data.formed_by },
                  { label: 'Approved By', value: data.approved_by },
                  { label: 'Formed At', value: data.formed_at },
                  { label: 'Approved At', value: data.approved_at },
                  { label: 'Start Date', value: data.start_date },
                  { label: 'End Date', value: data.end_date },
                ]} />
              </InfoSectionCard>

              <InfoSectionCard title="Summary Widgets">
                <InfoGrid items={[
                  { label: 'Total Assignments', value: data.total_assignments || 'Placeholder' },
                  { label: 'Office Bearers', value: data.office_bearers_count || 'Placeholder' },
                  { label: 'Child Committees Count', value: data.child_committees_count || 0 },
                ]} />
              </InfoSectionCard>

              <InfoSectionCard title="Status History Timeline">
                <StatusTimeline items={data.status_history || []} />
              </InfoSectionCard>
            </div>

            <div className="ndm-two-col__side">
              <CommitteeActionPanel
                committee={data}
                onEdit={(committeeId) => navigate(`/admin/committees/${committeeId}/edit`)}
                onStatus={(committee) => setStatusTarget(committee)}
                onMembers={(committeeId) => navigate(`/admin/committees/${committeeId}/members`)}
                onHierarchy={(committeeId) => navigate(`/admin/committees/${committeeId}/hierarchy-tree`)}
                onChildren={(committeeId) => navigate(`/admin/committees?parent_id=${committeeId}`)}
              />
            </div>
          </PageSection>
        ) : null}
      </PageContainer>

      <CommitteeStatusModal
        committee={statusTarget}
        busy={busyAction === 'status'}
        onClose={() => setStatusTarget(null)}
        onSubmit={(payload) => run('status', statusTarget.id, payload)}
      />
    </AdminContentWrapper>
  );
}
