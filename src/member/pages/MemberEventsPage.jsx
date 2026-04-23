import { useCallback, useEffect, useState } from 'react';
import { CalendarClock, MapPin, RefreshCw, Clock } from 'lucide-react';
import { memberApi } from '../../services/memberApi';

const TABS = ['upcoming', 'registered', 'history'];

const STATUS_COLORS = {
  upcoming: '#1d4ed8',
  open: '#15803d',
  pending: '#b45309',
  approved: '#15803d',
  completed: '#475569',
  cancelled: '#dc2626',
  rejected: '#dc2626',
};

function fmt(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || '#64748b';
  return (
    <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 999, fontSize: '.78rem', fontWeight: 700, background: color + '1a', color, border: `1px solid ${color}33` }}>
      {status}
    </span>
  );
}

function EventCard({ event, regStatus, onJoin, joining }) {
  const title = event?.title || 'Untitled Event';
  const date = fmt(event?.event_at);
  const location = event?.location;
  const status = event?.status;

  return (
    <article className="member-card" style={{ display: 'flex', flexDirection: 'column', gap: '.45rem' }}>
      <p className="member-card__title" style={{ marginBottom: 0 }}>{title}</p>
      {date && (
        <p className="member-card__meta" style={{ display: 'flex', alignItems: 'center', gap: '.35rem', margin: 0 }}>
          <Clock size={12} /> {date}
        </p>
      )}
      {location && (
        <p className="member-card__meta" style={{ display: 'flex', alignItems: 'center', gap: '.35rem', margin: 0 }}>
          <MapPin size={12} /> {location}
        </p>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '.35rem', flexWrap: 'wrap', gap: '.5rem' }}>
        <StatusBadge status={regStatus || status || 'upcoming'} />
        {onJoin && (
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => onJoin(event.id)}
            disabled={joining}
          >
            {joining ? 'Joining…' : 'Join Event'}
          </button>
        )}
      </div>
    </article>
  );
}

function RegistrationCard({ reg }) {
  const event = reg.event || {};
  return (
    <article className="member-card" style={{ display: 'flex', flexDirection: 'column', gap: '.45rem' }}>
      <p className="member-card__title" style={{ marginBottom: 0 }}>{event.title || 'Event'}</p>
      {event.event_at && (
        <p className="member-card__meta" style={{ display: 'flex', alignItems: 'center', gap: '.35rem', margin: 0 }}>
          <Clock size={12} /> {fmt(event.event_at)}
        </p>
      )}
      {event.location && (
        <p className="member-card__meta" style={{ display: 'flex', alignItems: 'center', gap: '.35rem', margin: 0 }}>
          <MapPin size={12} /> {event.location}
        </p>
      )}
      <StatusBadge status={reg.status} />
    </article>
  );
}

function SkeletonGrid() {
  return (
    <div className="member-grid">
      {[1, 2, 3, 4].map(i => (
        <div className="member-card" key={i}>
          <div className="member-skeleton" style={{ width: '70%', marginBottom: '.55rem' }} />
          <div className="member-skeleton" style={{ width: '45%', marginBottom: '.45rem' }} />
          <div className="member-skeleton" style={{ width: '55%' }} />
        </div>
      ))}
    </div>
  );
}

export default function MemberEventsPage() {
  const [tab, setTab] = useState('upcoming');
  const [state, setState] = useState({ upcoming: null, registered: null, history: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [joiningId, setJoiningId] = useState(null);
  const [joinFeedback, setJoinFeedback] = useState('');

  const load = useCallback(async (t = tab) => {
    if (state[t] !== null) return;
    setLoading(true);
    setError('');
    try {
      let res;
      if (t === 'upcoming') res = await memberApi.getUpcomingEvents();
      else if (t === 'registered') res = await memberApi.getRegisteredEvents();
      else res = await memberApi.getEventHistory();
      const rows = res?.data ?? (Array.isArray(res) ? res : []);
      setState(prev => ({ ...prev, [t]: rows }));
    } catch (e) {
      setError(e?.message || 'Failed to load events.');
    } finally {
      setLoading(false);
    }
  }, [tab, state]);

  useEffect(() => { load(tab); }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefresh = () => {
    setState(prev => ({ ...prev, [tab]: null }));
    setError('');
    setTimeout(() => load(tab), 0);
  };

  const handleJoin = async (id) => {
    setJoiningId(id);
    setJoinFeedback('');
    try {
      await memberApi.joinEvent(id);
      setJoinFeedback('Joined! Your registration is pending approval.');
      setState(prev => ({ ...prev, upcoming: null, registered: null }));
    } catch (e) {
      setJoinFeedback(e?.message || 'Failed to join event.');
    } finally {
      setJoiningId(null);
    }
  };

  const rows = state[tab] ?? [];

  return (
    <div className="member-panel">
      <div className="member-page-head">
        <div>
          <h1>Events & Programs</h1>
          <p>Upcoming events, your registrations, and participation history.</p>
        </div>
        <button type="button" className="btn btn-outline btn-sm" onClick={handleRefresh}><RefreshCw size={14} /> Refresh</button>
      </div>

      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button
            key={t}
            type="button"
            className={`btn btn-sm ${tab === t ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setTab(t)}
            style={{ textTransform: 'capitalize' }}
          >
            {t === 'upcoming' ? 'Upcoming' : t === 'registered' ? 'My Registrations' : 'History'}
          </button>
        ))}
      </div>

      {joinFeedback && (
        <div className="member-inline-alert" style={{ background: joinFeedback.includes('Failed') ? undefined : '#f0fdf4', color: joinFeedback.includes('Failed') ? undefined : '#15803d', borderColor: joinFeedback.includes('Failed') ? undefined : '#bbf7d0' }}>
          <span>{joinFeedback}</span>
        </div>
      )}

      {error && (
        <div className="member-inline-alert">
          <span>{error}</span>
          <button type="button" className="btn btn-outline btn-sm" onClick={handleRefresh}>Retry</button>
        </div>
      )}

      {loading ? <SkeletonGrid /> : rows.length === 0 ? (
        <div className="member-empty">
          <CalendarClock size={28} style={{ marginBottom: '.45rem' }} />
          <p>
            {tab === 'upcoming' ? 'No upcoming events at the moment.' : tab === 'registered' ? 'No active registrations.' : 'No event history yet.'}
          </p>
        </div>
      ) : (
        <div className="member-grid">
          {tab === 'upcoming'
            ? rows.map(ev => <EventCard key={ev.id} event={ev} onJoin={handleJoin} joining={joiningId === ev.id} />)
            : rows.map(reg => <RegistrationCard key={reg.id} reg={reg} />)
          }
        </div>
      )}
    </div>
  );
}
