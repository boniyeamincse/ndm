import { useNavigate, useParams } from 'react-router-dom';
import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import { ErrorState, LoadingSkeleton } from '../../../membership/shared/components/PageStates';
import { useRoleDetail } from '../hooks/useRoles';

function groupPermissions(permissions = []) {
  return permissions.reduce((acc, permission) => {
    const key = permission.module || 'system';
    if (!acc[key]) acc[key] = [];
    acc[key].push(permission);
    return acc;
  }, {});
}

export default function RoleDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, loading, error, reload } = useRoleDetail(id);

  const grouped = groupPermissions(data?.permissions || []);

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title={data?.display_name || data?.name || 'Role Details'}
          subtitle="Role overview, assigned permissions, and linked users."
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'System' },
            { label: 'Roles', path: '/admin/roles' },
            { label: data?.name || 'Detail' },
          ]}
          actions={<button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => navigate('/admin/roles')}>Back</button>}
        />

        {error ? <ErrorState message={error} onRetry={reload} /> : null}
        {loading ? <LoadingSkeleton rows={8} /> : null}

        {!loading && !error && data ? (
          <>
            <PageSection>
              <div className="ndm-grid ndm-grid--2">
                <article className="ndm-card">
                  <header className="ndm-card__header"><h3>Basic Information</h3></header>
                  <div className="ndm-card__body">
                    <p><strong>Name:</strong> {data.name}</p>
                    <p><strong>Display Name:</strong> {data.display_name || data.name}</p>
                    <p><strong>Description:</strong> {data.description || '—'}</p>
                    <p><strong>Type:</strong> {data.is_system_role ? 'System Role' : 'Custom Role'}</p>
                    <p><strong>Permissions:</strong> {data.permissions_count}</p>
                    <p><strong>Users:</strong> {data.users_count}</p>
                  </div>
                </article>

                <article className="ndm-card">
                  <header className="ndm-card__header"><h3>Users With This Role</h3></header>
                  <div className="ndm-card__body">
                    {(data.users || []).length === 0 ? <p>No users assigned.</p> : (
                      <ul className="ndm-simple-list">
                        {data.users.map((user) => <li key={user.id}>{user.name} ({user.email})</li>)}
                      </ul>
                    )}
                  </div>
                </article>
              </div>
            </PageSection>

            <PageSection>
              <article className="ndm-card">
                <header className="ndm-card__header"><h3>Assigned Permissions</h3></header>
                <div className="ndm-card__body">
                  {Object.keys(grouped).length === 0 ? <p>No permissions assigned.</p> : (
                    Object.entries(grouped).map(([group, permissions]) => (
                      <section key={group} className="ndm-permission-group">
                        <h4>{group}</h4>
                        <div className="ndm-chip-list">
                          {permissions.map((permission) => (
                            <span key={permission.id} className="ndm-badge ndm-badge--muted">{permission.label || permission.name}</span>
                          ))}
                        </div>
                      </section>
                    ))
                  )}
                </div>
              </article>
            </PageSection>
          </>
        ) : null}
      </PageContainer>
    </AdminContentWrapper>
  );
}
