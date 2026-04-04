import { Link } from 'react-router-dom';
import { Globe, MessageSquare, Play, Camera, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import './Footer.css';

export default function Footer() {
  const { t } = useLang();

  const quickLinks = [
    { to: '/', label: t('nav_home') },
    { to: '/about', label: t('nav_about') },
    { to: '/leadership', label: t('nav_leadership') },
    { to: '/activities', label: t('nav_activities') },
    { to: '/news', label: t('nav_news') },
    { to: '/publications', label: t('nav_publications') },
    { to: '/join', label: t('nav_join') },
    { to: '/contact', label: t('nav_contact') },
  ];

  return (
    <footer className="footer">
      {/* Top band */}
      <div className="footer__top">
        <div className="container footer__top-inner">
          <div className="footer__brand">
            <div className="footer__logo">
              <div className="footer__logo-icon">
                <img src="/images/logo/logo.jpeg" alt="NDM Logo" className="footer__logo-img" />
              </div>
              <div>
                <div className="footer__logo-title">ছাত্র আন্দোলন</div>
                <div className="footer__logo-sub">Student Movement – NDM</div>
              </div>
            </div>
            <p className="footer__tagline">{t('footer_tagline')}</p>
            <div className="footer__socials">
              <a href="https://facebook.com/ndmbdofficial" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Globe size={18} /></a>
              <a href="https://twitter.com/ndmbd_official" target="_blank" rel="noopener noreferrer" aria-label="Twitter/X"><MessageSquare size={18} /></a>
              <a href="https://youtube.com/@ndmbdofficial" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Play size={18} /></a>
              <a href="https://instagram.com/ndmbdofficial" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Camera size={18} /></a>
            </div>
          </div>

          <div className="footer__col">
            <h4>{t('footer_quick')}</h4>
            <ul>
              {quickLinks.map(l => (
                <li key={l.to}><Link to={l.to}>{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h4>{t('nav_contact')}</h4>
            <ul className="footer__contact-list">
              <li><MapPin size={15} /><span>{t('contact_address_val')}</span></li>
              <li><Mail size={15} /><a href={`mailto:${t('contact_email_val')}`}>{t('contact_email_val')}</a></li>
              <li><Phone size={15} /><a href={`tel:${t('contact_phone_val')}`}>{t('contact_phone_val')}</a></li>
            </ul>
            <div className="footer__ndm-link">
              <span className="footer__parent-text">{t('footer_parent')}</span>
              <a href="https://ndmbd.org/" target="_blank" rel="noopener noreferrer">
                Nationalist Democratic Movement <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom band */}
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>{t('footer_rights')}</p>
          <p className="footer__bottom-parent">
            <span className="footer__parent-text">{t('footer_parent')}</span>{' '}
            <a href="https://ndmbd.org/" target="_blank" rel="noopener noreferrer">
              Nationalist Democratic Movement
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
