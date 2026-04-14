import { Eye, Pencil, Send, Archive, Star } from 'lucide-react';
import PostStatusBadge from '../../shared/components/PostStatusBadge';
import PostVisibilityBadge from '../../shared/components/PostVisibilityBadge';
import PostTypeBadge from '../../shared/components/PostTypeBadge';
import { formatDate } from '../../shared/utils/contentFormatters';

export default function PostCard({ item, onView, onEdit, onWorkflow }) {
  return (
    <article className="ndm-mobile-card cnt-mobile-card">
      <div className="cnt-mobile-card__head">
        <div>
          <h3>{item.title}</h3>
          <p>{item.author_name}</p>
        </div>
        <span className="cnt-pill cnt-pill--slate">{item.post_no}</span>
      </div>
      <div className="cnt-mobile-card__badges">
        <PostTypeBadge value={item.content_type} />
        <PostStatusBadge value={item.status} />
        <PostVisibilityBadge value={item.visibility} />
        {item.is_featured ? <span className="cnt-pill cnt-pill--amber">Featured</span> : null}
      </div>
      <div className="cnt-mobile-card__meta">
        <span>Published {formatDate(item.published_at)}</span>
        <span>{item.category_name}</span>
      </div>
      <div className="ndm-table__actions cnt-mobile-card__footer">
        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onView(item.id)}><Eye size={15} /> View</button>
        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onEdit(item.id)}><Pencil size={15} /> Edit</button>
        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onWorkflow('publish', item)}><Send size={15} /> Publish</button>
        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onWorkflow('feature', item)}><Star size={15} /> Feature</button>
        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onWorkflow('archive', item)}><Archive size={15} /> Archive</button>
      </div>
    </article>
  );
}
