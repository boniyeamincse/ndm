import { Eye, Pencil, Send, Pin, Paperclip } from 'lucide-react';
import NoticeAudienceBadge from '../../shared/components/NoticeAudienceBadge';
import NoticePriorityBadge from '../../shared/components/NoticePriorityBadge';
import NoticeStatusBadge from '../../shared/components/NoticeStatusBadge';
import NoticeVisibilityBadge from '../../shared/components/NoticeVisibilityBadge';
import { formatDate } from '../../shared/utils/contentFormatters';

export default function NoticeCard({ item, onView, onEdit, onWorkflow, onManageAttachments }) {
  return (
    <article className="ndm-mobile-card cnt-mobile-card">
      <div className="cnt-mobile-card__head">
        <div>
          <h3>{item.title}</h3>
          <p>{item.notice_no}</p>
        </div>
        {item.is_pinned ? <span className="cnt-pill cnt-pill--amber">Pinned</span> : null}
      </div>
      <div className="cnt-mobile-card__badges">
        <NoticePriorityBadge value={item.priority} />
        <NoticeStatusBadge value={item.status} />
        <NoticeVisibilityBadge value={item.visibility} />
        <NoticeAudienceBadge value={item.audience_type} />
      </div>
      <div className="cnt-mobile-card__meta">
        <span>Publish {formatDate(item.publish_at)}</span>
        <span>Expires {formatDate(item.expires_at)}</span>
      </div>
      <div className="ndm-table__actions cnt-mobile-card__footer">
        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onView(item.id)}><Eye size={15} /> View</button>
        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onEdit(item.id)}><Pencil size={15} /> Edit</button>
        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onWorkflow('publish', item)}><Send size={15} /> Publish</button>
        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onWorkflow('pin', item)}><Pin size={15} /> Pin</button>
        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onManageAttachments(item)}><Paperclip size={15} /> Files</button>
      </div>
    </article>
  );
}
