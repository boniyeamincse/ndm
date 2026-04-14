import { Clock } from 'lucide-react';
import EmptyState from './EmptyState';
import { SkeletonList } from './Skeleton';

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const TYPE_COLORS = {
  member:      '#2980B9',
  application: '#F39C12',
  committee:   '#8E44AD',
  post:        '#27AE60',
  notice:      '#C0392B',
  system:      '#64748b',
};

export default function RecentActivityList({ data = [], loading }) {
  if (loading) return <SkeletonList count={5} />;
  if (!data.length) return <EmptyState icon={Clock} title="No recent activity" subtitle="Activity will appear here as events occur." />;

  return (
    <ul className="adm-activity-list">
      {data.map((item) => (
        <li key={item.id} className="adm-activity-item">
          <span
            className="adm-activity-dot"
            style={{ background: TYPE_COLORS[item.type] || TYPE_COLORS.system }}
          />
          <div className="adm-activity-body">
            <p className="adm-activity-desc">{item.description}</p>
            <span className="adm-activity-time">{timeAgo(item.created_at)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
