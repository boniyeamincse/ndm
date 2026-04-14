import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import SectionCard from '../../shared/components/SectionCard';
import Timeline from '../../shared/components/Timeline';
import InfoGrid from '../../shared/components/InfoGrid';
import { ErrorState, LoadingSkeleton } from '../../shared/components/PageStates';
import ApplicationOverviewCard from '../components/ApplicationOverviewCard';
import ApplicationActionPanel from '../components/ApplicationActionPanel';
import ApplicationActionModal from '../components/ApplicationActionModal';
import { useMembershipApplicationActions, useMembershipApplicationDetail } from '../hooks/useMembershipApplications';

export default function MembershipApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modal, setModal] = useState({ action: '', item: null });

  const { data, loading, error, reload } = useMembershipApplicationDetail(id);
  const { run, busyAction, actionError } = useMembershipApplicationActions(() => {
    setModal({ action: '', item: null });
    reload();
  });

  async function handleModalSubmit(action, payload) {
    await run(action, data.id, payload);
  }

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title="Membership Application Details"
          subtitle="Review applicant profile, workflow history, and decision actions."
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Membership', path: '/admin/membership-applications' },
            { label: 'Application Details' },
          ]}
          actions={
            <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => navigate(-1)}>
              Back
            </button>
          }
        />

        {loading ? <LoadingSkeleton rows={10} /> : null}
        {error ? <ErrorState message={error} onRetry={reload} /> : null}
        {actionError ? <ErrorState message={actionError} onRetry={reload} /> : null}

        {data && !loading ? (
          <PageSection className="ndm-two-col">
            <div className="ndm-two-col__main">
              <ApplicationOverviewCard entity={data} />

              <SectionCard title="Identity & Contact">
                <InfoGrid
                  items={[
                    { label: 'Full Name', value: data.full_name },
                    { label: 'Email', value: data.email },
                    { label: 'Mobile', value: data.mobile },
                    { label: 'Father Name', value: data.father_name },
                    { label: 'Mother Name', value: data.mother_name },
                    { label: 'Gender', value: data.gender },
                    { label: 'National ID', value: data.national_id },
                  ]}
                />
              </SectionCard>

              <SectionCard title="Academic & Address">
                <InfoGrid
                  items={[
                    { label: 'Institution', value: data.educational_institution },
                    { label: 'Department', value: data.department },
                    { label: 'Academic Year', value: data.academic_year },
                    { label: 'District', value: data.district_name },
                    { label: 'Division', value: data.division_name },
                    { label: 'Address', value: data.address_line },
                    { label: 'Emergency Contact', value: `${data.emergency_contact_name || ''} ${data.emergency_contact_phone || ''}`.trim() },
                  ]}
                />
              </SectionCard>

              <SectionCard title="Motivation">
                <p>{data.motivation || 'No motivation text provided.'}</p>
              </SectionCard>

              <SectionCard title="History Timeline">
                <Timeline items={data.status_history || []} />
              </SectionCard>
            </div>

            <div className="ndm-two-col__side">
              <ApplicationActionPanel entity={data} onAction={(action, item) => setModal({ action, item })} />
            </div>
          </PageSection>
        ) : null}
      </PageContainer>

      <ApplicationActionModal
        action={modal.action}
        entity={modal.item}
        busy={Boolean(busyAction)}
        onClose={() => setModal({ action: '', item: null })}
        onSubmit={handleModalSubmit}
      />
    </AdminContentWrapper>
  );
}
