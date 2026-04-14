import { useNavigate, useParams } from 'react-router-dom';
import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import InfoGrid from '../../../membership/shared/components/InfoGrid';
import { ErrorState } from '../../../membership/shared/components/PageStates';
import InfoSectionCard from '../../shared/components/InfoSectionCard';
import PositionCategoryBadge from '../../shared/components/PositionCategoryBadge';
import PositionScopeBadge from '../../shared/components/PositionScopeBadge';
import StatusTimeline from '../../shared/components/StatusTimeline';
import { usePositionDetail } from '../hooks/usePositions';

export default function PositionDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, loading, error, reload } = usePositionDetail(id);

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title="Position Detail"
          subtitle="Inspect hierarchy rank, scope, mappings, and leadership visibility."
          breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Organization' }, { label: 'Positions', path: '/admin/positions' }, { label: 'Position Detail' }]}
        />
        {loading ? <div className="ndm-state ndm-state--loading"><div className="ndm-skeleton" /><div className="ndm-skeleton" /></div> : null}
        {error ? <ErrorState message={error} onRetry={reload} /> : null}
        {data ? (
          <PageSection>
            <InfoSectionCard title={data.name} subtitle="Position metadata and usage context.">
              <div className="org-overview-head__badges">
                <PositionCategoryBadge value={data.category} />
                <PositionScopeBadge value={data.scope} />
                {data.is_leadership ? <span className="org-pill org-pill--red">Leadership</span> : null}
                {data.is_active ? <span className="org-pill org-pill--green">Active</span> : <span className="org-pill org-pill--slate">Inactive</span>}
              </div>
              <InfoGrid items={[
                { label: 'Short Name', value: data.short_name },
                { label: 'Hierarchy Rank', value: data.hierarchy_rank },
                { label: 'Display Order', value: data.display_order },
                { label: 'Code', value: data.code },
                { label: 'Committee Type Mappings', value: Array.isArray(data.committee_types) ? data.committee_types.join(', ') : '—' },
                { label: 'Description', value: data.description },
              ]} />
              <div className="ndm-modal__actions org-form__actions">
                <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => navigate('/admin/positions')}>Back</button>
                <button type="button" className="ndm-btn ndm-btn--primary" onClick={() => navigate(`/admin/positions/${id}/edit`)}>Edit Position</button>
              </div>
            </InfoSectionCard>

            <InfoSectionCard title="Status History Timeline">
              <StatusTimeline items={data.status_history || []} />
            </InfoSectionCard>
          </PageSection>
        ) : null}
      </PageContainer>
    </AdminContentWrapper>
  );
}
