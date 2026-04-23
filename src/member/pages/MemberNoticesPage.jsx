import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, RefreshCw, ArrowRight } from 'lucide-react';
import { memberApi } from '../../services/memberApi';

export default function MemberNoticesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rows, setRows] = useState([]);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const json = await memberApi.getMemberNotices({ per_page: 12 });
      setRows(Array.isArray(json?.data) ? json.data : []);
    } catch (err) {
      setError(err?.message || 'Failed to load notices.');
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
          <h1>Announcements & Notices</h1>
          <p>Organization notices visible to your member profile and committee visibility.</p>
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
            <div key={i} className="member-card">
              <div className="member-skeleton" style={{ width: '35%', marginBottom: '.45rem' }} />
              <div className="member-skeleton" style={{ width: '80%', marginBottom: '.45rem' }} />
              <div className="member-skeleton" style={{ width: '60%' }} />
            </div>
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="member-empty">
          <Bell size={28} style={{ marginBottom: '.45rem' }} />
          <p>No notices found for your current audience filters.</p>
        </div>
      ) : (
        <div className="member-grid">
          {rows.map(notice => (
            <article key={notice.slug} className="member-card">
              <p className="member-card__title">{notice.title}</p>
              <p className="member-card__meta">Priority: {notice.priority || 'normal'}</p>
              <p style={{ marginBottom: '.75rem' }}>{notice.summary || 'No summary available.'}</p>
              <Link to={`/member/notices/${notice.slug}`} className="btn btn-outline btn-sm">
                View Notice <ArrowRight size={14} />
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
