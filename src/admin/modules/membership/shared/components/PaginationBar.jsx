export default function PaginationBar({ meta, page, onPageChange }) {
  if (!meta || meta.last_page <= 1) return null;

  return (
    <div className="ndm-pagination" data-testid="pagination-bar">
      <button
        type="button"
        className="ndm-btn ndm-btn--ghost"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>
      <span className="ndm-pagination__info">
        Page {meta.current_page} of {meta.last_page} ({meta.total} total)
      </span>
      <button
        type="button"
        className="ndm-btn ndm-btn--ghost"
        disabled={page >= meta.last_page}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
