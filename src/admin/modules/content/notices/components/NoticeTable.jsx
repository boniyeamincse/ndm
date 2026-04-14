import { Eye, Pencil, Send, Archive, Pin, Paperclip, Trash2, RotateCcw } from 'lucide-react';
import ContentTable from '../../shared/components/ContentTable';
import NoticeAudienceBadge from '../../shared/components/NoticeAudienceBadge';
import NoticePriorityBadge from '../../shared/components/NoticePriorityBadge';
import NoticeStatusBadge from '../../shared/components/NoticeStatusBadge';
import NoticeVisibilityBadge from '../../shared/components/NoticeVisibilityBadge';
import { formatDateTime } from '../../shared/utils/contentFormatters';

export default function NoticeTable({ items, onView, onEdit, onWorkflow, onManageAttachments }) {
  return (
    <ContentTable
      testId="notices-table"
      columns={[
        { key: 'select', label: '' },
        { key: 'notice_no', label: 'Notice No' },
        { key: 'title', label: 'Title' },
        { key: 'notice_type', label: 'Notice Type' },
        { key: 'priority', label: 'Priority' },
        { key: 'status', label: 'Status' },
        { key: 'visibility', label: 'Visibility' },
        { key: 'audience', label: 'Audience' },
        { key: 'committee', label: 'Committee' },
        { key: 'pinned', label: 'Pinned' },
        { key: 'publish_at', label: 'Publish At' },
        { key: 'expires_at', label: 'Expires At' },
        { key: 'attachments', label: 'Attachment Count' },
        { key: 'actions', label: 'Actions' },
      ]}
      rows={items}
      renderRow={(item) => (
        <tr key={item.id}>
          <td><input type="checkbox" aria-label={`Select ${item.title}`} /></td>
          <td>{item.notice_no}</td>
          <td><div className="cnt-table-title"><strong>{item.title}</strong><span>{item.summary}</span></div></td>
          <td>{item.notice_type}</td>
          <td><NoticePriorityBadge value={item.priority} /></td>
          <td><NoticeStatusBadge value={item.status} /></td>
          <td><NoticeVisibilityBadge value={item.visibility} /></td>
          <td><NoticeAudienceBadge value={item.audience_type} /></td>
          <td>{item.committee_name}</td>
          <td>{item.is_pinned ? <span className="cnt-pill cnt-pill--amber">Pinned</span> : '—'}</td>
          <td>{formatDateTime(item.publish_at)}</td>
          <td>{formatDateTime(item.expires_at)}</td>
          <td>{item.attachment_count || 0}</td>
          <td>
            <div className="ndm-table__actions">
              <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onView(item.id)}><Eye size={15} /></button>
              <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onEdit(item.id)}><Pencil size={15} /></button>
              <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onWorkflow('publish', item)}><Send size={15} /></button>
              <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onWorkflow('archive', item)}><Archive size={15} /></button>
              <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onWorkflow('pin', item)}><Pin size={15} /></button>
              <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onManageAttachments(item)}><Paperclip size={15} /></button>
              <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onWorkflow(item.status === 'archived' ? 'restore' : 'delete', item)}>{item.status === 'archived' ? <RotateCcw size={15} /> : <Trash2 size={15} />}</button>
            </div>
          </td>
        </tr>
      )}
    />
  );
}
