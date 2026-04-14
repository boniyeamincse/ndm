import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import FilterToolbar from '../../shared/components/FilterToolbar';
import SummaryStatCard from '../../shared/components/SummaryStatCard';
import PaginationBar from '../../shared/components/PaginationBar';
import { EmptyState, ErrorState, LoadingSkeleton } from '../../shared/components/PageStates';
import MembershipApplicationTable from '../components/MembershipApplicationTable';
import MembershipApplicationCard from '../components/MembershipApplicationCard';
import ApplicationActionModal from '../components/ApplicationActionModal';
import { APPLICATION_ROUTE_CONFIG } from '../types/applicationTypes';
import { useMembershipApplicationActions, useMembershipApplications } from '../hooks/useMembershipApplications';

export default function MembershipApplicationsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const routeConfig = APPLICATION_ROUTE_CONFIG[location.pathname] || APPLICATION_ROUTE_CONFIG['/admin/membership-applications'];

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    status: routeConfig.status,
    division: '',
    district: '',
    desired_committee_level: '',
    page: 1,
    per_page: 20,
  });

  const [modal, setModal] = useState({ action: '', item: null });

  const { items, meta, summary, loading, error, reload } = useMembershipApplications(filters);
  const { run, busyAction, actionError, clearError } = useMembershipApplicationActions(() => {
    setModal({ action: '', item: null });
    reload();
  });

  const summaryCards = useMemo(() => ([
    { label: 'Total Applications', value: summary.total || 0, tone: 'neutral' },
    { label: 'Pending', value: summary.pending || 0, tone: 'warning' },
    { label: 'Under Review', value: summary.under_review || 0, tone: 'info' },
    { label: 'Approved', value: summary.approved || 0, tone: 'success' },
    { label: 'Rejected', value: summary.rejected || 0, tone: 'danger' },
    { label: 'On Hold', value: summary.on_hold || 0, tone: 'muted' },
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
      division: '',
      district: '',
      desired_committee_level: '',
      page: 1,
      per_page: 20,
    });
  }

  function updateFilter(name, value) {
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  }

  async function submitAction(action, payload) {
    const ok = await run(action, modal.item.id, payload);
    if (ok) clearError();
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
            searchPlaceholder="Search by name, email, mobile or application no"
          >
            <select value={filters.division} onChange={(event) => updateFilter('division', event.target.value)} className="ndm-input" data-testid="application-filter-division">
              <option value="">All Divisions</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Chattogram">Chattogram</option>
              <option value="Rajshahi">Rajshahi</option>
            </select>
            <select value={filters.district} onChange={(event) => updateFilter('district', event.target.value)} className="ndm-input" data-testid="application-filter-district">
              <option value="">All Districts</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Gazipur">Gazipur</option>
              <option value="Cumilla">Cumilla</option>
            </select>
            <select
              value={filters.desired_committee_level}
              onChange={(event) => updateFilter('desired_committee_level', event.target.value)}
              className="ndm-input"
              data-testid="application-filter-committee-level"
            >
              <option value="">All Committee Levels</option>
              <option value="central">Central</option>
              <option value="division">Division</option>
              <option value="district">District</option>
              <option value="upazila">Upazila</option>
              <option value="union">Union</option>
            </select>
          </FilterToolbar>

          {error ? <ErrorState message={error} onRetry={reload} /> : null}
          {actionError ? <ErrorState message={actionError} onRetry={clearError} /> : null}

          {loading ? <LoadingSkeleton rows={8} /> : null}

          {!loading && !error && items.length === 0 ? (
            <EmptyState title="No applications found" subtitle="Try changing search text or filter values." />
          ) : null}

          {!loading && !error && items.length > 0 ? (
            <>
              <div className="ndm-desktop-only">
                <MembershipApplicationTable
                  items={items}
                  onView={(id) => navigate(`/admin/membership-applications/${id}`)}
                  onAction={(action, item) => setModal({ action, item })}
                />
              </div>
              <div className="ndm-mobile-only ndm-mobile-list">
                {items.map((item) => (
                  <MembershipApplicationCard key={item.id} item={item} onView={(id) => navigate(`/admin/membership-applications/${id}`)} />
                ))}
              </div>
              <PaginationBar meta={meta} page={filters.page} onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))} />
            </>
          ) : null}
        </PageSection>
      </PageContainer>

      <ApplicationActionModal
        action={modal.action}
        entity={modal.item}
        busy={Boolean(busyAction)}
        onClose={() => setModal({ action: '', item: null })}
        onSubmit={submitAction}
      />
    </AdminContentWrapper>
  );
}
