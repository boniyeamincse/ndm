import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import { ErrorState } from '../../../membership/shared/components/PageStates';
import CommitteeForm from '../components/CommitteeForm';
import { useCommitteeActions, useCommitteeDetail } from '../hooks/useCommittees';
import { committeeTypesService } from '../../committee-types/services/committeeTypesService';

export default function CommitteeFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { data, loading, error } = useCommitteeDetail(id);
  const [committeeTypeOptions, setCommitteeTypeOptions] = useState([]);
  const { run, busyAction, actionError } = useCommitteeActions(() => {
    navigate(isEdit ? `/admin/committees/${id}` : '/admin/committees');
  });

  useEffect(() => {
    let alive = true;

    async function loadCommitteeTypes() {
      try {
        const res = await committeeTypesService.list({ per_page: 100, sort_by: 'hierarchy_order', sort_dir: 'asc' });
        if (alive) {
          setCommitteeTypeOptions(res.items || []);
        }
      } catch {
        if (alive) {
          setCommitteeTypeOptions([]);
        }
      }
    }

    loadCommitteeTypes();
    return () => {
      alive = false;
    };
  }, []);

  function handleSubmit(payload) {
    run(isEdit ? 'update' : 'create', id, payload);
  }

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title={isEdit ? 'Edit Committee' : 'Create Committee'}
          subtitle={isEdit ? 'Update committee structure, location, and term fields.' : 'Create a new committee with structure and approval metadata.'}
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Organization' },
            { label: 'Committees', path: '/admin/committees' },
            { label: isEdit ? 'Edit Committee' : 'Create Committee' },
          ]}
        />

        <PageSection>
          {loading && isEdit ? <div className="ndm-state ndm-state--loading"><div className="ndm-skeleton" /><div className="ndm-skeleton" /><div className="ndm-skeleton" /></div> : null}
          {error ? <ErrorState message={error} onRetry={() => navigate('/admin/committees')} /> : null}
          {actionError ? <ErrorState message={actionError} onRetry={() => {}} /> : null}
          {!loading || !isEdit ? (
            <CommitteeForm
              initialValues={data}
              committeeTypeOptions={committeeTypeOptions}
              busy={Boolean(busyAction)}
              onCancel={() => navigate(isEdit ? `/admin/committees/${id}` : '/admin/committees')}
              onSubmit={handleSubmit}
            />
          ) : null}
        </PageSection>
      </PageContainer>
    </AdminContentWrapper>
  );
}
