import { useEffect, useMemo, useState } from 'react';
import { RefreshCcw, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import { EmptyState, ErrorState, LoadingSkeleton } from '../../../membership/shared/components/PageStates';
import SummaryStatCard from '../../../membership/shared/components/SummaryStatCard';
import { usePermissionsGrouped } from '../hooks/usePermissions';

function getPermissionAction(permissionName = '') {
  const parts = String(permissionName).split('.');
  return parts[parts.length - 1] || 'unknown';
}

export default function PermissionsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeModule, setActiveModule] = useState('all');
  const [selectedPermissionId, setSelectedPermissionId] = useState(null);
  const { grouped, loading, error, reload } = usePermissionsGrouped();

  const moduleEntries = useMemo(
    () => Object.entries(grouped).sort(([left], [right]) => left.localeCompare(right)),
    [grouped],
  );

  const allPermissions = useMemo(
    () => moduleEntries.flatMap(([, permissions]) => permissions),
    [moduleEntries],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const scopedEntries = activeModule === 'all'
      ? moduleEntries
      : moduleEntries.filter(([group]) => group === activeModule);

    if (!query) {
      return Object.fromEntries(scopedEntries);
    }

    return scopedEntries.reduce((acc, [group, permissions]) => {
      const hits = permissions.filter((permission) => (
        String(permission.name || '').toLowerCase().includes(query)
        || String(permission.label || '').toLowerCase().includes(query)
        || String(group || '').toLowerCase().includes(query)
      ));
      if (hits.length) acc[group] = hits;
      return acc;
    }, {});
  }, [activeModule, moduleEntries, search]);

  const modules = Object.entries(filtered);
  const visiblePermissions = useMemo(
    () => modules.flatMap(([, permissions]) => permissions),
    [modules],
  );

  const selectedPermission = useMemo(
    () => visiblePermissions.find((permission) => permission.id === selectedPermissionId) || visiblePermissions[0] || null,
    [selectedPermissionId, visiblePermissions],
  );

  const stats = useMemo(() => {
    const actionSet = new Set(allPermissions.map((permission) => getPermissionAction(permission.name)));

    return {
      totalPermissions: allPermissions.length,
      totalModules: moduleEntries.length,
      actionTypes: actionSet.size,
      visibleResults: visiblePermissions.length,
    };
  }, [allPermissions, moduleEntries.length, visiblePermissions.length]);

  useEffect(() => {
    if (!visiblePermissions.length) {
      setSelectedPermissionId(null);
      return;
    }

    if (!visiblePermissions.some((permission) => permission.id === selectedPermissionId)) {
      setSelectedPermissionId(visiblePermissions[0].id);
    }
  }, [selectedPermissionId, visiblePermissions]);

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title="Permissions"
          subtitle="Browse system access rules by module, action, and permission code."
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'System' },
            { label: 'Permissions' },
          ]}
          actions={(
            <>
              <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => navigate('/admin/roles')}>
                <ShieldCheck size={16} /> View Roles
              </button>
              <button type="button" className="ndm-btn ndm-btn--ghost" onClick={reload}>
                <RefreshCcw size={16} /> Refresh
              </button>
            </>
          )}
        />

        <section className="ndm-summary-grid">
          <SummaryStatCard title="Total Permissions" value={stats.totalPermissions} tone="neutral" />
          <SummaryStatCard title="Permission Modules" value={stats.totalModules} tone="info" />
          <SummaryStatCard title="Action Types" value={stats.actionTypes} tone="success" />
          <SummaryStatCard title="Visible Results" value={stats.visibleResults} tone="warning" />
        </section>

        <PageSection>
          <div className="ndm-filter-toolbar">
            <input
              className="ndm-filter-toolbar__search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search permission"
            />
            <select
              className="ndm-input"
              value={activeModule}
              onChange={(event) => setActiveModule(event.target.value)}
            >
              <option value="all">All Modules</option>
              {moduleEntries.map(([group, permissions]) => (
                <option key={group} value={group}>{group} ({permissions.length})</option>
              ))}
            </select>
            <button
              type="button"
              className="ndm-btn ndm-btn--ghost"
              onClick={() => {
                setSearch('');
                setActiveModule('all');
              }}
            >
              Reset
            </button>
          </div>

          {error ? <ErrorState message={error} onRetry={reload} /> : null}
          {loading ? <LoadingSkeleton rows={8} /> : null}
          {!loading && !error && modules.length === 0 ? <EmptyState title="No permissions found" subtitle="Try another search term." /> : null}

          {!loading && !error && modules.length > 0 ? (
            <div className="ndm-permissions-layout">
              <aside className="ndm-permissions-sidebar">
                <article className="ndm-card">
                  <header className="ndm-card__header">
                    <h3>Modules</h3>
                  </header>
                  <div className="ndm-card__body ndm-permissions-module-list">
                    <button
                      type="button"
                      className={`ndm-permissions-module-btn ${activeModule === 'all' ? 'ndm-permissions-module-btn--active' : ''}`}
                      onClick={() => setActiveModule('all')}
                    >
                      <span>All Modules</span>
                      <span>{stats.totalPermissions}</span>
                    </button>
                    {moduleEntries.map(([group, permissions]) => (
                      <button
                        type="button"
                        key={group}
                        className={`ndm-permissions-module-btn ${activeModule === group ? 'ndm-permissions-module-btn--active' : ''}`}
                        onClick={() => setActiveModule(group)}
                      >
                        <span>{group}</span>
                        <span>{permissions.length}</span>
                      </button>
                    ))}
                  </div>
                </article>

                <article className="ndm-card">
                  <header className="ndm-card__header">
                    <h3>Permission Details</h3>
                  </header>
                  <div className="ndm-card__body">
                    {selectedPermission ? (
                      <div className="ndm-permissions-detail">
                        <div className="ndm-permissions-detail__label">Display Label</div>
                        <div className="ndm-permissions-detail__value">{selectedPermission.label || selectedPermission.name}</div>
                        <div className="ndm-permissions-detail__grid">
                          <div>
                            <div className="ndm-permissions-detail__label">Module</div>
                            <div className="ndm-permissions-detail__code">{selectedPermission.module}</div>
                          </div>
                          <div>
                            <div className="ndm-permissions-detail__label">Action</div>
                            <div className="ndm-permissions-detail__code">{getPermissionAction(selectedPermission.name)}</div>
                          </div>
                        </div>
                        <div className="ndm-permissions-detail__label">Permission Code</div>
                        <code className="ndm-permissions-detail__code">{selectedPermission.name}</code>
                      </div>
                    ) : (
                      <p className="ndm-permissions-empty">Select a permission to inspect its details.</p>
                    )}
                  </div>
                </article>
              </aside>

              <div className="ndm-permissions-content">
                {modules.map(([group, permissions]) => (
                  <article className="ndm-card" key={group}>
                    <header className="ndm-card__header ndm-card__header--split">
                      <div>
                        <h3>{group}</h3>
                        <p>{permissions.length} permissions in this module</p>
                      </div>
                      <span className="ndm-permissions-count">{permissions.length}</span>
                    </header>
                    <div className="ndm-card__body ndm-permissions-list">
                      {permissions.map((permission) => (
                        <button
                          type="button"
                          key={permission.id}
                          className={`ndm-permissions-item ${selectedPermission?.id === permission.id ? 'ndm-permissions-item--active' : ''}`}
                          onClick={() => setSelectedPermissionId(permission.id)}
                        >
                          <div className="ndm-permissions-item__main">
                            <strong>{permission.label || permission.name}</strong>
                            <span>{permission.name}</span>
                          </div>
                          <span className="ndm-permissions-item__action">{getPermissionAction(permission.name)}</span>
                        </button>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </PageSection>
      </PageContainer>
    </AdminContentWrapper>
  );
}
