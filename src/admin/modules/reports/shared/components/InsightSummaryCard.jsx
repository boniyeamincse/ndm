export default function InsightSummaryCard({ title, body }) {
  return (
    <article className="rpt-insight-card">
      <h4>{title}</h4>
      <p>{body}</p>
    </article>
  );
}
