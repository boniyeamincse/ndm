import { Paperclip, Pencil, Pin, Send, Archive, Trash2, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ContentActionPanel from '../../shared/components/ContentActionPanel';

export default function NoticeActionPanel({ notice, onWorkflowOpen, onAttachmentOpen }) {
  const navigate = useNavigate();

  return (
    <ContentActionPanel title="Notice Actions">
      <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => navigate(`/admin/notices/${notice.id}/edit`)}><Pencil size={16} /> Edit Notice</button>
      <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onWorkflowOpen('publish')}><Send size={16} /> Publish</button>
      <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onWorkflowOpen('unpublish')}><Send size={16} /> Unpublish</button>
      <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onWorkflowOpen('archive')}><Archive size={16} /> Archive</button>
      <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onWorkflowOpen('pin')}><Pin size={16} /> Pin / Unpin</button>
      <button type="button" className="ndm-btn ndm-btn--ghost" onClick={onAttachmentOpen}><Paperclip size={16} /> Add Attachment</button>
      <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onWorkflowOpen(notice.status === 'archived' ? 'restore' : 'delete')}>
        {notice.status === 'archived' ? <RotateCcw size={16} /> : <Trash2 size={16} />}
        {notice.status === 'archived' ? 'Restore' : 'Delete'}
      </button>
    </ContentActionPanel>
  );
}
