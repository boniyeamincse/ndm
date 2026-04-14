import { Eye, Pencil, Send, Archive, Star, Trash2, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ContentActionPanel from '../../shared/components/ContentActionPanel';

export default function PostActionPanel({ post, onWorkflowOpen }) {
  const navigate = useNavigate();

  return (
    <ContentActionPanel title="Publishing Actions">
      <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => navigate(`/admin/posts/${post.id}/edit`)}><Pencil size={16} /> Edit Post</button>
      <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onWorkflowOpen('publish')}><Send size={16} /> Publish</button>
      <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onWorkflowOpen('unpublish')}><Eye size={16} /> Unpublish</button>
      <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onWorkflowOpen('archive')}><Archive size={16} /> Archive</button>
      <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onWorkflowOpen('feature')}><Star size={16} /> Feature Toggle</button>
      <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onWorkflowOpen(post.status === 'archived' ? 'restore' : 'delete')}>
        {post.status === 'archived' ? <RotateCcw size={16} /> : <Trash2 size={16} />}
        {post.status === 'archived' ? 'Restore' : 'Delete'}
      </button>
    </ContentActionPanel>
  );
}
