import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import './Navbar.css';

export default function Navbar() {
  const { t, toggle, lang } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location]);

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
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">
            <span>এনডিএম</span>
          </div>
          <div className="navbar__logo-text">
            <span className="navbar__logo-title">ছাত্র আন্দোলন</span>
            <span className="navbar__logo-sub">Student Movement – NDM</span>
          </div>
        </Link>

        {/* Desktop Nav */}
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

        {/* Actions */}
        <div className="navbar__actions">
          <button className="navbar__lang-btn" onClick={toggle} aria-label="Toggle language">
            {t('lang_toggle')}
          </button>
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

      {/* Mobile Menu */}
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
