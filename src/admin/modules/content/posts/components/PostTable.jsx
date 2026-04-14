import { Eye, Pencil, Send, Archive, Star, Trash2, RotateCcw } from 'lucide-react';
import ContentTable from '../../shared/components/ContentTable';
import PostStatusBadge from '../../shared/components/PostStatusBadge';
import PostVisibilityBadge from '../../shared/components/PostVisibilityBadge';
import PostTypeBadge from '../../shared/components/PostTypeBadge';
import { formatDateTime } from '../../shared/utils/contentFormatters';

export default function PostTable({ items, onView, onEdit, onWorkflow }) {
  return (
    <ContentTable
      testId="posts-table"
      columns={[
        { key: 'select', label: '' },
        { key: 'post_no', label: 'Post No' },
        { key: 'title', label: 'Title' },
        { key: 'content_type', label: 'Content Type' },
        { key: 'category', label: 'Category' },
        { key: 'author', label: 'Author' },
        { key: 'status', label: 'Status' },
        { key: 'visibility', label: 'Visibility' },
        { key: 'featured', label: 'Featured' },
        { key: 'published_at', label: 'Published At' },
        { key: 'actions', label: 'Actions' },
      ]}
      rows={items}
      renderRow={(item) => (
        <tr key={item.id}>
          <td><input type="checkbox" aria-label={`Select ${item.title}`} /></td>
          <td>{item.post_no}</td>
          <td>
            <div className="cnt-table-title">
              <strong>{item.title}</strong>
              <span>{item.slug}</span>
            </div>
          </td>
          <td><PostTypeBadge value={item.content_type} /></td>
          <td>{item.category_name}</td>
          <td>{item.author_name}</td>
          <td><PostStatusBadge value={item.status} /></td>
          <td><PostVisibilityBadge value={item.visibility} /></td>
          <td>{item.is_featured ? <span className="cnt-pill cnt-pill--amber">Featured</span> : '—'}</td>
          <td>{formatDateTime(item.published_at)}</td>
          <td>
            <div className="ndm-table__actions">
              <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onView(item.id)}><Eye size={15} /></button>
              <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onEdit(item.id)}><Pencil size={15} /></button>
              <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onWorkflow('publish', item)}><Send size={15} /></button>
              <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onWorkflow('archive', item)}><Archive size={15} /></button>
              <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onWorkflow('feature', item)}><Star size={15} /></button>
              <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onWorkflow(item.status === 'archived' ? 'restore' : 'delete', item)}>
                {item.status === 'archived' ? <RotateCcw size={15} /> : <Trash2 size={15} />}
              </button>
            </div>
          </td>
        </tr>
      )}
    />
  );
}
