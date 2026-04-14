export default function ContentSkeleton({ rows = 4 }) {
  return (
    <div className="ndm-state ndm-state--loading cnt-skeleton" data-testid="content-skeleton">
      {Array.from({ length: rows }).map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={i} className="ndm-skeleton cnt-skeleton__row" />
      ))}
    </div>
  );
}
