import { Link } from 'react-router-dom';
import { User2, Bell, FileText, CalendarClock, ArrowRight } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useMemberDashboard } from '../hooks/useMemberDashboard';
import './MemberDashboard.css';

export default function MemberDashboard() {
  const { t, lang } = useLang();
  const { user, loading, error, reload } = useMemberDashboard();
  useScrollReveal('.reveal', [loading]);

  const quickLinks = [
    { to: '/member/profile', icon: <User2 size={18} />, label: lang === 'en' ? 'My Profile' : 'আমার প্রোফাইল' },
    { to: '/news', icon: <FileText size={18} />, label: t('dash_quick_news') },
    { to: '/activities', icon: <CalendarClock size={18} />, label: t('dash_quick_events') },
    { to: '/publications', icon: <Bell size={18} />, label: t('dash_quick_publications') },
  ];

  const status = user?.membership_status || 'pending';

  if (loading) {
    return (
      <main>
        <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
          <p>{lang === 'en' ? 'Loading dashboard...' : 'ড্যাশবোর্ড লোড হচ্ছে...'}</p>
        </div>
      </main>
    );
  }

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
        <div className="container dashboard-grid">
          {error && (
            <div className="dashboard-card card" style={{ gridColumn: '1 / -1', marginBottom: '1rem' }}>
              <p style={{ marginBottom: '0.75rem', color: '#b91c1c' }}>
                {lang === 'en' ? 'Could not refresh dashboard data. Showing saved data.' : 'ড্যাশবোর্ড ডেটা আপডেট করা যায়নি। সংরক্ষিত ডেটা দেখানো হচ্ছে।'}
              </p>
              <button type="button" className="btn btn-outline btn-sm" onClick={reload}>
                {lang === 'en' ? 'Try Again' : 'আবার চেষ্টা করুন'}
              </button>
            </div>
          )}

          <div className="dashboard-card card reveal">
            <div className="dashboard-user-icon">
              <User2 size={28} />
            </div>
            <h2>{t('dash_welcome')}</h2>
            <p className="dashboard-user-name">{user?.full_name || user?.name || t('dash_member')}</p>
            <p className="dashboard-user-email">{user?.email || '-'}</p>

            <div className="dashboard-user-meta">
              <span className={`status-badge status-badge--${status}`}>
                {status}
              </span>
              {user?.member_no && (
                <span className="id-badge">
                  ID: {user.member_no}
                </span>
              )}
            </div>

            <div className="dashboard-profile-note">
              {lang === 'en'
                ? 'Keep your profile updated to receive relevant organization updates.'
                : 'আপনার প্রোফাইল আপ-টু-ডেট রাখুন যাতে সঠিক তথ্য পেতে পারেন।'}
            </div>
          </div>

          <div className="dashboard-card card reveal">
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
          </div>
        </div>
      </section>
    </main>
  );
}
