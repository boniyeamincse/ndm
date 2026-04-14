import { Search } from 'lucide-react';

export default function TopbarSearch() {
  return (
    <label className="adm-topbar-search" aria-label="Search admin panel">
      <Search size={16} className="adm-topbar-search__icon" />
      <input
        type="search"
        className="adm-topbar-search__input"
        placeholder="Search members, committees, notices..."
      />
    </label>
  );
}
