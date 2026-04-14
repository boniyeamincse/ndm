import { Users, UserCheck, FileText, Building2, Briefcase, Newspaper, Bell, UserCog } from 'lucide-react';
import AdminLayout from '../layouts/AdminLayout';
import WelcomeBanner from '../components/WelcomeBanner';
import StatCard from '../components/StatCard';
import SectionHeader from '../components/SectionHeader';
import { MembershipTrendChart, ApplicationStatusChart, CommitteeTypesChart } from '../components/ChartCard';
import PendingTaskCard from '../components/PendingTaskCard';
import RecentActivityList from '../components/RecentActivityList';
import NoticeListCard from '../components/NoticeListCard';
import LatestPostsCard from '../components/LatestPostsCard';
import QuickActionGrid from '../components/QuickActionGrid';
import { SkeletonStatCards } from '../components/Skeleton';
import {
  useDashboardStats,
  usePendingItems,
  useRecentActivities,
  useLatestContent,
  useDashboardCharts,
} from '../hooks/useDashboard';

const QUICK_ACTIONS = [
  { label: 'Add Member',          icon: Users,      route: '/admin/members/create',                color: '#2980B9' },
  { label: 'Review Applications', icon: FileText,   route: '/admin/membership-applications',       color: '#27AE60' },
  { label: 'Create Committee',    icon: Building2,  route: '/admin/committees/create',             color: '#8E44AD' },
  { label: 'Publish Notice',      icon: Bell,       route: '/admin/notices/create',                color: '#E67E22' },
  { label: 'Add News Post',       icon: Newspaper,  route: '/admin/posts/create',                  color: '#C0392B' },
  { label: 'Profile Requests',    icon: UserCog,    route: '/admin/profile-update-requests',       color: '#16A085' },
];

export default function AdminDashboard() {
  const stats    = useDashboardStats();
  const pending  = usePendingItems();
  const activity = useRecentActivities();
  const content  = useLatestContent();
  const charts   = useDashboardCharts('12m');

  const membershipTrend  = charts.data?.membership_application_trend?.data  || charts.data?.member_growth?.data  || [];
  const applicationStatus= charts.data?.members_by_status?.data             || [];
  const committeeTypes   = charts.data?.committees_by_status?.data          || [];

  const notices = content.data?.latest_notices || [];
  const posts   = content.data?.latest_posts   || [];

  return (
    <AdminLayout>
      <div className="adm-dashboard">

        {/* Welcome banner */}
        <WelcomeBanner />

        {/* ── Stats Grid ─────────────────────────────────────────── */}
        <section className="adm-section">
          <SectionHeader title="Overview" subtitle="Key metrics at a glance" />
          {stats.loading ? (
            <SkeletonStatCards />
          ) : (
            <div className="adm-stats-grid">
              <StatCard statKey="total_members"                   value={stats.data?.total_members} />
              <StatCard statKey="active_members"                  value={stats.data?.active_members} />
              <StatCard statKey="pending_applications"            value={stats.data?.pending_applications} />
              <StatCard statKey="total_committees"                value={stats.data?.total_committees} />
              <StatCard statKey="published_posts"                 value={stats.data?.published_posts} />
              <StatCard statKey="profile_update_requests_pending" value={stats.data?.profile_update_requests_pending} />
            </div>
          )}
        </section>

        {/* ── Charts Row 1 ───────────────────────────────────────── */}
        <section className="adm-section">
          <SectionHeader title="Analytics" subtitle="Member growth & application breakdown" />
          <div className="adm-charts-row">
            <MembershipTrendChart   data={membershipTrend}   />
            <ApplicationStatusChart data={applicationStatus} />
          </div>
        </section>

        {/* ── Charts Row 2 ───────────────────────────────────────── */}
        <section className="adm-section">
          <div className="adm-charts-row">
            <CommitteeTypesChart data={committeeTypes} />
          </div>
        </section>

        {/* ── Pending Work + Recent Activity ─────────────────────── */}
        <section className="adm-section">
          <div className="adm-two-col">
            <div className="adm-widget">
              <SectionHeader
                title="Pending Tasks"
                subtitle="Items needing your attention"
              />
              <PendingTaskCard data={pending.data || []} loading={pending.loading} />
            </div>
            <div className="adm-widget">
              <SectionHeader
                title="Recent Activity"
                subtitle="Latest actions across the system"
              />
              <RecentActivityList data={activity.data || []} loading={activity.loading} />
            </div>
          </div>
        </section>

        {/* ── Latest Content ─────────────────────────────────────── */}
        <section className="adm-section">
          <div className="adm-two-col">
            <div className="adm-widget">
              <SectionHeader title="Latest Notices" subtitle="Recently published" />
              <NoticeListCard data={notices} loading={content.loading} />
            </div>
            <div className="adm-widget">
              <SectionHeader title="Latest Posts" subtitle="Recently published" />
              <LatestPostsCard data={posts} loading={content.loading} />
            </div>
          </div>
        </section>

        {/* ── Quick Actions ──────────────────────────────────────── */}
        <section className="adm-section">
          <SectionHeader title="Quick Actions" subtitle="Common tasks, one click away" />
          <QuickActionGrid actions={QUICK_ACTIONS} />
        </section>

      </div>
    </AdminLayout>
  );
}
