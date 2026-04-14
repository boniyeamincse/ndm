import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogIn, LayoutDashboard, LogOut } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import './Navbar.css';

export default function Navbar() {
  const { t, toggle } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthed, setIsAuthed] = useState(Boolean(localStorage.getItem('ndm_token')));
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  useEffect(() => {
    const syncAuth = () => setIsAuthed(Boolean(localStorage.getItem('ndm_token')));
    const onStorage = e => {
      if (e.key === 'ndm_token') syncAuth();
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('auth-changed', syncAuth);
    syncAuth();

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('auth-changed', syncAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('ndm_token');
    localStorage.removeItem('ndm_user');
    window.dispatchEvent(new Event('auth-changed'));
    navigate('/login', { replace: true });
  };

  const links = [
    { to: '/', label: t('nav_home') },
    { to: '/about', label: t('nav_about') },
    { to: '/leadership', label: t('nav_leadership') },
    { to: '/activities', label: t('nav_activities') },
    { to: '/news', label: t('nav_news') },
    { to: '/publications', label: t('nav_publications') },
    { to: '/contact', label: t('nav_contact') },
  ];

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">
            <img src="/images/logo/logo.jpeg" alt="NDM Logo" className="navbar__logo-img" />
          </div>
          <div className="navbar__logo-text">
            <span className="navbar__logo-title">ছাত্র আন্দোলন-এনডিএম</span>
            <span className="navbar__logo-sub">Student Wing of NDM Bangladesh</span>
          </div>
        </Link>

        <nav className="navbar__links">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__actions">
          <button className="navbar__lang-btn" onClick={toggle} aria-label="Toggle language">
            {t('lang_toggle')}
          </button>

          {!isAuthed ? (
            <Link to="/login" className="btn btn-outline btn-sm navbar__icon-btn">
              <LogIn size={15} />
              {t('nav_login')}
            </Link>
          ) : (
            <>
              <Link to="/member/dashboard" className="btn btn-outline btn-sm navbar__icon-btn">
                <LayoutDashboard size={15} />
                {t('nav_dashboard')}
              </Link>
              <button type="button" className="btn btn-outline btn-sm navbar__icon-btn" onClick={handleLogout}>
                <LogOut size={15} />
                {t('nav_logout')}
              </button>
            </>
          )}

          <Link to="/join" className="btn btn-primary btn-sm">
            {t('nav_join_btn')}
          </Link>

          <button
            className="navbar__hamburger"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div className={`navbar__mobile ${open ? 'navbar__mobile--open' : ''}`}>
        <div className="navbar__mobile-inner">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`
              }
            >
              {l.label}
            </NavLink>
          ))}

          {!isAuthed ? (
            <Link to="/login" className="btn btn-outline" style={{ marginTop: '1rem' }}>
              <LogIn size={15} />
              {t('nav_login')}
            </Link>
          ) : (
            <>
              <Link to="/member/dashboard" className="btn btn-outline" style={{ marginTop: '1rem' }}>
                <LayoutDashboard size={15} />
                {t('nav_dashboard')}
              </Link>
              <button type="button" className="btn btn-outline" style={{ marginTop: '.75rem' }} onClick={handleLogout}>
                <LogOut size={15} />
                {t('nav_logout')}
              </button>
            </>
          )}

          <Link to="/join" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            {t('nav_join_btn')}
          </Link>
          <button className="navbar__lang-btn" onClick={toggle} style={{ marginTop: '.75rem' }}>
            {t('lang_toggle')}
          </button>
        </div>
      </div>
    </header>
  );
}
