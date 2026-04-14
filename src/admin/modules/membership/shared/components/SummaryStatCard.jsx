import { ArrowUpRight } from 'lucide-react';

export default function SummaryStatCard({ title, value, tone = 'neutral', hint }) {
  return (
    <article className={`ndm-stat-card ndm-stat-card--${tone}`} data-testid={`summary-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <p className="ndm-stat-card__title">{title}</p>
      <p className="ndm-stat-card__value">{value}</p>
      {hint ? (
        <p className="ndm-stat-card__hint">
          <ArrowUpRight size={14} />
          <span>{hint}</span>
        </p>
      ) : null}
    </article>
  );
}
