import { useEffect, useState } from 'react';
import { FileText, RefreshCw, Send } from 'lucide-react';
import { memberApi } from '../../services/memberApi';

const STATUS_COLORS = {
  pending: '#b45309',
  approved: '#15803d',
  active: '#15803d',
  rejected: '#dc2626',
  cancelled: '#64748b',
  completed: '#475569',
  under_review: '#1d4ed8',
  review: '#1d4ed8',
  hold: '#7c3aed',
};

function StatusBadge({ status }) {
  const key = (status || '').toLowerCase().replace(' ', '_');
  const color = STATUS_COLORS[key] || '#64748b';
  return (
    <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 999, fontSize: '.78rem', fontWeight: 700, background: color + '1a', color, border: `1px solid ${color}33`, textTransform: 'capitalize' }}>
      {status || 'N/A'}
    </span>
  );
}

function fmt(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function SkeletonSection() {
  return (
    <div className="member-grid">
      {[1, 2].map(i => (
        <div className="member-card" key={i}>
          <div className="member-skeleton" style={{ width: '55%', marginBottom: '.55rem' }} />
          <div className="member-skeleton" style={{ width: '80%', marginBottom: '.4rem' }} />
          <div className="member-skeleton" style={{ width: '35%' }} />
        </div>
      ))}
    </div>
  );
}

function SectionHeader({ title, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', margin: '1.25rem 0 .65rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>{title}</h3>
      {count !== undefined && <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: 999, padding: '1px 8px', fontSize: '.78rem', fontWeight: 700 }}>{count}</span>}
    </div>
  );
}

// Certificate request form
function CertForm({ onDone }) {
  const [form, setForm] = useState({ purpose: '', note: '' });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.purpose.trim()) return;
    setBusy(true);
    setMsg('');
    try {
      await memberApi.requestCertificate({ purpose: form.purpose, note: form.note });
      setMsg('Certificate request submitted!');
      setTimeout(() => onDone(), 1200);
    } catch (err) {
      setMsg(err?.message || 'Failed to submit.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#f8fafc', border: '1px solid var(--clr-border)', borderRadius: 10, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '.6rem', marginBottom: '.75rem' }}>
      <textarea
        placeholder="Purpose of certificate *"
        value={form.purpose}
        onChange={e => setForm(p => ({ ...p, purpose: e.target.value }))}
        required
        maxLength={2000}
        rows={3}
        style={{ padding: '.5rem .75rem', border: '1px solid var(--clr-border)', borderRadius: 8, fontSize: '.92rem', resize: 'vertical' }}
      />
      <textarea
        placeholder="Additional note (optional)"
        value={form.note}
        onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
        maxLength={2000}
        rows={2}
        style={{ padding: '.5rem .75rem', border: '1px solid var(--clr-border)', borderRadius: 8, fontSize: '.92rem', resize: 'vertical' }}
      />
      {msg && <p style={{ fontSize: '.85rem', color: msg.includes('submitted') ? '#15803d' : '#dc2626' }}>{msg}</p>}
      <div style={{ display: 'flex', gap: '.5rem' }}>
        <button type="submit" className="btn btn-primary btn-sm" disabled={busy}><Send size={13} /> {busy ? 'Submitting…' : 'Submit'}</button>
        <button type="button" className="btn btn-outline btn-sm" onClick={() => onDone()}>Cancel</button>
      </div>
    </form>
  );
}

export default function MemberApplicationsPage() {
  const [apps, setApps] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCertForm, setShowCertForm] = useState(false);

  async function load(force = false) {
    if (!force && apps !== null) return;
    setLoading(true);
    setError('');
    try {
      const res = await memberApi.getApplications();
      setApps(res?.data ?? res ?? {});
    } catch (e) {
      setError(e?.message || 'Failed to load applications.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []); // eslint-disable-line

  const handleRefresh = () => {
    setApps(null);
    setError('');
    setTimeout(() => load(true), 0);
  };

  if (loading) return (
    <div className="member-panel">
      <div className="member-page-head"><div><h1>Applications</h1></div></div>
      <SkeletonSection />
    </div>
  );

  const membership = apps?.membership;
  const committeeApps = apps?.committee_applications || [];
  const eventApps = apps?.event_applications || [];
  const certRequests = apps?.certificate_requests || [];

  return (
    <div className="member-panel">
      <div className="member-page-head">
        <div>
          <h1>Applications</h1>
          <p>Track membership, committee, event, and certificate requests.</p>
        </div>
        <button type="button" className="btn btn-outline btn-sm" onClick={handleRefresh}><RefreshCw size={14} /> Refresh</button>
      </div>

      {error && (
        <div className="member-inline-alert">
          <span>{error}</span>
          <button type="button" className="btn btn-outline btn-sm" onClick={handleRefresh}>Retry</button>
        </div>
      )}

      {/* Membership Application */}
      <SectionHeader title="Membership Application" />
      {membership ? (
        <article className="member-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '.75rem' }}>
          <div>
            <p className="member-card__title" style={{ marginBottom: '.25rem' }}>{membership.full_name || 'Application'}</p>
            <p className="member-card__meta" style={{ margin: 0 }}>Submitted {fmt(membership.created_at)}</p>
          </div>
          <StatusBadge status={membership.status} />
        </article>
      ) : (
        <div className="member-empty">
          <FileText size={24} style={{ marginBottom: '.35rem' }} />
          <p>No membership application on record.</p>
        </div>
      )}

      {/* Committee Applications */}
      <SectionHeader title="Committee Applications" count={committeeApps.length} />
      {committeeApps.length === 0 ? (
        <div className="member-empty"><p>No committee applications submitted yet.</p></div>
      ) : (
        <div className="member-grid">
          {committeeApps.map(a => (
            <article key={a.id} className="member-card">
              <p className="member-card__title">{a.desired_committee_level || 'Committee'}</p>
              <p className="member-card__meta">{fmt(a.created_at)}</p>
              <StatusBadge status={a.status} />
            </article>
          ))}
        </div>
      )}

      {/* Event Applications */}
      <SectionHeader title="Event Registrations" count={eventApps.length} />
      {eventApps.length === 0 ? (
        <div className="member-empty"><p>No event registrations yet. Browse events to join.</p></div>
      ) : (
        <div className="member-grid">
          {eventApps.map(r => (
            <article key={r.id} className="member-card">
              <p className="member-card__title">{r.event?.title || 'Event'}</p>
              <p className="member-card__meta">{fmt(r.event?.event_at)}</p>
              <StatusBadge status={r.status} />
            </article>
          ))}
        </div>
      )}

      {/* Certificate Requests */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', margin: '1.25rem 0 .65rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>Certificate Requests</h3>
          <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: 999, padding: '1px 8px', fontSize: '.78rem', fontWeight: 700 }}>{certRequests.length}</span>
        </div>
        <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowCertForm(v => !v)}>
          <FileText size={13} /> {showCertForm ? 'Cancel' : 'New Request'}
        </button>
      </div>

      {showCertForm && <CertForm onDone={() => { setShowCertForm(false); handleRefresh(); }} />}

      {certRequests.length === 0 ? (
        <div className="member-empty"><p>No certificate requests yet.</p></div>
      ) : (
        <div className="member-grid">
          {certRequests.map(c => (
            <article key={c.id} className="member-card">
              <p className="member-card__title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.purpose}</p>
              <p className="member-card__meta">{fmt(c.created_at)}</p>
              <StatusBadge status={c.status} />
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
