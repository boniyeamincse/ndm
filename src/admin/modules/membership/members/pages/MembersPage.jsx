import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RefreshCcw, UserPlus, Download, Users, UserCheck, UserMinus, Ban, Shield, Sparkles } from 'lucide-react';
import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import SummaryStatCard from '../../shared/components/SummaryStatCard';
import FilterToolbar from '../../shared/components/FilterToolbar';
import PaginationBar from '../../shared/components/PaginationBar';
import { EmptyState, ErrorState, LoadingSkeleton } from '../../shared/components/PageStates';
import MembersTable from '../components/MembersTable';
import MemberCard from '../components/MemberCard';
import UpdateMemberStatusModal from '../components/UpdateMemberStatusModal';
import EditMemberModal from '../components/EditMemberModal';
import { MEMBER_ROUTE_CONFIG } from '../types/memberTypes';
import { useMemberActions, useMembers } from '../hooks/useMembers';

const DIVISIONS = ['Dhaka', 'Rajshahi', 'Khulna', 'Chittagong', 'Sylhet', 'Barisal', 'Rangpur', 'Mymensingh'];

const QUICK_LINKS = [
  { label: 'All', path: '/admin/members', icon: Users },
  { label: 'Active', path: '/admin/members/active', icon: UserCheck },
  { label: 'Inactive', path: '/admin/members/inactive', icon: UserMinus },
  { label: 'Suspended', path: '/admin/members/suspended', icon: Ban },
  { label: 'Leadership', path: '/admin/members/leadership', icon: Shield },
  { label: 'New', path: '/admin/members/new', icon: Sparkles },
];

function buildInitialFilters(routeConfig) {
  return {
    search: '',
    status: routeConfig.status || '',
    gender: '',
    division: '',
    district: '',
    upazila: '',
    union_name: '',
    educational_institution: '',
    leadership_only: routeConfig.leadershipOnly ? 'true' : '',
    joined_from: '',
    joined_to: '',
    recent_period_days: routeConfig.recentDays || null,
    sort_by: routeConfig.recentDays ? 'joined_at' : 'created_at',
    sort_dir: 'desc',
    page: 1,
    per_page: 20,
  };
}

