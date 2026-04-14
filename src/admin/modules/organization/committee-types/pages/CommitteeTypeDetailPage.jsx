import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import InfoGrid from '../../../membership/shared/components/InfoGrid';
import { ErrorState } from '../../../membership/shared/components/PageStates';
import InfoSectionCard from '../../shared/components/InfoSectionCard';
import CommitteeTypeForm from '../components/CommitteeTypeForm';
import { useCommitteeTypeActions, useCommitteeTypeDetail } from '../hooks/useCommitteeTypes';

export default function CommitteeTypeDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [editing, setEditing] = useState(false);
  const { data, loading, error, reload } = useCommitteeTypeDetail(id);
  const { run, busyAction, actionError } = useCommitteeTypeActions(() => { setEditing(false); reload(); });

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title="Committee Type Detail"
          subtitle="Inspect committee type identity and hierarchy order."
          breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Organization' }, { label: 'Committee Types', path: '/admin/committee-types' }, { label: 'Committee Type Detail' }]}
        />

        {loading ? <div className="ndm-state ndm-state--loading"><div className="ndm-skeleton" /><div className="ndm-skeleton" /></div> : null}
        {error ? <ErrorState message={error} onRetry={reload} /> : null}
        {actionError ? <ErrorState message={actionError} onRetry={reload} /> : null}

        {data ? (
          <PageSection>
            <InfoSectionCard title={data.name} subtitle="Committee level definition">
              <InfoGrid items={[
                { label: 'Slug', value: data.slug },
                { label: 'Code', value: data.code },
                { label: 'Hierarchy Order', value: data.hierarchy_order },
                { label: 'Description', value: data.description },
                { label: 'Status', value: data.is_active ? 'Active' : 'Inactive' },
              ]} />
              <div className="ndm-modal__actions org-form__actions">
                <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => navigate('/admin/committee-types')}>Back</button>
                <button type="button" className="ndm-btn ndm-btn--primary" onClick={() => setEditing((current) => !current)}>{editing ? 'Close Edit' : 'Edit Type'}</button>
              </div>
            </InfoSectionCard>

            {editing ? (
              <InfoSectionCard title="Edit Committee Type">
                <CommitteeTypeForm
                  initialValues={data}
                  busy={Boolean(busyAction)}
                  onCancel={() => setEditing(false)}
                  onSubmit={(payload) => run('update', data.id, payload)}
                />
              </InfoSectionCard>
            ) : null}
          </PageSection>
        ) : null}
      </PageContainer>
    </AdminContentWrapper>
  );
}
