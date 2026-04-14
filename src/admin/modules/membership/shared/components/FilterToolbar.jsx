import { Search, RotateCcw } from 'lucide-react';

export default function FilterToolbar({
  search,
  onSearchChange,
  onSubmit,
  onReset,
  children,
  searchPlaceholder = 'Search...',
}) {
  return (
    <form className="ndm-filter-toolbar" onSubmit={onSubmit}>
      <div className="ndm-filter-toolbar__search-wrap">
        <Search size={16} />
        <input
          data-testid="filter-search"
          className="ndm-filter-toolbar__search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
        />
      </div>

      <div className="ndm-filter-toolbar__controls">{children}</div>

      <div className="ndm-filter-toolbar__actions">
        <button type="submit" className="ndm-btn ndm-btn--primary" data-testid="apply-filters">
          Apply Filters
        </button>
        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={onReset} data-testid="reset-filters">
          <RotateCcw size={14} />
          <span>Reset Filters</span>
        </button>
      </div>
    </form>
  );
}
