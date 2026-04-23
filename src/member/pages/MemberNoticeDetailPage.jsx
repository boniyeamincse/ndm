import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { memberApi } from '../../services/memberApi';

export default function MemberNoticeDetailPage() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const json = await memberApi.request(`/member/notices/${slug}`);
        setNotice(json?.data || null);
      } catch (err) {
        setError(err?.message || 'Failed to load notice.');
        setNotice(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [slug]);

  return (
    <div className="member-panel">
      <div className="member-page-head">
        <div>
          <h1>Notice Detail</h1>
          <p>Read full notice content and associated metadata.</p>
        </div>
      </div>

      <Link to="/member/notices" className="btn btn-outline btn-sm" style={{ marginBottom: '.9rem' }}>
        <ArrowLeft size={14} /> Back to Notices
      </Link>

      {loading && (
        <>
          <div className="member-skeleton" style={{ width: '42%', marginBottom: '.6rem' }} />
          <div className="member-skeleton" style={{ width: '90%', marginBottom: '.45rem' }} />
          <div className="member-skeleton" style={{ width: '84%', marginBottom: '.45rem' }} />
          <div className="member-skeleton" style={{ width: '78%' }} />
        </>
      )}

      {!loading && error && <div className="member-inline-alert"><span>{error}</span></div>}

      {!loading && !error && notice && (
        <article className="member-card" style={{ padding: '1.1rem' }}>
          <p className="member-card__title" style={{ fontSize: '1.15rem' }}>{notice.title}</p>
          <p className="member-card__meta">Priority: {notice.priority || 'normal'} | Type: {notice.notice_type || 'notice'}</p>
          <div style={{ marginTop: '.8rem', lineHeight: 1.7 }}>
            {notice.content || notice.summary || 'No detail content available.'}
          </div>
        </article>
      )}
    </div>
  );
}
