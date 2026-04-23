import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import MemberSidebar from './components/MemberSidebar';
import { memberApi } from '../services/memberApi';
import './components/MemberShell.css';

export default function MemberLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('ndm_user') || '{}');

  const closeMobile = () => setMobileOpen(false);

  const handleLogout = async () => {
    try {
      await memberApi.logout();
    } catch {
      // We still clear client auth even if server logout fails.
    }

    localStorage.removeItem('ndm_token');
    localStorage.removeItem('ndm_user');
    window.dispatchEvent(new Event('auth-changed'));
    navigate('/login', { replace: true });
  };

  return (
    <div className="member-shell">
      <header className="member-shell__topbar">
        <div className="container member-shell__topbar-inner">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.7rem' }}>
            <button
              type="button"
              className="member-shell__menu-btn"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle member menu"
            >
              <Menu size={18} />
            </button>

            <div className="member-shell__brand">
              <img src="/images/logo/logo.jpeg" alt="NDM" />
              <span>Member Dashboard</span>
            </div>
          </div>

          <div className="member-shell__top-actions">
            <span className="member-shell__name">{user?.full_name || user?.name || 'Member'}</span>
            <button type="button" className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      <div className="container member-shell__body">
        {mobileOpen && <div className="member-shell__overlay" onClick={closeMobile} role="button" tabIndex={-1} />}

        <MemberSidebar
          className={mobileOpen ? 'open' : ''}
          onNavigate={closeMobile}
          onLogout={handleLogout}
        />

        <section className="member-shell__content">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
