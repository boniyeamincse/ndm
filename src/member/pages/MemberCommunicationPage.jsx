import { MessageCircleMore, Bell, MessagesSquare } from 'lucide-react';

export default function MemberCommunicationPage() {
  return (
    <div className="member-panel">
      <div className="member-page-head">
        <div>
          <h1>Communication</h1>
          <p>Inbox/messages, announcement feed, and member discussions.</p>
        </div>
      </div>

      <div className="member-grid">
        <article className="member-card">
          <p className="member-card__title"><MessageCircleMore size={16} style={{ verticalAlign: 'text-bottom' }} /> Inbox / Messages</p>
          <p className="member-card__meta">Unread indicator + threaded detail</p>
          <p>Message list, detail drawer, and compose form placeholder is ready.</p>
        </article>

        <article className="member-card">
          <p className="member-card__title"><Bell size={16} style={{ verticalAlign: 'text-bottom' }} /> Announcements</p>
          <p className="member-card__meta">Official communication stream</p>
          <p>Announcement cards and filters can be plugged in here.</p>
        </article>

        <article className="member-card">
          <p className="member-card__title"><MessagesSquare size={16} style={{ verticalAlign: 'text-bottom' }} /> Discussions</p>
          <p className="member-card__meta">Threaded comments by member groups</p>
          <p>Discussion threads and replies can be attached to this module.</p>
        </article>
      </div>

      <div className="member-empty" style={{ marginTop: '1rem' }}>
        <p>Communication endpoints are not present yet. This page is fully route-ready and responsive.</p>
      </div>
    </div>
  );
}
