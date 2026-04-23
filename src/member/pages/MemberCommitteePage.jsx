import { useEffect, useState } from 'react';
import { Users, RefreshCw, User2, Activity, Send } from 'lucide-react';
import { memberApi } from '../../services/memberApi';

const TABS = ['overview', 'members', 'activities'];

function SkeletonGrid() {
  return (
    <div className="member-grid">
      {[1, 2, 3, 4].map(i => (
        <div className="member-card" key={i}>
          <div className="member-skeleton" style={{ width: '50%', marginBottom: '.6rem' }} />
          <div className="member-skeleton" style={{ width: '85%', marginBottom: '.45rem' }} />
          <div className="member-skeleton" style={{ width: '65%' }} />
        </div>
      ))}
    </div>
  );
}

export default function MemberCommitteePage() {
  const [tab, setTab] = useState('overview');
  const [data, setData] = useState({ overview: null, members: null, activities: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [applyMsg, setApplyMsg] = useState('');

  async function load(t = tab, force = false) {
    if (!force && data[t] !== null) return;
    setLoading(true);
    setError('');
    try {
      let res;
      if (t === 'overview') res = await memberApi.getMyCommittee();
      else if (t === 'members') res = await memberApi.getCommitteeMembers();
      else res = await memberApi.getCommitteeActivities();
      const val = res?.data !== undefined ? res.data : res;
      setData(prev => ({ ...prev, [t]: Array.isArray(val) ? val : val ?? null }));
    } catch (e) {
      setError(e?.message || 'Failed to load data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(tab); }, [tab]); // eslint-disable-line

  const handleRefresh = () => {
    setData(prev => ({ ...prev, [tab]: null }));
    setError('');
    setTimeout(() => load(tab, true), 0);
  };

  const handleApply = async () => {
    setApplying(true);
    setApplyMsg('');
    try {
      await memberApi.applyForCommittee({});
      setApplyMsg('Application submitted successfully! It is pending review.');
    } catch (e) {
      setApplyMsg(e?.message || 'Application failed.');
    } finally {
      setApplying(false);
    }
  };

  const current = data[tab];

  const renderOverview = () => {
    if (!current) return (
      <div className="member-empty">
        <Users size={28} style={{ marginBottom: '.45rem' }} />
        <p>No active committee assignment found.</p>
        <button type="button" className="btn btn-outline btn-sm" style={{ marginTop: '.75rem' }} onClick={handleApply} disabled={applying}>
          <Send size={14} /> {applying ? 'Submitting…' : 'Apply for Committee'}
        </button>
      </div>
    );

    const committee = current.committee || {};
    const position = current.position || {};
    return (
      <div className="member-grid">
        <article className="member-card">
          <p className="member-card__meta" style={{ margin: 0 }}>Committee</p>
          <p className="member-card__title">{committee.name || 'N/A'}</p>
          <p className="member-card__meta">{committee.status || ''}</p>
        </article>
        <article className="member-card">
          <p className="member-card__meta" style={{ margin: 0 }}>Your Position</p>
          <p className="member-card__title">{position.name || 'N/A'}</p>
          {position.name_bn && <p className="member-card__meta">{position.name_bn}</p>}
        </article>
        <article className="member-card">
          <p className="member-card__meta" style={{ margin: 0 }}>Assignment Type</p>
          <p className="member-card__title">{current.is_leadership ? 'Leadership' : 'General'}</p>
          <p className="member-card__meta">{current.is_primary ? 'Primary assignment' : 'Secondary'}</p>
        </article>
        <article className="member-card">
          <p className="member-card__meta" style={{ margin: 0 }}>Status</p>
          <p className="member-card__title" style={{ textTransform: 'capitalize' }}>{current.is_active ? 'Active' : 'Inactive'}</p>
          {current.assigned_at && <p className="member-card__meta">Since {new Date(current.assigned_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</p>}
        </article>
      </div>
    );
  };

  const renderMembers = () => {
    const rows = Array.isArray(current) ? current : [];
    if (!rows.length) return (
      <div className="member-empty">
        <User2 size={28} style={{ marginBottom: '.45rem' }} />
        <p>No committee members found.</p>
      </div>
    );
    return (
      <div className="member-grid">
        {rows.map(r => {
          const m = r.member || {};
          const pos = r.position || {};
          return (
            <article key={r.id} className="member-card" style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
              {m.photo ? (
                <img src={`/storage/${m.photo}`} alt={m.full_name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <span style={{ width: 40, height: 40, borderRadius: '50%', background: '#e2e8f0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#64748b', flexShrink: 0 }}>
                  {(m.full_name || '?').charAt(0)}
                </span>
              )}
              <div style={{ minWidth: 0 }}>
                <p className="member-card__title" style={{ marginBottom: '.1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.full_name || 'Member'}</p>
                <p className="member-card__meta" style={{ margin: 0 }}>{pos.name || 'Member'}{r.is_leadership ? ' · Leadership' : ''}</p>
              </div>
            </article>
          );
        })}
      </div>
    );
  };

  const renderActivities = () => {
    const rows = Array.isArray(current) ? current : [];
    if (!rows.length) return (
      <div className="member-empty">
        <Activity size={28} style={{ marginBottom: '.45rem' }} />
        <p>No committee activities recorded yet.</p>
      </div>
    );
    return (
      <div className="member-grid">
        {rows.map(a => (
          <article key={a.id} className="member-card">
            <p className="member-card__title">{a.title || 'Activity'}</p>
            {a.activity_at && <p className="member-card__meta">{new Date(a.activity_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>}
            {a.description && <p style={{ fontSize: '.9rem', marginTop: '.35rem' }}>{a.description}</p>}
          </article>
        ))}
      </div>
    );
  };

  return (
    <div className="member-panel">
      <div className="member-page-head">
        <div>
          <h1>Committee</h1>
          <p>Your assignment, committee members, and shared activities.</p>
        </div>
        <button type="button" className="btn btn-outline btn-sm" onClick={handleRefresh}><RefreshCw size={14} /> Refresh</button>
      </div>

      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t} type="button" className={`btn btn-sm ${tab === t ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>
            {t === 'overview' ? 'My Assignment' : t === 'members' ? 'Members' : 'Activities'}
          </button>
        ))}
      </div>

      {applyMsg && (
        <div className="member-inline-alert" style={applyMsg.includes('success') ? { background: '#f0fdf4', color: '#15803d', borderColor: '#bbf7d0' } : {}}>
          <span>{applyMsg}</span>
        </div>
      )}

      {error && (
        <div className="member-inline-alert">
          <span>{error}</span>
          <button type="button" className="btn btn-outline btn-sm" onClick={handleRefresh}>Retry</button>
        </div>
      )}

      {loading ? <SkeletonGrid /> : (
        tab === 'overview' ? renderOverview() : tab === 'members' ? renderMembers() : renderActivities()
      )}
    </div>
  );
}
