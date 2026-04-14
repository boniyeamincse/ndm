import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import EmptyState from './EmptyState';
import { SkeletonList } from './Skeleton';

export default function NoticeListCard({ data = [], loading }) {
  const navigate = useNavigate();

  if (loading) return <SkeletonList count={3} />;
  if (!data.length) return <EmptyState icon={Bell} title="No notices" subtitle="Published notices will appear here." />;

  return (
    <ul className="adm-content-list">
      {data.map((item) => (
        <li key={item.id} className="adm-content-item">
          <div className="adm-content-item__icon adm-content-item__icon--notice">
            <Bell size={14} />
          </div>
          <div className="adm-content-item__body">
            <p className="adm-content-item__title">{item.title}</p>
            <span className="adm-content-item__meta">
              {item.author} · {new Date(item.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <button
            className="adm-content-item__link"
            onClick={() => navigate(`/admin/notices/${item.id}`)}
          >
            View
          </button>
        </li>
      ))}
    </ul>
  );
}
