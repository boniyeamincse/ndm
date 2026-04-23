import { useEffect, useState } from 'react';
import { MessageCircleMore, Bell, MessagesSquare, RefreshCw, Send } from 'lucide-react';
import { memberApi } from '../../services/memberApi';

const TABS = ['messages', 'announcements', 'discussions'];

function fmt(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function SkeletonList() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
      {[1, 2, 3].map(i => (
        <div className="member-card" key={i}>
          <div className="member-skeleton" style={{ width: '60%', marginBottom: '.5rem' }} />
          <div className="member-skeleton" style={{ width: '90%', marginBottom: '.35rem' }} />
          <div className="member-skeleton" style={{ width: '40%' }} />
        </div>
      ))}
    </div>
  );
}

export default function MemberCommunicationPage() {
  const [tab, setTab] = useState('messages');
  const [data, setData] = useState({ messages: null, announcements: null, discussions: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Compose / send message state
  const [showMessageCompose, setShowMessageCompose] = useState(false);
  const [messageForm, setMessageForm] = useState({ subject: '', body: '' });
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageStatus, setMessageStatus] = useState('');

  // Compose / new discussion state
  const [showCompose, setShowCompose] = useState(false);
  const [form, setForm] = useState({ title: '', body: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState('');

  async function load(t = tab, force = false) {
    if (!force && data[t] !== null) return;
    setLoading(true);
    setError('');
    try {
      let res;
      if (t === 'messages') res = await memberApi.getMessages();
      else if (t === 'announcements') res = await memberApi.getAnnouncements();
      else res = await memberApi.getDiscussions();
      const val = res?.data ?? (Array.isArray(res) ? res : []);
      setData(prev => ({ ...prev, [t]: val }));
    } catch (e) {
      setError(e?.message || 'Failed to load.');
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

  const handleDiscussionSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    setSubmitting(true);
    setSubmitMsg('');
    try {
      await memberApi.createDiscussion({ title: form.title, body: form.body });
      setSubmitMsg('Discussion posted!');
      setForm({ title: '', body: '' });
      setShowCompose(false);
      setData(prev => ({ ...prev, discussions: null }));
    } catch (e2) {
      setSubmitMsg(e2?.message || 'Failed to post discussion.');
    } finally {
      setSubmitting(false);
    }
  };

  const rows = Array.isArray(data[tab]) ? data[tab] : [];

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (!messageForm.body.trim()) return;

    setSendingMessage(true);
    setMessageStatus('');

    try {
      const res = await memberApi.sendMessageToAllMembers({
        subject: messageForm.subject?.trim() || null,
        body: messageForm.body.trim(),
      });

      const sentCount = res?.data?.sent_count || 0;
      setMessageStatus(`SMS sent to ${sentCount} members.`);
      setMessageForm({ subject: '', body: '' });
      setShowMessageCompose(false);
      setData(prev => ({ ...prev, messages: null }));
    } catch (e2) {
      setMessageStatus(e2?.message || 'Failed to send message.');
    } finally {
      setSendingMessage(false);
    }
  };

  const renderMessages = () => {
    return (
      <>
        {showMessageCompose && (
          <form onSubmit={handleMessageSubmit} style={{ background: '#f8fafc', border: '1px solid var(--clr-border)', borderRadius: 10, padding: '1rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
            <p className="member-card__meta" style={{ margin: 0, color: '#0f172a' }}>
              Broadcast this SMS to all member accounts.
            </p>
            <input
              className="form-input"
              placeholder="Subject (optional)"
              value={messageForm.subject}
              onChange={e => setMessageForm(p => ({ ...p, subject: e.target.value }))}
              maxLength={255}
              style={{ padding: '.5rem .75rem', border: '1px solid var(--clr-border)', borderRadius: 8, fontSize: '.92rem' }}
            />
            <textarea
              className="form-input"
              placeholder="Write your SMS/message..."
              value={messageForm.body}
              onChange={e => setMessageForm(p => ({ ...p, body: e.target.value }))}
              required
              maxLength={5000}
              rows={4}
              style={{ padding: '.5rem .75rem', border: '1px solid var(--clr-border)', borderRadius: 8, fontSize: '.92rem', resize: 'vertical' }}
            />
            {messageStatus && (
              <p style={{ fontSize: '.85rem', color: messageStatus.startsWith('SMS sent') ? '#15803d' : '#dc2626' }}>
                {messageStatus}
              </p>
            )}
            <div style={{ display: 'flex', gap: '.5rem' }}>
              <button type="submit" className="btn btn-primary btn-sm" disabled={sendingMessage}>
                <Send size={13} /> {sendingMessage ? 'Sending…' : 'Send SMS to All'}
              </button>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowMessageCompose(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {!rows.length ? (
          <div className="member-empty">
            <MessageCircleMore size={28} style={{ marginBottom: '.45rem' }} />
            <p>No messages yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
            {rows.map(msg => (
              <article key={msg.id} className="member-card" style={{ display: 'flex', flexDirection: 'column', gap: '.3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '.5rem' }}>
                  <p className="member-card__title" style={{ marginBottom: 0 }}>{msg.subject || '(No subject)'}</p>
                  {!msg.is_read && <span style={{ background: '#1d4ed8', color: '#fff', borderRadius: 999, padding: '1px 8px', fontSize: '.72rem', fontWeight: 700 }}>Unread</span>}
                </div>
                <p className="member-card__meta" style={{ margin: 0 }}>
                  From: {msg.sender?.name || 'Admin'} · {fmt(msg.created_at)}
                </p>
                <p style={{ fontSize: '.9rem', color: '#475569', marginTop: '.2rem', lineClamp: 2, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {msg.body}
                </p>
              </article>
            ))}
          </div>
        )}
      </>
    );
  };

  const renderAnnouncements = () => {
    if (!rows.length) return (
      <div className="member-empty">
        <Bell size={28} style={{ marginBottom: '.45rem' }} />
        <p>No announcements at the moment.</p>
      </div>
    );
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
        {rows.map(a => (
          <article key={a.id} className="member-card" style={{ display: 'flex', flexDirection: 'column', gap: '.3rem' }}>
            <p className="member-card__title" style={{ marginBottom: 0 }}>{a.title}</p>
            <p className="member-card__meta" style={{ margin: 0 }}>{fmt(a.publish_at || a.created_at)}</p>
            {a.body && <p style={{ fontSize: '.9rem', color: '#475569', marginTop: '.2rem' }}>{a.body}</p>}
          </article>
        ))}
      </div>
    );
  };

  const renderDiscussions = () => (
    <>
      {showCompose && (
        <form onSubmit={handleDiscussionSubmit} style={{ background: '#f8fafc', border: '1px solid var(--clr-border)', borderRadius: 10, padding: '1rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
          <input
            className="form-input"
            placeholder="Discussion title"
            value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            required
            maxLength={255}
            style={{ padding: '.5rem .75rem', border: '1px solid var(--clr-border)', borderRadius: 8, fontSize: '.92rem' }}
          />
          <textarea
            className="form-input"
            placeholder="Share your thoughts…"
            value={form.body}
            onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
            required
            maxLength={5000}
            rows={4}
            style={{ padding: '.5rem .75rem', border: '1px solid var(--clr-border)', borderRadius: 8, fontSize: '.92rem', resize: 'vertical' }}
          />
          {submitMsg && <p style={{ fontSize: '.85rem', color: submitMsg.includes('posted') ? '#15803d' : '#dc2626' }}>{submitMsg}</p>}
          <div style={{ display: 'flex', gap: '.5rem' }}>
            <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}><Send size={13} /> {submitting ? 'Posting…' : 'Post'}</button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowCompose(false)}>Cancel</button>
          </div>
        </form>
      )}

      {!rows.length ? (
        <div className="member-empty">
          <MessagesSquare size={28} style={{ marginBottom: '.45rem' }} />
          <p>No discussions yet. Start one!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
          {rows.map(d => (
            <article key={d.id} className="member-card" style={{ display: 'flex', flexDirection: 'column', gap: '.3rem' }}>
              <p className="member-card__title" style={{ marginBottom: 0 }}>{d.title}</p>
              <p className="member-card__meta" style={{ margin: 0 }}>
                {d.user?.name || 'Member'} · {fmt(d.created_at)}
              </p>
              {d.body && <p style={{ fontSize: '.9rem', color: '#475569', marginTop: '.2rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{d.body}</p>}
            </article>
          ))}
        </div>
      )}
    </>
  );

  const tabIcons = { messages: <MessageCircleMore size={14} />, announcements: <Bell size={14} />, discussions: <MessagesSquare size={14} /> };
  const tabLabels = { messages: 'Messages', announcements: 'Announcements', discussions: 'Discussions' };

  return (
    <div className="member-panel">
      <div className="member-page-head">
        <div>
          <h1>Communication</h1>
          <p>Inbox, announcements, and member discussions.</p>
        </div>
        <div style={{ display: 'flex', gap: '.5rem' }}>
          {tab === 'messages' && (
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setShowMessageCompose(v => !v)}>
              <Send size={14} /> SMS All Members
            </button>
          )}
          {tab === 'discussions' && (
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setShowCompose(v => !v)}>
              <MessagesSquare size={14} /> New Discussion
            </button>
          )}
          <button type="button" className="btn btn-outline btn-sm" onClick={handleRefresh}><RefreshCw size={14} /></button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t} type="button" className={`btn btn-sm ${tab === t ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab(t)} style={{ display: 'inline-flex', alignItems: 'center', gap: '.35rem' }}>
            {tabIcons[t]} {tabLabels[t]}
          </button>
        ))}
      </div>

      {error && (
        <div className="member-inline-alert">
          <span>{error}</span>
          <button type="button" className="btn btn-outline btn-sm" onClick={handleRefresh}>Retry</button>
        </div>
      )}

      {loading ? <SkeletonList /> : (
        tab === 'messages' ? renderMessages() : tab === 'announcements' ? renderAnnouncements() : renderDiscussions()
      )}
    </div>
  );
}
