import { Download, RefreshCcw } from 'lucide-react';
import FilterToolbar from '../../../membership/shared/components/FilterToolbar';

export default function ReportFiltersToolbar({
  search,
  onSearchChange,
  onSubmit,
  onReset,
  onRefresh,
  onExport,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  children,
  searchPlaceholder = 'Search reports',
}) {
  return (
    <div className="rpt-filter-stack">
      <FilterToolbar
        search={search}
        onSearchChange={onSearchChange}
        onSubmit={onSubmit}
        onReset={onReset}
        searchPlaceholder={searchPlaceholder}
      >
        <label className="rpt-filter-date">
          <span>Start</span>
          <input type="date" className="ndm-input" value={startDate || ''} onChange={(event) => onStartDateChange?.(event.target.value)} />
        </label>
        <label className="rpt-filter-date">
          <span>End</span>
          <input type="date" className="ndm-input" value={endDate || ''} onChange={(event) => onEndDateChange?.(event.target.value)} />
        </label>
        {children}
      </FilterToolbar>
      <div className="rpt-filter-actions-row">
        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={onRefresh}><RefreshCcw size={14} /> Refresh</button>
        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={onExport}><Download size={14} /> Export</button>
      </div>
    </div>
  );
}
