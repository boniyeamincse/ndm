import { useEffect, useState } from 'react';
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
import { positionsService } from '../../positions/services/positionsService';

function buildCommitteeAssignmentLink(committee, position = null) {
  const params = new URLSearchParams({
    committee_id: String(committee.id),
    committee_name: committee.name || '',
    committee_type_id: String(committee.committee_type_id || ''),
    committee_type_name: committee.committee_type_name || '',
  });

  if (position?.id) {
    params.set('position_id', String(position.id));
    params.set('position_name', position.name || '');
  }

  return `/admin/committee-assignments/create?${params.toString()}`;
}

function buildPositionCreateLink(committee) {
  const params = new URLSearchParams({
    committee_id: String(committee.id),
    committee_name: committee.name || '',
    committee_type_id: String(committee.committee_type_id || ''),
    committee_type_name: committee.committee_type_name || '',
  });

  return `/admin/positions/create?${params.toString()}`;
}

export default function CommitteeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [statusTarget, setStatusTarget] = useState(null);
  const [relatedPositions, setRelatedPositions] = useState([]);
  const [positionsLoading, setPositionsLoading] = useState(false);
  const { data, loading, error, reload } = useCommitteeDetail(id);
  const { run, busyAction, actionError } = useCommitteeActions(() => {
    setStatusTarget(null);
    reload();
  });

  useEffect(() => {
    let active = true;

    async function loadRelatedPositions() {
      if (!data?.committee_type_id) {
        setRelatedPositions([]);
        return;
      }

      setPositionsLoading(true);
      try {
        const result = await positionsService.list({
          committee_type_id: data.committee_type_id,
          is_active: true,
          per_page: 8,
          sort_by: 'hierarchy_rank',
          sort_dir: 'asc',
        });

        if (active) {
          setRelatedPositions(result.items);
        }
      } catch {
        if (active) {
          setRelatedPositions([]);
        }
      } finally {
        if (active) {
          setPositionsLoading(false);
        }
      }
    }

    loadRelatedPositions();

    return () => {
      active = false;
    };
  }, [data?.committee_type_id]);

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

              <InfoSectionCard title="Committee Positions" subtitle="Create positions for this committee type and assign members directly into them.">
                {positionsLoading ? <div className="ndm-state ndm-state--loading"><div className="ndm-skeleton" /></div> : null}
                {!positionsLoading && relatedPositions.length === 0 ? (
                  <div className="org-inline-empty">
                    <p>No active positions are mapped to this committee type yet.</p>
                    <button type="button" className="ndm-btn ndm-btn--primary" onClick={() => navigate(buildPositionCreateLink(data))}>Create First Position</button>
                  </div>
                ) : null}

                {!positionsLoading && relatedPositions.length > 0 ? (
                  <div className="org-position-list">
                    {relatedPositions.map((position) => (
                      <article key={position.id} className="org-position-card">
                        <div className="org-position-card__head">
                          <div>
                            <h4>{position.name}</h4>
                            <div className="org-position-code">{position.code || 'No code'}</div>
                          </div>
                          {position.is_leadership ? <span className="org-pill org-pill--red">Leadership</span> : <span className="org-pill org-pill--slate">Position</span>}
                        </div>
                        <div className="org-position-card__stats">
                          <span>Category: {position.category || '—'}</span>
                          <span>Rank: {position.hierarchy_rank || '—'}</span>
                        </div>
                        <div className="org-position-card__actions">
                          <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => navigate(`/admin/positions/${position.id}`)}>View Position</button>
                          <button type="button" className="ndm-btn ndm-btn--primary" onClick={() => navigate(buildCommitteeAssignmentLink(data, position))}>Add Member</button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : null}
              </InfoSectionCard>

              <InfoSectionCard title="Status History Timeline">
                <StatusTimeline items={data.status_history || []} />
              </InfoSectionCard>
            </div>

            <div className="ndm-two-col__side">
              <CommitteeActionPanel
                committee={data}
                onEdit={(committeeId) => navigate(`/admin/committees/${committeeId}/edit`)}
                onAddPosition={(committee) => navigate(buildPositionCreateLink(committee))}
                onAddMember={(committee) => navigate(buildCommitteeAssignmentLink(committee))}
                onViewPositions={(committeeId) => navigate(`/admin/committees/${committeeId}/positions`)}
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
