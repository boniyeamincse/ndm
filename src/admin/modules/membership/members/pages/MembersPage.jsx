import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

export default function MembersPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const routeConfig = MEMBER_ROUTE_CONFIG[location.pathname] || MEMBER_ROUTE_CONFIG['/admin/members'];

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    status: routeConfig.status,
    gender: '',
    division: '',
    district: '',
    upazila: '',
    recent_period_days: routeConfig.recentDays,
    sort_by: routeConfig.recentDays ? 'joined_at' : 'created_at',
    sort_dir: 'desc',
    page: 1,
    per_page: 20,
  });

  const [editTarget, setEditTarget] = useState(null);
  const [statusTarget, setStatusTarget] = useState({ member: null, status: '' });

  const { items, meta, summary, loading, error, reload } = useMembers(filters, routeConfig);
  const { busyAction, actionError, updateProfile, updateStatus } = useMemberActions(() => {
    setEditTarget(null);
    setStatusTarget({ member: null, status: '' });
    reload();
  });

  const summaryCards = useMemo(() => ([
    { label: 'Total Members', value: summary.total || 0, tone: 'neutral' },
    { label: 'Active Members', value: summary.active || 0, tone: 'success' },
    { label: 'Inactive Members', value: summary.inactive || 0, tone: 'muted' },
    { label: 'Suspended Members', value: summary.suspended || 0, tone: 'danger' },
    { label: 'Leadership Members', value: summary.leadership || 0, tone: 'info' },
    { label: 'New Members', value: summary.newMembers || 0, tone: 'warning' },
  ]), [summary]);

  function applyFilters(event) {
    event.preventDefault();
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  }

  function resetFilters() {
    setSearch('');
    setFilters({
      search: '',
      status: routeConfig.status,
      gender: '',
      division: '',
      district: '',
      upazila: '',
      recent_period_days: routeConfig.recentDays,
      sort_by: routeConfig.recentDays ? 'joined_at' : 'created_at',
      sort_dir: 'desc',
      page: 1,
      per_page: 20,
    });
  }

  function updateFilter(name, value) {
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  }

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
        />

        <section className="ndm-summary-grid">
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
            searchPlaceholder="Search by member no, name, email or mobile"
          >
            <select value={filters.gender} onChange={(event) => updateFilter('gender', event.target.value)} className="ndm-input" data-testid="member-filter-gender">
              <option value="">All Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <select value={filters.division} onChange={(event) => updateFilter('division', event.target.value)} className="ndm-input" data-testid="member-filter-division">
              <option value="">All Divisions</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Rajshahi">Rajshahi</option>
              <option value="Khulna">Khulna</option>
            </select>
            <select value={filters.district} onChange={(event) => updateFilter('district', event.target.value)} className="ndm-input" data-testid="member-filter-district">
              <option value="">All Districts</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Rajshahi">Rajshahi</option>
              <option value="Khulna">Khulna</option>
            </select>
            {location.pathname === '/admin/members/new' ? (
              <select value={filters.recent_period_days || 30} onChange={(event) => updateFilter('recent_period_days', Number(event.target.value))} className="ndm-input" data-testid="member-filter-recent-period">
                <option value={7}>Last 7 Days</option>
                <option value={30}>Last 30 Days</option>
                <option value={90}>Last 90 Days</option>
              </select>
            ) : null}
          </FilterToolbar>

          {error ? <ErrorState message={error} onRetry={reload} /> : null}
          {actionError ? <ErrorState message={actionError} onRetry={reload} /> : null}
          {loading ? <LoadingSkeleton rows={8} /> : null}

          {!loading && !error && items.length === 0 ? (
            <EmptyState title="No members found" subtitle="Try changing the selected filters." />
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
                  <MemberCard key={item.id} item={item} onView={(id) => navigate(`/admin/members/${id}`)} />
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
