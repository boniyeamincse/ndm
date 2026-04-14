import { Users, FileText, Building2, Briefcase, Newspaper, Bell, Clock, TrendingUp, TrendingDown } from 'lucide-react';

const ICONS = { Users, FileText, Building2, Briefcase, Newspaper, Bell };

const CARD_CONFIGS = {
  total_members:                   { label: 'Total Members',           icon: 'Users',     color: '#3498db', bg: '#ebf5fb' },
  active_members:                  { label: 'Active Members',          icon: 'Users',     color: '#27ae60', bg: '#eafaf1' },
  pending_applications:            { label: 'Pending Applications',    icon: 'FileText',  color: '#e67e22', bg: '#fef9e7' },
  total_committees:                { label: 'Total Committees',        icon: 'Building2', color: '#8e44ad', bg: '#f5eef8' },
  active_assignments:              { label: 'Active Assignments',      icon: 'Briefcase', color: '#16a085', bg: '#e8f8f5' },
  published_posts:                 { label: 'Published Posts',         icon: 'Newspaper', color: '#2980b9', bg: '#eaf4fb' },
  published_notices:               { label: 'Active Notices',          icon: 'Bell',      color: '#c0392b', bg: '#fdedec' },
  profile_update_requests_pending: { label: 'Pending Profile Requests',icon: 'FileText',  color: '#7f8c8d', bg: '#f2f3f4' },
};

export default function StatCard({ statKey, value, trend }) {
  const cfg = CARD_CONFIGS[statKey] || { label: statKey, icon: 'FileText', color: '#555', bg: '#f5f5f5' };
  const Icon = ICONS[cfg.icon] || FileText;

  const formatted = typeof value === 'number' ? value.toLocaleString() : value ?? '—';

  return (
    <div className="adm-stat-card" style={{ '--card-accent': cfg.color }}>
      <div className="adm-stat-card__icon" style={{ background: cfg.bg, color: cfg.color }}>
        <Icon size={22} strokeWidth={2} />
      </div>
      <div className="adm-stat-card__body">
        <span className="adm-stat-card__value">{formatted}</span>
        <span className="adm-stat-card__label">{cfg.label}</span>
        {trend != null && (
          <span className={`adm-stat-card__trend ${trend >= 0 ? 'up' : 'down'}`}>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}% this month
          </span>
        )}
      </div>
    </div>
  );
}
