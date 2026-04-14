import { useNavigate } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import EmptyState from './EmptyState';
import { SkeletonList } from './Skeleton';

const PRIORITY_COLORS = { high: '#C0392B', medium: '#F39C12', low: '#27AE60' };

export default function PendingTaskCard({ data = [], loading }) {
  const navigate = useNavigate();

  if (loading) return <SkeletonList count={4} />;
  if (!data.length) return <EmptyState icon={ClipboardList} title="No pending tasks" subtitle="All caught up! No items need attention." />;

  return (
    <ul className="adm-task-list">
      {data.map((item) => (
        <li key={item.id} className="adm-task-item">
          <span
            className="adm-task-priority"
            style={{ background: PRIORITY_COLORS[item.priority] || '#64748b' }}
            title={item.priority}
          />
          <div className="adm-task-body">
            <p className="adm-task-label">{item.label}</p>
            <span className="adm-task-count">{item.count} pending</span>
          </div>
          {item.route && (
            <button
              className="adm-task-btn"
              onClick={() => navigate(item.route)}
            >
              Review →
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
