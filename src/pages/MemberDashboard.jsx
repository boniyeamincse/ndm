import { Link } from 'react-router-dom';
import { User2, Bell, FileText, CalendarClock, ArrowRight, Building2, Award, Hash, Pin, Sparkles, ShieldCheck, Megaphone, BadgeCheck } from 'lucide-react';
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

function formatJoinedDate(joinedAt, lang) {
  if (!joinedAt) return lang === 'en' ? 'Recently joined' : 'সম্প্রতি যোগ দিয়েছেন';

  return new Date(joinedAt).toLocaleDateString(lang === 'en' ? 'en-GB' : 'bn-BD', {
    year: 'numeric',
    month: 'short',
  });
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
  const joinedLabel = formatJoinedDate(overviewData.joined_at, lang);
  const spotlightNotice = notices[0] || null;
  const noticeList = spotlightNotice ? notices.slice(1) : notices;

  const highlightCards = [
    {
      key: 'status',
      icon: <ShieldCheck size={18} />,
      label: lang === 'en' ? 'Membership Status' : 'সদস্যতার অবস্থা',
      value: status,
      meta: committee || (lang === 'en' ? 'No committee assigned yet' : 'এখনও কমিটি নির্ধারিত হয়নি'),
      tone: 'primary',
    },
    {
      key: 'assignments',
      icon: <Building2 size={18} />,
      label: lang === 'en' ? 'Active Assignments' : 'সক্রিয় দায়িত্ব',
      value: overviewData.active_assignments_count ?? 0,
      meta: committee || (lang === 'en' ? 'Waiting for assignment' : 'দায়িত্বের অপেক্ষায়'),
      tone: 'amber',
    },
    {
      key: 'leadership',
      icon: <BadgeCheck size={18} />,
      label: lang === 'en' ? 'Leadership Roles' : 'নেতৃত্বের ভূমিকা',
      value: overviewData.leadership_assignments_count ?? 0,
      meta: position || (lang === 'en' ? 'Member role active' : 'সদস্য ভূমিকা সক্রিয়'),
      tone: 'violet',
    },
    {
      key: 'notices',
      icon: <Megaphone size={18} />,
      label: lang === 'en' ? 'Fresh Notices' : 'নতুন নোটিশ',
      value: noticesLoading ? '...' : notices.length,
      meta: spotlightNotice?.title || (lang === 'en' ? 'No recent notices' : 'সাম্প্রতিক নোটিশ নেই'),
      tone: 'sky',
    },
  ];

  return (
    <main>
      <section className="section-pad dashboard-section">
        <div className="container">
          <div className="db-page-head reveal">
            <div>
              <div className="breadcrumb db-breadcrumb">
                <Link to="/">{t('nav_home')}</Link><span>/</span>
                <span>{t('nav_dashboard')}</span>
              </div>
              <h1>{t('dash_title')}</h1>
              <p>{t('dash_sub')}</p>
            </div>
          </div>

          {error && (
            <div className="db-error-banner">
              <p>{lang === 'en' ? 'Could not refresh dashboard data. Showing saved data.' : 'ড্যাশবোর্ড ডেটা আপডেট করা যায়নি।'}</p>
              <button type="button" className="btn btn-outline btn-sm" onClick={reload}>
                {lang === 'en' ? 'Try Again' : 'আবার চেষ্টা করুন'}
              </button>
            </div>
          )}

          <div className="db-hero-layout reveal">
            <div className="dashboard-card card db-hero-card">
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
                  <div className="db-hero-topline">
                    <span className="db-hero-chip"><Sparkles size={14} /> {lang === 'en' ? 'Member Command Center' : 'সদস্য কন্ট্রোল সেন্টার'}</span>
                    <span className={`status-badge status-badge--${status}`}>{status}</span>
                  </div>

                  <div className="db-hero-main">
                    <div className="db-hero-copy">
                      <p className="db-welcome-label">{t('dash_welcome')}</p>
                      <h2 className="db-hero-name">{user?.full_name || user?.name || t('dash_member')}</h2>
                      <p className="dashboard-user-email">{user?.email || '-'}</p>

                      <div className="dashboard-user-meta">
                        {overviewData.member_no && (
                          <span className="id-badge"><Hash size={11} /> {overviewData.member_no}</span>
                        )}
                        <span className="db-soft-chip"><CalendarClock size={12} /> {lang === 'en' ? 'Joined' : 'যোগদান'} {joinedLabel}</span>
                      </div>

                      <div className="db-meta-rows">
                        <div className="db-meta-row">
                          <Building2 size={14} />
                          <span>{committee || (lang === 'en' ? 'No committee assignment yet' : 'এখনও কোনো কমিটি দায়িত্ব নেই')}</span>
                        </div>
                        <div className="db-meta-row">
                          <Award size={14} />
                          <span>{position || (lang === 'en' ? 'General member role' : 'সাধারণ সদস্য ভূমিকা')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="db-hero-aside">
                      <div className="db-hero-avatar">
                        {user?.photo_url || overviewData.photo_url
                          ? <img src={user?.photo_url || overviewData.photo_url} alt="avatar" className="db-hero-avatar-img" />
                          : <User2 size={30} />
                        }
                      </div>
                      <div className="db-hero-aside-card">
                        <span className="db-hero-aside-label">{lang === 'en' ? 'Profile Health' : 'প্রোফাইল প্রস্তুতি'}</span>
                        <strong>{committee || position ? '85%' : '60%'}</strong>
                        <p>
                          {lang === 'en'
                            ? 'Keep your information current to receive assignment and notice updates.'
                            : 'দায়িত্ব ও নোটিশ আপডেট পেতে তথ্য হালনাগাদ রাখুন।'}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="dashboard-card card db-action-card">
              <div className="db-action-head">
                <div>
                  <h3>{t('dash_quick_links')}</h3>
                  <p>{lang === 'en' ? 'The most useful places to manage your membership today.' : 'আজকের জন্য সবচেয়ে প্রয়োজনীয় সদস্যপদ ব্যবস্থাপনা লিংক।'}</p>
                </div>
                <Link to="/member/profile" className="btn btn-outline btn-sm">
                  {lang === 'en' ? 'Edit Profile' : 'প্রোফাইল সম্পাদনা'}
                </Link>
              </div>

              <div className="dashboard-links">
                {quickLinks.map(item => (
                  <Link key={item.to} to={item.to} className="dashboard-link">
                    <span className="dashboard-link-left">
                      {item.icon}
                      <span>
                        <strong>{item.label}</strong>
                        <small>{lang === 'en' ? 'Open module' : 'মডিউল খুলুন'}</small>
                      </span>
                    </span>
                    <ArrowRight size={16} />
                  </Link>
                ))}
              </div>

              <div className="db-action-foot">
                <p>{lang === 'en' ? 'Need attention next:' : 'পরবর্তী মনোযোগের বিষয়:'}</p>
                <strong>{spotlightNotice?.title || (lang === 'en' ? 'Review your latest notices and profile details.' : 'সর্বশেষ নোটিশ ও প্রোফাইল তথ্য পর্যালোচনা করুন।')}</strong>
              </div>
            </div>
          </div>

          <div className="db-highlights reveal">
            {loading
              ? [1, 2, 3, 4].map(item => (
                <div key={item} className="db-highlight-card card">
                  <SkeletonBlock width="42px" height="42px" radius="14px" style={{ marginBottom: '1rem' }} />
                  <SkeletonBlock width="55%" height=".8rem" style={{ marginBottom: '.5rem' }} />
                  <SkeletonBlock width="35%" height="1.4rem" style={{ marginBottom: '.65rem' }} />
                  <SkeletonBlock width="80%" height=".85rem" />
                </div>
              ))
              : highlightCards.map(item => (
                <article key={item.key} className={`db-highlight-card card db-highlight-card--${item.tone}`}>
                  <div className="db-highlight-icon">{item.icon}</div>
                  <p className="db-highlight-label">{item.label}</p>
                  <h3 className="db-highlight-value">{item.value}</h3>
                  <p className="db-highlight-meta">{item.meta}</p>
                </article>
              ))}
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
              <div className="db-notices-layout">
                <div className="db-notice-spotlight card">
                  <SkeletonBlock width="38%" height=".75rem" style={{ marginBottom: '.9rem' }} />
                  <SkeletonBlock width="80%" height="1.4rem" style={{ marginBottom: '.65rem' }} />
                  <SkeletonBlock width="95%" height=".9rem" style={{ marginBottom: '.45rem' }} />
                  <SkeletonBlock width="70%" height=".9rem" style={{ marginBottom: '1rem' }} />
                  <SkeletonBlock width="48%" height="2.2rem" radius="999px" />
                </div>
                <div className="db-notices-grid">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="db-notice-card card">
                      <SkeletonBlock width="40%" height=".75rem" style={{ marginBottom: '.75rem' }} />
                      <SkeletonBlock width="90%" height="1rem" style={{ marginBottom: '.5rem' }} />
                      <SkeletonBlock width="70%" height=".85rem" style={{ marginBottom: '.5rem' }} />
                      <SkeletonBlock width="50%" height=".8rem" />
                    </div>
                  ))}
                </div>
              </div>
            ) : notices.length === 0 ? (
              <div className="db-notices-empty">
                <Bell size={32} />
                <p>{lang === 'en' ? 'No notices available.' : 'কোনো নোটিশ পাওয়া যায়নি।'}</p>
              </div>
            ) : (
              <div className="db-notices-layout">
                {spotlightNotice && (
                  <Link
                    to={`/member/notices/${spotlightNotice.slug}`}
                    className="db-notice-spotlight card"
                  >
                    <div className="db-notice-top">
                      <NoticePriorityBadge priority={spotlightNotice.priority} />
                      {spotlightNotice.is_pinned && <Pin size={14} className="db-pin-icon" />}
                    </div>
                    <p className="db-notice-spotlight-kicker">{lang === 'en' ? 'Featured Notice' : 'গুরুত্বপূর্ণ নোটিশ'}</p>
                    <h4 className="db-notice-spotlight-title">{spotlightNotice.title}</h4>
                    {spotlightNotice.summary && <p className="db-notice-spotlight-summary">{spotlightNotice.summary}</p>}
                    <div className="db-notice-spotlight-foot">
                      <span>
                        {spotlightNotice.publish_at
                          ? new Date(spotlightNotice.publish_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                          : ''}
                      </span>
                      <span className="db-see-pill">{lang === 'en' ? 'Read Notice' : 'নোটিশ দেখুন'} <ArrowRight size={14} /></span>
                    </div>
                  </Link>
                )}

                <div className="db-notices-grid">
                  {(noticeList.length ? noticeList : notices).map(notice => (
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
              </div>
            )}
          </div>

        </div>
      </section>
    </main>
  );
}
