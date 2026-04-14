import SectionCard from '../../../membership/shared/components/SectionCard';
import PostStatusBadge from '../../shared/components/PostStatusBadge';
import PostTypeBadge from '../../shared/components/PostTypeBadge';
import PostVisibilityBadge from '../../shared/components/PostVisibilityBadge';
import { formatDateTime } from '../../shared/utils/contentFormatters';

export default function PostOverviewCard({ post }) {
  return (
    <SectionCard title={post.title} subtitle={post.excerpt}>
      <div className="cnt-overview-head__badges">
        <span className="cnt-pill cnt-pill--slate">{post.post_no}</span>
        <PostTypeBadge value={post.content_type} />
        <PostStatusBadge value={post.status} />
        <PostVisibilityBadge value={post.visibility} />
        {post.is_featured ? <span className="cnt-pill cnt-pill--amber">Featured</span> : null}
        {post.allow_on_homepage ? <span className="cnt-pill cnt-pill--blue">Homepage</span> : null}
      </div>
      <div className="cnt-overview-meta">
        <div><span>Author</span><strong>{post.author_name}</strong></div>
        <div><span>Editor</span><strong>{post.editor_name}</strong></div>
        <div><span>Published</span><strong>{formatDateTime(post.published_at)}</strong></div>
        <div><span>Committee</span><strong>{post.committee_name}</strong></div>
      </div>
    </SectionCard>
  );
}
