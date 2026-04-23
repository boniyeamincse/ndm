import { FileText, Send } from 'lucide-react';

const cards = [
  { title: 'Membership Application Status', desc: 'Track pending/approved/rejected lifecycle of your membership profile.' },
  { title: 'Committee Apply', desc: 'Apply for committee assignment by preferred level and role.' },
  { title: 'Event Apply', desc: 'Submit application for events requiring approval.' },
  { title: 'Certificate Request', desc: 'Request movement participation certificate for approved activities.' },
];

export default function MemberApplicationsPage() {
  return (
    <div className="member-panel">
      <div className="member-page-head">
        <div>
          <h1>Applications</h1>
          <p>Manage membership, committee, event, and certificate application workflows.</p>
        </div>
      </div>

      <div className="member-grid">
        {cards.map(card => (
          <article key={card.title} className="member-card">
            <p className="member-card__title">{card.title}</p>
            <p className="member-card__meta">Planned status badges: pending, approved, rejected, under review</p>
            <p style={{ marginBottom: '.8rem' }}>{card.desc}</p>
            <button type="button" className="btn btn-outline btn-sm"><Send size={14} /> Open</button>
          </article>
        ))}
      </div>

      <div className="member-empty" style={{ marginTop: '1rem' }}>
        <FileText size={28} style={{ marginBottom: '.45rem' }} />
        <p>Application history table and submission forms will render here once API endpoints are enabled.</p>
      </div>
    </div>
  );
}
