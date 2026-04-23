import { Link } from 'react-router-dom';
import { User2, Bell, FileText, CalendarClock, ArrowRight, Building2, Award, Hash, Pin } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useMemberDashboard } from '../hooks/useMemberDashboard';
import './MemberDashboard.css';

function SkeletonBlock({ width = '100%', height = '1rem', radius = '6px', style = {} }) {
  return (
    <span
      className="db-skeleton"
      style={{ width, height, borderRadius: radius, display: 'block', ...style }}
    />
  );
}

function NoticePriorityBadge({ priority }) {
  if (!priority) return null;
  const map = {
    urgent: { label: 'Urgent', cls: 'notice-badge--urgent' },
    high: { label: 'High', cls: 'notice-badge--high' },
    normal: { label: 'Normal', cls: 'notice-badge--normal' },
    low: { label: 'Low', cls: 'notice-badge--low' },
  };
  const item = map[priority] || { label: priority, cls: 'notice-badge--normal' };
  return <span className={`notice-badge ${item.cls}`}>{item.label}</span>;
}

export default function MemberDashboard() {
  const { t, lang } = useLang();
  const { user, overview, notices, noticesLoading, loading, error, reload } = useMemberDashboard();
  useScrollReveal('.reveal', [loading]);

  const quickLinks = [
    { to: '/member/profile', icon: <User2 size={18} />, label: lang === 'en' ? 'My Profile' : 'আমার প্রোফাইল' },
    { to: '/news', icon: <FileText size={18} />, label: t('dash_quick_news') },
    { to: '/activities', icon: <CalendarClock size={18} />, label: t('dash_quick_events') },
    { to: '/publications', icon: <Bell size={18} />, label: t('dash_quick_publications') },
  ];

  const status = overview?.status || user?.membership_status || 'pending';
  const overviewData = overview || {};
  const committee = overviewData.latest_assignment?.committee_name;
  const position = overviewData.latest_assignment?.position_name;

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">{t('nav_home')}</Link><span>/</span>
            <span>{t('nav_dashboard')}</span>
          </div>
          <h1>{t('dash_title')}</h1>
          <p>{t('dash_sub')}</p>
        </div>
      </section>

      <section className="section-pad dashboard-section">
        <div className="container">

          {error && (
            <div className="db-error-banner">
              <p>{lang === 'en' ? 'Could not refresh dashboard data. Showing saved data.' : 'ড্যাশবোর্ড ডেটা আপডেট করা যায়নি।'}</p>
              <button type="button" className="btn btn-outline btn-sm" onClick={reload}>
                {lang === 'en' ? 'Try Again' : 'আবার চেষ্টা করুন'}
              </button>
            </div>
          )}

          {/* Top row: hero + quick links */}
          <div className="dashboard-grid reveal">
            {/* Hero Card */}
            <div className="dashboard-card card">
              {loading ? (
                <div className="db-hero-skeleton">
                  <SkeletonBlock width="72px" height="72px" radius="50%" style={{ marginBottom: '1rem' }} />
                  <SkeletonBlock width="60%" height="1.1rem" style={{ marginBottom: '.5rem' }} />
                  <SkeletonBlock width="45%" height=".85rem" style={{ marginBottom: '1rem' }} />
                  <SkeletonBlock width="50%" height="1.75rem" radius="100px" style={{ marginBottom: '.75rem' }} />
                  <SkeletonBlock width="100%" height="3.5rem" radius="8px" />
                </div>
              ) : (
                <>
                  <div className="db-hero-avatar">
                    {user?.photo_url || overviewData.photo_url
                      ? <img src={user?.photo_url || overviewData.photo_url} alt="avatar" className="db-hero-avatar-img" />
                      : <User2 size={30} />
                    }
                  </div>
                  <p className="db-welcome-label">{t('dash_welcome')}</p>
                  <h2 className="db-hero-name">{user?.full_name || user?.name || t('dash_member')}</h2>
                  <p className="dashboard-user-email">{user?.email || '-'}</p>

                  <div className="dashboard-user-meta">
                    <span className={`status-badge status-badge--${status}`}>{status}</span>
                    {overviewData.member_no && (
                      <span className="id-badge"><Hash size={11} /> {overviewData.member_no}</span>
                    )}
                  </div>

                  <div className="db-meta-rows">
                    {committee && (
                      <div className="db-meta-row">
                        <Building2 size={14} />
                        <span>{committee}</span>
                      </div>
                    )}
                    {position && (
                      <div className="db-meta-row">
                        <Award size={14} />
                        <span>{position}</span>
                      </div>
                    )}
                    {overviewData.joined_at && (
                      <div className="db-meta-row db-meta-row--muted">
                        <CalendarClock size={14} />
                        <span>{lang === 'en' ? 'Joined' : 'যোগদান'} {new Date(overviewData.joined_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'short' })}</span>
                      </div>
                    )}
                  </div>

                  {(overviewData.active_assignments_count > 0 || overviewData.leadership_assignments_count > 0) && (
                    <div className="db-stats-row">
                      <div className="db-stat">
                        <span className="db-stat-value">{overviewData.active_assignments_count ?? 0}</span>
                        <span className="db-stat-label">{lang === 'en' ? 'Assignments' : 'দায়িত্ব'}</span>
                      </div>
                      <div className="db-stat-divider" />
                      <div className="db-stat">
                        <span className="db-stat-value">{overviewData.leadership_assignments_count ?? 0}</span>
                        <span className="db-stat-label">{lang === 'en' ? 'Leadership' : 'নেতৃত্ব'}</span>
                      </div>
                    </div>
                  )}

                  {!committee && !position && (
                    <div className="dashboard-profile-note">
                      {lang === 'en'
                        ? 'Keep your profile updated to receive relevant organization updates.'
                        : 'আপনার প্রোফাইল আপ-টু-ডেট রাখুন যাতে সঠিক তথ্য পেতে পারেন।'}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Quick Links */}
            <div className="dashboard-card card">
              <h3>{t('dash_quick_links')}</h3>
              <div className="divider divider-left" style={{ marginBottom: '1rem' }} />
              <div className="dashboard-links">
                {quickLinks.map(item => (
                  <Link key={item.to} to={item.to} className="dashboard-link">
                    <span className="dashboard-link-left">
                      {item.icon}
                      {item.label}
                    </span>
                    <ArrowRight size={16} />
                  </Link>
                ))}
              </div>
              <Link to="/member/profile" className="btn btn-outline btn-sm db-profile-cta">
                {lang === 'en' ? 'Edit My Profile' : 'প্রোফাইল সম্পাদনা করুন'}
              </Link>
            </div>
          </div>

          {/* Notices Section */}
          <div className="db-notices-section reveal">
            <div className="db-section-head">
              <h3><Bell size={18} /> {lang === 'en' ? 'Recent Notices' : 'সাম্প্রতিক নোটিশ'}</h3>
              <Link to="/member/notices" className="db-see-all">
                {lang === 'en' ? 'View All' : 'সব দেখুন'} <ArrowRight size={14} />
              </Link>
            </div>

            {noticesLoading ? (
              <div className="db-notices-grid">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="db-notice-card card">
                    <SkeletonBlock width="40%" height=".75rem" style={{ marginBottom: '.75rem' }} />
                    <SkeletonBlock width="90%" height="1rem" style={{ marginBottom: '.5rem' }} />
                    <SkeletonBlock width="70%" height=".85rem" style={{ marginBottom: '.5rem' }} />
                    <SkeletonBlock width="50%" height=".8rem" />
                  </div>
                ))}
              </div>
            ) : notices.length === 0 ? (
              <div className="db-notices-empty">
                <Bell size={32} />
                <p>{lang === 'en' ? 'No notices available.' : 'কোনো নোটিশ পাওয়া যায়নি।'}</p>
              </div>
            ) : (
              <div className="db-notices-grid">
                {notices.map(notice => (
                  <Link
                    key={notice.slug}
                    to={`/member/notices/${notice.slug}`}
                    className="db-notice-card card"
                  >
                    <div className="db-notice-top">
                      <NoticePriorityBadge priority={notice.priority} />
                      {notice.is_pinned && <Pin size={12} className="db-pin-icon" />}
                    </div>
                    <p className="db-notice-title">{notice.title}</p>
                    {notice.summary && <p className="db-notice-summary">{notice.summary}</p>}
                    <p className="db-notice-date">
                      {notice.publish_at
                        ? new Date(notice.publish_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                        : ''}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>
    </main>
  );
}
