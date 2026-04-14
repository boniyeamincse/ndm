import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/admin/settings/general', label: 'General' },
  { path: '/admin/settings/organization', label: 'Organization' },
  { path: '/admin/settings/email', label: 'Email' },
  { path: '/admin/settings/notifications', label: 'Notifications' },
  { path: '/admin/settings/security', label: 'Security' },
];

export default function SettingsNav() {
  const location = useLocation();

  return (
    <nav className="stg-nav" aria-label="Settings navigation">
      {NAV_ITEMS.map((item) => (
        <Link key={item.path} to={item.path} className={`stg-nav__link ${location.pathname === item.path ? 'is-active' : ''}`}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
