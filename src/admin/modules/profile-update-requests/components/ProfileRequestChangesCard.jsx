import SectionCard from '../../membership/shared/components/SectionCard';

export default function ProfileRequestChangesCard({ changes = [] }) {
  return (
    <SectionCard title="Requested Changes" subtitle="Compare current values with requested updates.">
      <div className="prf-change-list">
        {changes.map((change) => (
          <article key={change.field} className="prf-change-card">
            <header>{change.field.replaceAll('_', ' ')}</header>
            <div className="prf-change-card__grid">
              <div>
                <span>Current</span>
                <strong>{change.current_value || '—'}</strong>
              </div>
              <div>
                <span>Requested</span>
                <strong>{change.requested_value || '—'}</strong>
              </div>
            </div>
          </article>
        ))}
      </div>
    </SectionCard>
  );
}
