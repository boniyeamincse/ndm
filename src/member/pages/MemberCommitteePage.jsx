import { useEffect, useState } from 'react';
import { Users, RefreshCw } from 'lucide-react';
import { memberApi } from '../../services/memberApi';

export default function MemberCommitteePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rows, setRows] = useState([]);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await memberApi.getCommitteeAssignments({ per_page: 12, active_only: true });
      setRows(Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
    } catch (err) {
      setError(err?.message || 'Failed to load committee assignments.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="member-panel">
      <div className="member-page-head">
        <div>
          <h1>Committee</h1>
          <p>My Committee, role, members context, and committee-linked activity view.</p>
        </div>
        <button type="button" className="btn btn-outline btn-sm" onClick={load}><RefreshCw size={14} /> Refresh</button>
      </div>

      {error && (
        <div className="member-inline-alert">
          <span>{error}</span>
          <button type="button" className="btn btn-outline btn-sm" onClick={load}>Retry</button>
        </div>
      )}

      {loading ? (
        <div className="member-grid">
          {[1, 2, 3, 4].map(i => (
            <div className="member-card" key={i}>
              <div className="member-skeleton" style={{ width: '50%', marginBottom: '.6rem' }} />
              <div className="member-skeleton" style={{ width: '85%', marginBottom: '.45rem' }} />
              <div className="member-skeleton" style={{ width: '65%' }} />
            </div>
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="member-empty">
          <Users size={28} style={{ marginBottom: '.45rem' }} />
          <p>No active committee assignment found. You can apply from Applications module.</p>
        </div>
      ) : (
        <div className="member-grid">
          {rows.map(item => (
            <article key={item.assignment_id || item.id} className="member-card">
              <p className="member-card__title">{item.committee_name || item.committee?.name || 'Committee'}</p>
              <p className="member-card__meta">Role: {item.position_name || item.position?.name || 'N/A'}</p>
              <p className="member-card__meta">Status: {item.status || (item.is_active ? 'active' : 'inactive')}</p>
              <p style={{ fontSize: '.9rem' }}>{item.is_leadership ? 'Leadership assignment' : 'General assignment'}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
