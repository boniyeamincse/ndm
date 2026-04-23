import FilterToolbar from '../../../membership/shared/components/FilterToolbar';

export default function ContentFilterToolbar(props) {
  return (
    <div className="cnt-filter-shell">
      <FilterToolbar {...props} />
    </div>
  );
}
