import { useMemo, useState } from 'react';
import { Plus, Briefcase, ShieldCheck, Users, Layers3, Globe2, Power, PowerOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import PaginationBar from '../../../membership/shared/components/PaginationBar';
import { ErrorState } from '../../../membership/shared/components/PageStates';
import OrganizationSummaryCards from '../../shared/components/OrganizationSummaryCards';
import OrganizationFilterToolbar from '../../shared/components/OrganizationFilterToolbar';
import OrganizationTable from '../../shared/components/OrganizationTable';
import OrganizationSkeleton from '../../shared/components/OrganizationSkeleton';
import OrganizationEmptyState from '../../shared/components/OrganizationEmptyState';
import PositionCategoryBadge from '../../shared/components/PositionCategoryBadge';
import PositionScopeBadge from '../../shared/components/PositionScopeBadge';
import PositionForm from '../components/PositionForm';
import { usePositionActions, usePositions } from '../hooks/usePositions';

const QUICK_FILTERS = [
  { key: 'all', label: 'All', icon: Briefcase, apply: { category: '', scope: '', is_active: '', is_leadership: '' } },
  { key: 'leadership', label: 'Leadership', icon: ShieldCheck, apply: { category: 'leadership', scope: '', is_active: '', is_leadership: '1' } },
  { key: 'executive', label: 'Executive', icon: Layers3, apply: { category: 'executive', scope: '', is_active: '', is_leadership: '' } },
  { key: 'general', label: 'General', icon: Users, apply: { category: 'general', scope: '', is_active: '', is_leadership: '' } },
  { key: 'committee', label: 'Committee Specific', icon: Briefcase, apply: { category: '', scope: 'committee_specific', is_active: '', is_leadership: '' } },
  { key: 'global', label: 'Global', icon: Globe2, apply: { category: '', scope: 'global', is_active: '', is_leadership: '' } },
  { key: 'active', label: 'Active', icon: Power, apply: { category: '', scope: '', is_active: '1', is_leadership: '' } },
  { key: 'inactive', label: 'Inactive', icon: PowerOff, apply: { category: '', scope: '', is_active: '0', is_leadership: '' } },
];

export default function PositionsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ search: '', category: '', scope: '', is_active: '', is_leadership: '', committee_type_id: '', sort_by: 'display_order', sort_dir: 'asc', page: 1, per_page: 20 });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const { items, meta, summary, loading, error, reload } = usePositions(filters);
  const { run, busyAction, actionError } = usePositionActions(() => { setFormOpen(false); setEditing(null); reload(); });

  const activeQuickFilter = useMemo(() => {
    const found = QUICK_FILTERS.find((entry) => (
      filters.category === entry.apply.category
      && filters.scope === entry.apply.scope
      && filters.is_active === entry.apply.is_active
      && filters.is_leadership === entry.apply.is_leadership
    ));
    return found?.key || 'custom';
  }, [filters.category, filters.scope, filters.is_active, filters.is_leadership]);

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title="Positions"
          subtitle="Manage leadership, executive, and general organizational positions."
          breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Organization' }, { label: 'Committee Positions', path: '/admin/committee-positions' }, { label: 'All Positions' }]}
          actions={(
            <>
              <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => navigate('/admin/committee-positions')}><Briefcase size={16} /> Back to Committee Positions</button>
              <button type="button" className="ndm-btn ndm-btn--primary" onClick={() => navigate('/admin/positions/create')}><Plus size={16} /> Add Position</button>
            </>
          )}
        />
        <OrganizationSummaryCards cards={[
          { label: 'Total Positions', value: summary.total, tone: 'neutral' },
          { label: 'Active Positions', value: summary.active, tone: 'success' },
          { label: 'Inactive Positions', value: summary.inactive, tone: 'muted' },
          { label: 'Leadership Positions', value: summary.leadership, tone: 'danger' },
          { label: 'Committee Specific Positions', value: summary.committee_specific, tone: 'info' },
          { label: 'Global Positions', value: summary.global, tone: 'warning' },
        ]} />

        <div className="org-quick-chips">
          {QUICK_FILTERS.map(({ key, label, icon: Icon, apply }) => (
            <button
              key={key}
              type="button"
              className={`org-quick-chip ${activeQuickFilter === key ? 'org-quick-chip--active' : ''}`}
              onClick={() => setFilters((current) => ({ ...current, ...apply, page: 1 }))}
            >
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        <PageSection>
          <OrganizationFilterToolbar
            search={search}
            onSearchChange={setSearch}
            onSubmit={(event) => { event.preventDefault(); setFilters((current) => ({ ...current, search, page: 1 })); }}
            onReset={() => { setSearch(''); setFilters({ search: '', category: '', scope: '', is_active: '', is_leadership: '', committee_type_id: '', sort_by: 'display_order', sort_dir: 'asc', page: 1, per_page: 20 }); }}
            searchPlaceholder="Search positions"
          >
            <select className="ndm-input" value={filters.category} onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value, page: 1 }))}><option value="">All Categories</option><option value="leadership">Leadership</option><option value="executive">Executive</option><option value="general">General</option></select>
            <select className="ndm-input" value={filters.scope} onChange={(event) => setFilters((current) => ({ ...current, scope: event.target.value, page: 1 }))}><option value="">All Scope</option><option value="global">Global</option><option value="committee_specific">Committee Specific</option></select>
            <select className="ndm-input" value={filters.is_leadership} onChange={(event) => setFilters((current) => ({ ...current, is_leadership: event.target.value, page: 1 }))}><option value="">Any Leadership</option><option value="1">Leadership Only</option><option value="0">Non Leadership</option></select>
          </OrganizationFilterToolbar>

          {error ? <ErrorState message={error} onRetry={reload} /> : null}
          {actionError ? <ErrorState message={actionError} onRetry={reload} /> : null}
          {loading ? <OrganizationSkeleton rows={8} /> : null}
          {!loading && !error && items.length === 0 ? <OrganizationEmptyState title="No positions found" subtitle="Adjust your filters or create a position." /> : null}

          {!loading && !error && items.length > 0 ? (
            <>
              <OrganizationTable
                columns={[
                  { key: 'name', label: 'Name' },
                  { key: 'short_name', label: 'Short Name' },
                  { key: 'category', label: 'Category' },
                  { key: 'scope', label: 'Scope' },
                  { key: 'hierarchy_rank', label: 'Hierarchy Rank' },
                  { key: 'display_order', label: 'Display Order' },
                  { key: 'leadership', label: 'Leadership' },
                  { key: 'active', label: 'Active' },
                  { key: 'mapped', label: 'Mapped Committee Types' },
                  { key: 'actions', label: 'Actions' },
                ]}
                rows={items}
                testId="positions-table"
                renderRow={(item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="org-position-name-cell">
                        <div className="org-position-name">{item.name}</div>
                        {item.name_bn ? <div className="org-position-name-bn">{item.name_bn}</div> : null}
                        <div className="org-position-code">{item.code || 'No code'}</div>
                      </div>
                    </td>
                    <td>{item.short_name || '—'}</td>
                    <td><PositionCategoryBadge value={item.category} /></td>
                    <td><PositionScopeBadge value={item.scope} /></td>
                    <td>{item.hierarchy_rank}</td>
                    <td>{item.display_order}</td>
                    <td>{item.is_leadership ? <span className="org-pill org-pill--red">Leadership</span> : '—'}</td>
                    <td>{item.is_active ? <span className="org-pill org-pill--green">Active</span> : <span className="org-pill org-pill--slate">Inactive</span>}</td>
                    <td>
                      {Array.isArray(item.committee_types) && item.committee_types.length > 0 ? (
                        <span className="org-pill org-pill--blue">{item.committee_types.length} mapped</span>
                      ) : '—'}
                    </td>
                    <td>
                      <div className="ndm-table__actions">
                        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => navigate(`/admin/positions/${item.id}`)}>View</button>
                        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => navigate(`/admin/positions/${item.id}/edit`)}>Edit</button>
                        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => run(item.deleted_at ? 'restore' : 'delete', item.id)}>{item.deleted_at ? 'Restore' : 'Delete'}</button>
                      </div>
                    </td>
                  </tr>
                )}
              />

              <div className="ndm-mobile-only ndm-mobile-list">
                {items.map((item) => (
                  <article key={item.id} className="org-position-card">
                    <div className="org-position-card__head">
                      <h4>{item.name}</h4>
                      <span className="org-pill org-pill--slate">{item.code || 'No code'}</span>
                    </div>
                    <div className="org-position-card__meta">
                      <PositionCategoryBadge value={item.category} />
                      <PositionScopeBadge value={item.scope} />
                      {item.is_active ? <span className="org-pill org-pill--green">Active</span> : <span className="org-pill org-pill--slate">Inactive</span>}
                    </div>
                    <div className="org-position-card__stats">
                      <span>Rank: {item.hierarchy_rank}</span>
                      <span>Order: {item.display_order}</span>
                      <span>Mapped: {Array.isArray(item.committee_types) ? item.committee_types.length : 0}</span>
                    </div>
                    <div className="org-position-card__actions">
                      <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => navigate(`/admin/positions/${item.id}`)}>View</button>
                      <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => navigate(`/admin/positions/${item.id}/edit`)}>Edit</button>
                    </div>
                  </article>
                ))}
              </div>

              <PaginationBar meta={meta} page={filters.page} onPageChange={(page) => setFilters((current) => ({ ...current, page }))} />
            </>
          ) : null}
        </PageSection>
      </PageContainer>

      {formOpen ? (
        <div className="ndm-modal__overlay" onClick={() => { setFormOpen(false); setEditing(null); }}>
          <div className="ndm-modal" onClick={(event) => event.stopPropagation()}>
            <h3>{editing ? 'Edit Position' : 'Create Position'}</h3>
            <PositionForm initialValues={editing} busy={Boolean(busyAction)} onCancel={() => { setFormOpen(false); setEditing(null); }} onSubmit={(payload) => run(editing ? 'update' : 'create', editing?.id, payload)} />
          </div>
        </div>
      ) : null}
    </AdminContentWrapper>
  );
}
