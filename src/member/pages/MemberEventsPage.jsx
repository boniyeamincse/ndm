import { CalendarClock, PlusCircle } from 'lucide-react';

export default function MemberEventsPage() {
  return (
    <div className="member-panel">
      <div className="member-page-head">
        <div>
          <h1>Events & Programs</h1>
          <p>Upcoming events, registrations, history, and join workflow for members.</p>
        </div>
      </div>

      <div className="member-grid">
        <article className="member-card">
          <p className="member-card__title">Upcoming Events</p>
          <p className="member-card__meta">List + details + register button</p>
          <p>Event feed will load from the member events API group.</p>
        </article>
        <article className="member-card">
          <p className="member-card__title">My Registered Events</p>
          <p className="member-card__meta">Active registrations and participation state</p>
          <p>Registration state cards and pagination will appear here.</p>
        </article>
        <article className="member-card">
          <p className="member-card__title">Event History</p>
          <p className="member-card__meta">Attended/completed/cancelled records</p>
          <p>Historical timeline and export support can be attached here.</p>
        </article>
        <article className="member-card">
          <p className="member-card__title">Join Event</p>
          <p className="member-card__meta">Eligibility + seat + approval checks</p>
          <button type="button" className="btn btn-outline btn-sm"><PlusCircle size={14} /> Join</button>
        </article>
      </div>

      <div className="member-empty" style={{ marginTop: '1rem' }}>
        <CalendarClock size={28} style={{ marginBottom: '.45rem' }} />
        <p>No event API wired yet. UI shell is now ready for endpoint integration.</p>
      </div>
    </div>
  );
}
