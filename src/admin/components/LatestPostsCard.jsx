import { useNavigate } from 'react-router-dom';
import { Newspaper } from 'lucide-react';
import EmptyState from './EmptyState';
import { SkeletonList } from './Skeleton';

export default function LatestPostsCard({ data = [], loading }) {
  const navigate = useNavigate();

  if (loading) return <SkeletonList count={3} />;
  if (!data.length) return <EmptyState icon={Newspaper} title="No posts" subtitle="Published blog posts will appear here." />;

  return (
    <ul className="adm-content-list">
      {data.map((item) => (
        <li key={item.id} className="adm-content-item">
          <div className="adm-content-item__icon adm-content-item__icon--post">
            <Newspaper size={14} />
          </div>
          <div className="adm-content-item__body">
            <p className="adm-content-item__title">{item.title}</p>
            <span className="adm-content-item__meta">
              {item.content_type && <span style={{ textTransform: 'capitalize', marginRight: 4 }}>{item.content_type}</span>}
              {item.author && <span>{item.author} · </span>}
              {new Date(item.published_at || item.publish_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <button
            className="adm-content-item__link"
            onClick={() => navigate(`/admin/posts/${item.id}`)}
          >
            View
          </button>
        </li>
      ))}
    </ul>
  );
}
