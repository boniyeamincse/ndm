import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import PaginationBar from '../../../membership/shared/components/PaginationBar';
import { ErrorState } from '../../../membership/shared/components/PageStates';
import ReportChartCard from './ReportChartCard';
import ReportDataTable from './ReportDataTable';
import ReportEmptyState from './ReportEmptyState';
import ReportFiltersToolbar from './ReportFiltersToolbar';
import ReportSectionCard from './ReportSectionCard';
import ReportSkeleton from './ReportSkeleton';
import ReportSummaryCards from './ReportSummaryCards';
import InsightSummaryCard from './InsightSummaryCard';

export default function ReportPageLayout({
  pageTitle,
  pageSubtitle,
  breadcrumbs,
  cards,
  filters,
  setFilters,
  search,
  setSearch,
  data,
  loading,
  error,
  onReload,
  tableColumns,
  searchPlaceholder,
}) {
  const rows = data?.rows || [];
  const meta = data?.meta;

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value, page: 1 }));
  }

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader title={pageTitle} subtitle={pageSubtitle} breadcrumbs={breadcrumbs} />
        <ReportSummaryCards cards={cards} />

        <PageSection>
          <ReportFiltersToolbar
            search={search}
            onSearchChange={setSearch}
            onSubmit={(event) => { event.preventDefault(); setFilters((current) => ({ ...current, search, page: 1 })); }}
            onReset={() => {
              setSearch('');
              setFilters((current) => Object.fromEntries(
                Object.entries(current).map(([key, value]) => {
                  if (key === 'page') return [key, 1];
                  if (key === 'per_page') return [key, value];
                  if (key === 'renderControls') return [key, value];
                  return [key, ''];
                })
              ));
            }}
            onRefresh={onReload}
            onExport={() => {}}
            startDate={filters.start_date}
            endDate={filters.end_date}
            onStartDateChange={(value) => updateFilter('start_date', value)}
            onEndDateChange={(value) => updateFilter('end_date', value)}
            searchPlaceholder={searchPlaceholder}
          >
            {filters.renderControls ? filters.renderControls(updateFilter) : null}
          </ReportFiltersToolbar>

          {error ? <ErrorState message={error} onRetry={onReload} /> : null}
          {loading ? <ReportSkeleton rows={8} /> : null}
          {!loading && !error && !rows.length ? <ReportEmptyState title="No report data found" subtitle="Adjust the report filters and try again." /> : null}

          {!loading && !error ? (
            <div className="rpt-page-grid">
              <div className="rpt-page-grid__charts">
                {(data?.charts || []).map((chart) => <ReportChartCard key={chart.id} chart={chart} />)}
              </div>
              {(data?.insights || []).length ? (
                <ReportSectionCard title="Operational Insights">
                  <div className="rpt-insight-grid">
                    {data.insights.map((item) => <InsightSummaryCard key={item.title} title={item.title} body={item.body} />)}
                  </div>
                </ReportSectionCard>
              ) : null}
              <ReportSectionCard title="Detailed Data">
                <ReportDataTable columns={tableColumns} rows={rows} />
                {meta ? <PaginationBar meta={meta} page={filters.page || 1} onPageChange={(page) => setFilters((current) => ({ ...current, page }))} /> : null}
              </ReportSectionCard>
            </div>
          ) : null}
        </PageSection>
      </PageContainer>
    </AdminContentWrapper>
  );
}
