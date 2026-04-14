import { useNavigate, useParams } from 'react-router-dom';
import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import InfoGrid from '../../../membership/shared/components/InfoGrid';
import { ErrorState } from '../../../membership/shared/components/PageStates';
import HierarchyRelationTypeBadge from '../../shared/components/HierarchyRelationTypeBadge';
import InfoSectionCard from '../../shared/components/InfoSectionCard';
import StatusTimeline from '../../shared/components/StatusTimeline';
import { useReportingRelationDetail } from '../hooks/useReportingHierarchy';

export default function ReportingHierarchyDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, loading, error, reload } = useReportingRelationDetail(id);

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title="Reporting Relation Detail"
          subtitle="Inspect superior-subordinate structure and relation history."
          breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Organization' }, { label: 'Reporting Hierarchy', path: '/admin/reporting-hierarchy' }, { label: 'Relation Detail' }]}
        />
        {loading ? <div className="ndm-state ndm-state--loading"><div className="ndm-skeleton" /><div className="ndm-skeleton" /></div> : null}
        {error ? <ErrorState message={error} onRetry={reload} /> : null}
        {data ? (
          <PageSection>
            <InfoSectionCard title={data.relation_no} subtitle="Hierarchy relation overview.">
              <div className="org-overview-head__badges">
                <HierarchyRelationTypeBadge value={data.relation_type} />
                {data.is_primary ? <span className="org-pill org-pill--green">Primary</span> : null}
                {data.is_active ? <span className="org-pill org-pill--green">Active</span> : <span className="org-pill org-pill--slate">Inactive</span>}
              </div>
              <InfoGrid items={[
                { label: 'Subordinate Assignment', value: data.subordinate_name },
                { label: 'Superior Assignment', value: data.superior_name },
                { label: 'Committee', value: data.committee_name },
                { label: 'Start Date', value: data.start_date },
                { label: 'End Date', value: data.end_date || 'Present' },
                { label: 'Note', value: data.note },
              ]} />
              <div className="ndm-modal__actions org-form__actions">
                <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => navigate('/admin/reporting-hierarchy')}>Back</button>
                <button type="button" className="ndm-btn ndm-btn--primary" onClick={() => navigate(`/admin/reporting-hierarchy/${id}/edit`)}>Edit Relation</button>
              </div>
            </InfoSectionCard>
            <InfoSectionCard title="History Timeline"><StatusTimeline items={data.history || data.status_history || []} /></InfoSectionCard>
          </PageSection>
        ) : null}
      </PageContainer>
    </AdminContentWrapper>
  );
}
