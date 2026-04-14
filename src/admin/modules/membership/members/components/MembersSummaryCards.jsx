import SummaryStatCard from '../../shared/components/SummaryStatCard';

export default function MembersSummaryCards({ cards }) {
  return (
    <section className="ndm-summary-grid" aria-label="Member summary cards">
      {cards.map((card) => (
        <SummaryStatCard
          key={card.label}
          title={card.label}
          value={card.value}
          tone={card.tone}
          hint={card.hint}
        />
      ))}
    </section>
  );
}
