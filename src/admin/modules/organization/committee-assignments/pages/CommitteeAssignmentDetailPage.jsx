import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import InfoGrid from '../../../membership/shared/components/InfoGrid';
import { ErrorState } from '../../../membership/shared/components/PageStates';
import AssignmentStatusBadge from '../../shared/components/AssignmentStatusBadge';
import AssignmentTypeBadge from '../../shared/components/AssignmentTypeBadge';
import InfoSectionCard from '../../shared/components/InfoSectionCard';
import StatusTimeline from '../../shared/components/StatusTimeline';
import TransferAssignmentModal from '../components/TransferAssignmentModal';
import { useCommitteeAssignmentActions, useCommitteeAssignmentDetail } from '../hooks/useCommitteeAssignments';

export default function CommitteeAssignmentDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [transferOpen, setTransferOpen] = useState(false);
  const { data, loading, error, reload } = useCommitteeAssignmentDetail(id);
  const { run, busyAction, actionError } = useCommitteeAssignmentActions(() => { setTransferOpen(false); reload(); });

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title="Committee Assignment Detail"
          subtitle="Review assignment placement, position, dates, and transfer history."
          breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Organization' }, { label: 'Committee Assignments', path: '/admin/committee-assignments' }, { label: 'Assignment Detail' }]}
        />
        {loading ? <div className="ndm-state ndm-state--loading"><div className="ndm-skeleton" /><div className="ndm-skeleton" /></div> : null}
        {error ? <ErrorState message={error} onRetry={reload} /> : null}
        {actionError ? <ErrorState message={actionError} onRetry={reload} /> : null}
        {data ? (
          <PageSection className="ndm-two-col">
            <div className="ndm-two-col__main">
              <InfoSectionCard title={data.assignment_no} subtitle="Assignment overview">
                <div className="org-overview-head__badges">
                  <AssignmentTypeBadge value={data.assignment_type} />
                  <AssignmentStatusBadge value={data.status || (data.is_active ? 'active' : 'inactive')} />
                  {data.is_primary ? <span className="org-pill org-pill--green">Primary</span> : null}
                  {data.is_leadership ? <span className="org-pill org-pill--red">Leadership</span> : null}
                </div>
                <InfoGrid items={[
                  { label: 'Member', value: `${data.member_name} ${data.member_no ? `(${data.member_no})` : ''}`.trim() },
                  { label: 'Committee', value: data.committee_name },
                  { label: 'Position', value: data.position_name },
                  { label: 'Start Date', value: data.start_date },
                  { label: 'End Date', value: data.end_date || 'Present' },
                  { label: 'Appointed By', value: data.appointed_by_name || data.appointed_by },
                  { label: 'Approved By', value: data.approved_by_name || data.approved_by },
                  { label: 'Note', value: data.note },
                ]} />
              </InfoSectionCard>

              <InfoSectionCard title="Assignment History Timeline">
                <StatusTimeline items={data.assignment_history || data.history || []} />
              </InfoSectionCard>

              <InfoSectionCard title="Position History Timeline">
                <StatusTimeline items={data.position_history || []} />
              </InfoSectionCard>
            </div>
            <div className="ndm-two-col__side">
              <aside className="ndm-action-panel org-action-panel">
                <h4>Assignment Actions</h4>
                <div className="ndm-action-panel__grid">
                  <button type="button" className="ndm-btn ndm-btn--primary" onClick={() => navigate(`/admin/committee-assignments/${id}/edit`)}>Edit Assignment</button>
                  <button type="button" className="ndm-btn ndm-btn--warning" onClick={() => run('status', data.id, { status: data.status === 'active' ? 'inactive' : 'active' })}>Change Status</button>
                  <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => setTransferOpen(true)}>Transfer Assignment</button>
                </div>
              </aside>
            </div>
          </PageSection>
        ) : null}
      </PageContainer>

      <TransferAssignmentModal assignment={transferOpen ? data : null} busy={busyAction === 'transfer'} onClose={() => setTransferOpen(false)} onSubmit={(payload) => run('transfer', data.id, payload)} />
    </AdminContentWrapper>
  );
}