export default function MembersPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const routeConfig = MEMBER_ROUTE_CONFIG[location.pathname] || MEMBER_ROUTE_CONFIG['/admin/members'];

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(() => buildInitialFilters(routeConfig));
  const [editTarget, setEditTarget] = useState(null);
  const [statusTarget, setStatusTarget] = useState({ member: null, status: '' });

  const { items, meta, summary, loading, error, reload } = useMembers(filters, routeConfig);
  const { busyAction, actionError, updateProfile, updateStatus } = useMemberActions(() => {
    setEditTarget(null);
    setStatusTarget({ member: null, status: '' });
    reload();
  });

  useEffect(() => {
    setSearch('');
    setFilters(buildInitialFilters(routeConfig));
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const summaryCards = useMemo(() => [
    { label: 'Total Members', value: summary.total || 0, tone: 'neutral', icon: Users },
    { label: 'Active Members', value: summary.active || 0, tone: 'success', icon: UserCheck },
    { label: 'Inactive Members', value: summary.inactive || 0, tone: 'muted', icon: UserMinus },
    { label: 'Suspended', value: summary.suspended || 0, tone: 'danger', icon: Ban },
    { label: 'Leadership', value: summary.leadership || 0, tone: 'info', icon: Shield },
    { label: 'New Members', value: summary.newMembers || 0, tone: 'warning', icon: Sparkles },
  ], [summary]);

  function applyFilters(event) {
    event.preventDefault();
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  }

  function resetFilters() {
    setSearch('');
    setFilters(buildInitialFilters(routeConfig));
  }

  function updateFilter(name, value) {
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  }

  const headerActions = (
    <div className="mem-header-actions">
      <button type="button" className="ndm-btn ndm-btn--ghost" onClick={reload} title="Refresh">
        <RefreshCcw size={15} />
        <span>Refresh</span>
      </button>
      <button type="button" className="ndm-btn ndm-btn--ghost" title="Export (placeholder)">
        <Download size={15} />
        <span>Export</span>
      </button>
      <button type="button" className="ndm-btn ndm-btn--primary" title="Add Member (placeholder)">
        <UserPlus size={15} />
        <span>Add Member</span>
      </button>
    </div>
  );

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title={routeConfig.title}
          subtitle={routeConfig.subtitle}
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Membership' },
            { label: routeConfig.title },
          ]}
          actions={headerActions}
        />

        <div className="mem-quick-chips">
          {QUICK_LINKS.map(({ label, path, icon: Icon }) => (
            <button
              key={path}
              type="button"
              className={`mem-quick-chip ${location.pathname === path ? 'mem-quick-chip--active' : ''}`}
              onClick={() => navigate(path)}
            >
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        <section className="ndm-summary-grid" aria-label="Member summary">
          {summaryCards.map((card) => (
            <SummaryStatCard key={card.label} title={card.label} value={card.value} tone={card.tone} />
          ))}
        </section>

        <PageSection>
          <FilterToolbar
            search={search}
            onSearchChange={setSearch}
            onSubmit={applyFilters}
            onReset={resetFilters}
            searchPlaceholder="Search by member no, name, email or mobile..."
          >
            {!routeConfig.status ? (
              <select value={filters.status} onChange={(e) => updateFilter('status', e.target.value)} className="ndm-input" data-testid="member-filter-status">
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
                <option value="resigned">Resigned</option>
                <option value="removed">Removed</option>
              </select>
            ) : null}

            <select value={filters.gender} onChange={(e) => updateFilter('gender', e.target.value)} className="ndm-input" data-testid="member-filter-gender">
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <select value={filters.division} onChange={(e) => updateFilter('division', e.target.value)} className="ndm-input" data-testid="member-filter-division">
              <option value="">All Divisions</option>
              {DIVISIONS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>

            <input value={filters.district} onChange={(e) => updateFilter('district', e.target.value)} className="ndm-input" placeholder="District" aria-label="Filter by district" />
            <input value={filters.upazila} onChange={(e) => updateFilter('upazila', e.target.value)} className="ndm-input" placeholder="Upazila" aria-label="Filter by upazila" />
            <input value={filters.union_name} onChange={(e) => updateFilter('union_name', e.target.value)} className="ndm-input" placeholder="Union" aria-label="Filter by union" />
            <input value={filters.educational_institution} onChange={(e) => updateFilter('educational_institution', e.target.value)} className="ndm-input" placeholder="Institution" aria-label="Filter by educational institution" />

            {!routeConfig.leadershipOnly ? (
              <select value={filters.leadership_only} onChange={(e) => updateFilter('leadership_only', e.target.value)} className="ndm-input" data-testid="member-filter-leadership">
                <option value="">All Members</option>
                <option value="true">Leadership Only</option>
              </select>
            ) : null}

            {location.pathname === '/admin/members/new' ? (
              <select value={filters.recent_period_days || 30} onChange={(e) => updateFilter('recent_period_days', Number(e.target.value))} className="ndm-input" data-testid="member-filter-recent-period">
                <option value={7}>Last 7 Days</option>
                <option value={30}>Last 30 Days</option>
                <option value={90}>Last 90 Days</option>
              </select>
            ) : null}

            <input type="date" value={filters.joined_from} onChange={(e) => updateFilter('joined_from', e.target.value)} className="ndm-input" title="Joined from" aria-label="Joined from date" />
            <input type="date" value={filters.joined_to} onChange={(e) => updateFilter('joined_to', e.target.value)} className="ndm-input" title="Joined to" aria-label="Joined to date" />

            <select
              value={`${filters.sort_by}:${filters.sort_dir}`}
              onChange={(e) => {
                const [sort_by, sort_dir] = e.target.value.split(':');
                setFilters((prev) => ({ ...prev, sort_by, sort_dir, page: 1 }));
              }}
              className="ndm-input"
              data-testid="member-filter-sort"
            >
              <option value="created_at:desc">Newest First</option>
              <option value="created_at:asc">Oldest First</option>
              <option value="joined_at:desc">Join Date ↓</option>
              <option value="joined_at:asc">Join Date ↑</option>
              <option value="full_name:asc">Name A-Z</option>
              <option value="full_name:desc">Name Z-A</option>
            </select>
          </FilterToolbar>

          {error ? <ErrorState message={error} onRetry={reload} /> : null}
          {actionError ? <ErrorState message={actionError} /> : null}
          {loading ? <LoadingSkeleton rows={8} /> : null}

          {!loading && !error && items.length === 0 ? (
            <EmptyState title={`No ${routeConfig.title.toLowerCase()} found`} subtitle="Try adjusting the search or filter criteria." />
          ) : null}

          {!loading && !error && items.length > 0 ? (
            <>
              <div className="ndm-desktop-only">
                <MembersTable
                  items={items}
                  onView={(id) => navigate(`/admin/members/${id}`)}
                  onEdit={(member) => setEditTarget(member)}
                  onStatusAction={(member, status) => setStatusTarget({ member, status })}
                />
              </div>

              <div className="ndm-mobile-only ndm-mobile-list">
                {items.map((item) => (
                  <MemberCard
                    key={item.id}
                    item={item}
                    onView={(id) => navigate(`/admin/members/${id}`)}
                    onEdit={(member) => setEditTarget(member)}
                    onStatusAction={(member, status) => setStatusTarget({ member, status })}
                  />
                ))}
              </div>

              <PaginationBar meta={meta} page={filters.page} onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))} />
            </>
          ) : null}
        </PageSection>
      </PageContainer>

      <UpdateMemberStatusModal
        member={statusTarget.member}
        targetStatus={statusTarget.status}
        busy={busyAction === 'status'}
        onClose={() => setStatusTarget({ member: null, status: '' })}
        onSubmit={(payload) => updateStatus(statusTarget.member.id, payload)}
      />

      <EditMemberModal
        member={editTarget}
        busy={busyAction === 'update'}
        onClose={() => setEditTarget(null)}
        onSubmit={(payload) => updateProfile(editTarget.id, payload)}
      />
    </AdminContentWrapper>
  );
}
