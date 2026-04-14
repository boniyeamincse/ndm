import { Link } from 'react-router-dom';
import { User2, Bell, FileText, CalendarClock, ArrowRight } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './MemberDashboard.css';

export default function MemberDashboard() {
  const { t } = useLang();
  useScrollReveal();

  const user = JSON.parse(localStorage.getItem('ndm_user') || '{}');

  const quickLinks = [
    { to: '/news', icon: <FileText size={18} />, label: t('dash_quick_news') },
    { to: '/activities', icon: <CalendarClock size={18} />, label: t('dash_quick_events') },
    { to: '/publications', icon: <Bell size={18} />, label: t('dash_quick_publications') },
  ];

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
          <div className="dashboard-card card reveal">
            <div className="dashboard-user-icon">
              <User2 size={28} />
            </div>
            <h2>{t('dash_welcome')}</h2>
            <p className="dashboard-user-name">{user?.name || t('dash_member')}</p>
            <p className="dashboard-user-email">{user?.email || '-'}</p>
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
