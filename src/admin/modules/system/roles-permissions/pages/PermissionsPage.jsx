import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCcw, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import { EmptyState, ErrorState, LoadingSkeleton } from '../../../membership/shared/components/PageStates';
import SummaryStatCard from '../../../membership/shared/components/SummaryStatCard';
import { usePermissionsGrouped } from '../hooks/usePermissions';
import { rolesService } from '../services/rolesService';

function getPermissionAction(permissionName = '') {
  const parts = String(permissionName).split('.');
  return parts[parts.length - 1] || 'unknown';
}

function buildPermissionRoleIndex(roles) {
  const nextPermissionRoles = {};

  roles.forEach((role) => {
    (role.permissions || []).forEach((permission) => {
      if (!nextPermissionRoles[permission.id]) {
        nextPermissionRoles[permission.id] = [];
      }

      nextPermissionRoles[permission.id].push({
        id: role.id,
        name: role.name,
        display_name: role.display_name || role.name,
        is_system_role: role.is_system_role,
      });
    });
  });

  return nextPermissionRoles;
}

export default function PermissionsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeModule, setActiveModule] = useState('all');
  const [selectedPermissionId, setSelectedPermissionId] = useState(null);
  const [allRoles, setAllRoles] = useState([]);
  const [permissionRoles, setPermissionRoles] = useState({});
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState('');
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignRoleIds, setAssignRoleIds] = useState([]);
  const [assignSearch, setAssignSearch] = useState('');
  const [assignBusy, setAssignBusy] = useState(false);
  const [assignError, setAssignError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
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

  const selectedPermissionRoles = useMemo(
    () => (selectedPermission ? permissionRoles[selectedPermission.id] || [] : []),
    [permissionRoles, selectedPermission],
  );

  const assignableRoles = useMemo(() => {
    const query = assignSearch.trim().toLowerCase();

    if (!query) {
      return allRoles;
    }

    return allRoles.filter((role) => (
      String(role.name || '').toLowerCase().includes(query)
      || String(role.display_name || '').toLowerCase().includes(query)
      || String(role.description || '').toLowerCase().includes(query)
    ));
  }, [allRoles, assignSearch]);

  const stats = useMemo(() => {
    const actionSet = new Set(allPermissions.map((permission) => getPermissionAction(permission.name)));
    const permissionsWithRoles = allPermissions.filter((permission) => (permissionRoles[permission.id] || []).length > 0).length;

    return {
      totalPermissions: allPermissions.length,
      totalModules: moduleEntries.length,
      actionTypes: actionSet.size,
      visibleResults: visiblePermissions.length,
      usedByRoles: permissionsWithRoles,
    };
  }, [allPermissions, moduleEntries.length, permissionRoles, visiblePermissions.length]);

  const loadRoleUsage = useCallback(async () => {
    setRolesLoading(true);
    setRolesError('');

    try {
      const firstPage = await rolesService.list({ page: 1, per_page: 100, sort_by: 'name', sort_order: 'asc' });
      let nextRoles = firstPage.items || [];
      const lastPage = firstPage.meta?.last_page || 1;

      if (lastPage > 1) {
        const remainingPages = await Promise.all(
          Array.from({ length: lastPage - 1 }, (_, index) => rolesService.list({
            page: index + 2,
            per_page: 100,
            sort_by: 'name',
            sort_order: 'asc',
          })),
        );

        nextRoles = [
          ...nextRoles,
          ...remainingPages.flatMap((page) => page.items || []),
        ];
      }

      const detailedRoles = await Promise.all(nextRoles.map((role) => rolesService.detail(role.id)));

      setAllRoles(detailedRoles);
      setPermissionRoles(buildPermissionRoleIndex(detailedRoles));
    } catch (loadError) {
      setRolesError(loadError.message || 'Failed to load role usage');
      setAllRoles([]);
      setPermissionRoles({});
    } finally {
      setRolesLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function loadPermissionRoles() {
      try {
        if (!active) {
          return;
        }

        await loadRoleUsage();
      } catch (loadError) {
        if (active) {
          setRolesError(loadError.message || 'Failed to load role usage');
          setAllRoles([]);
          setPermissionRoles({});
        }
      }
    }

    loadPermissionRoles();

    return () => {
      active = false;
    };
  }, [loadRoleUsage]);

  useEffect(() => {
    if (!visiblePermissions.length) {
      setSelectedPermissionId(null);
      return;
    }

    if (!visiblePermissions.some((permission) => permission.id === selectedPermissionId)) {
      setSelectedPermissionId(visiblePermissions[0].id);
    }
  }, [selectedPermissionId, visiblePermissions]);

  useEffect(() => {
    if (!actionSuccess) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setActionSuccess(''), 4000);

    return () => window.clearTimeout(timeoutId);
  }, [actionSuccess]);

  function openAssignModal() {
    if (!selectedPermission) {
      return;
    }

    setAssignRoleIds(selectedPermissionRoles.map((role) => role.id));
    setAssignSearch('');
    setAssignError('');
    setAssignModalOpen(true);
  }

  function toggleAssignedRole(roleId, checked) {
    setAssignRoleIds((current) => {
      const next = new Set(current);
      if (checked) {
        next.add(roleId);
      } else {
        next.delete(roleId);
      }
      return Array.from(next);
    });
  }

  async function saveAssignedRoles() {
    if (!selectedPermission) {
      return;
    }

    setAssignBusy(true);
    setAssignError('');

    try {
      const nextSelected = new Set(assignRoleIds);
      const currentSelected = new Set(selectedPermissionRoles.map((role) => role.id));

      const changedRoles = allRoles.filter((role) => currentSelected.has(role.id) !== nextSelected.has(role.id));

      await Promise.all(changedRoles.map((role) => {
        const existingPermissionIds = (role.permissions || []).map((permission) => permission.id);
        const nextPermissionIds = nextSelected.has(role.id)
          ? Array.from(new Set([...existingPermissionIds, selectedPermission.id]))
          : existingPermissionIds.filter((permissionId) => permissionId !== selectedPermission.id);

        return rolesService.syncPermissions(role.id, nextPermissionIds);
      }));

      await loadRoleUsage();
      setAssignModalOpen(false);
      setActionSuccess(`Permission "${selectedPermission.label || selectedPermission.name}" updated for ${changedRoles.length} role${changedRoles.length === 1 ? '' : 's'}.`);
    } catch (saveError) {
      setAssignError(saveError.message || 'Failed to update role assignments');
    } finally {
      setAssignBusy(false);
    }
  }

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
          <SummaryStatCard title="Permissions In Roles" value={stats.usedByRoles} tone="success" />
          <SummaryStatCard title="Visible Results" value={stats.visibleResults} tone="warning" />
        </section>

        <PageSection>
          {actionSuccess ? <div className="app-toast app-toast--success">{actionSuccess}</div> : null}

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
          {rolesError ? <ErrorState message={rolesError} onRetry={() => window.location.reload()} /> : null}
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
                        <div>
                          <div className="ndm-permissions-role-head">
                            <div className="ndm-permissions-detail__label">Assigned Roles</div>
                            <button
                              type="button"
                              className="ndm-btn ndm-btn--ghost"
                              onClick={openAssignModal}
                              disabled={rolesLoading}
                            >
                              Assign To Roles
                            </button>
                          </div>
                          {rolesLoading ? <p className="ndm-permissions-empty">Loading role usage…</p> : null}
                          {!rolesLoading && selectedPermissionRoles.length === 0 ? (
                            <p className="ndm-permissions-empty">No roles currently include this permission.</p>
                          ) : null}
                          {!rolesLoading && selectedPermissionRoles.length > 0 ? (
                            <div className="ndm-permissions-role-list">
                              {selectedPermissionRoles.map((role) => (
                                <button
                                  type="button"
                                  key={role.id}
                                  className={`ndm-permissions-role-chip ${role.is_system_role ? 'ndm-permissions-role-chip--system' : ''}`}
                                  onClick={() => navigate(`/admin/roles/${role.id}`)}
                                >
                                  {role.display_name}
                                </button>
                              ))}
                            </div>
                          ) : null}
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
                          <div className="ndm-permissions-item__meta">
                            <span className="ndm-permissions-item__roles">{(permissionRoles[permission.id] || []).length} roles</span>
                            <span className="ndm-permissions-item__action">{getPermissionAction(permission.name)}</span>
                          </div>
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

      {assignModalOpen ? (
        <div className="ndm-modal-backdrop" role="dialog" aria-modal="true">
          <div className="ndm-modal ndm-modal--xl">
            <header className="ndm-modal__header">
              <div>
                <h2>Assign Permission To Roles</h2>
                <p className="ndm-permissions-modal__subtitle">{selectedPermission?.label || selectedPermission?.name}</p>
              </div>
              <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => setAssignModalOpen(false)}>Close</button>
            </header>

            <div className="ndm-modal__body">
              {assignError ? <p className="ndm-error-text">{assignError}</p> : null}

              <label className="ndm-field">
                <span>Search Roles</span>
                <input
                  className="ndm-input"
                  value={assignSearch}
                  onChange={(event) => setAssignSearch(event.target.value)}
                  placeholder="Search by role name"
                />
              </label>

              <div className="ndm-permissions-assign-summary">
                <span>{assignRoleIds.length} roles selected</span>
                <span>{assignableRoles.length} roles visible</span>
              </div>

              <div className="ndm-permissions-assign-list">
                {assignableRoles.map((role) => {
                  const checked = assignRoleIds.includes(role.id);

                  return (
                    <label key={role.id} className={`ndm-permissions-assign-row ${checked ? 'ndm-permissions-assign-row--active' : ''}`}>
                      <div className="ndm-permissions-assign-row__check">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(event) => toggleAssignedRole(role.id, event.target.checked)}
                        />
                      </div>
                      <div className="ndm-permissions-assign-row__content">
                        <div className="ndm-permissions-assign-row__title">
                          <strong>{role.display_name || role.name}</strong>
                          {role.is_system_role ? <span className="ndm-permissions-role-chip ndm-permissions-role-chip--system">System</span> : null}
                        </div>
                        <div className="ndm-permissions-assign-row__meta">{role.name}</div>
                        {role.description ? <div className="ndm-permissions-assign-row__meta">{role.description}</div> : null}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <footer className="ndm-modal__footer">
              <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => setAssignModalOpen(false)} disabled={assignBusy}>Cancel</button>
              <button type="button" className="ndm-btn ndm-btn--primary" onClick={saveAssignedRoles} disabled={assignBusy}>
                {assignBusy ? 'Saving...' : 'Save Assignments'}
              </button>
            </footer>
          </div>
        </div>
      ) : null}
    </AdminContentWrapper>
  );
}
