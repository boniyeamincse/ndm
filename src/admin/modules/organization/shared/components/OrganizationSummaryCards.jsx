import SummaryStatCard from '../../../membership/shared/components/SummaryStatCard';

export default function OrganizationSummaryCards({ cards = [] }) {
  return (
    <section className="ndm-summary-grid org-summary-grid">
      {cards.map((card) => (
        <SummaryStatCard
          key={card.label}
          title={card.label}
          value={card.value}
          tone={card.tone || 'neutral'}
          hint={card.hint}
        />
      ))}
    </section>
  );
}
