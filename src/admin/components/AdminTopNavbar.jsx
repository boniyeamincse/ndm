import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, ChevronDown, User, LogOut } from 'lucide-react';
import { useState } from 'react';

const ROUTE_TITLES = {
  '/admin/dashboard':               'Dashboard',
  '/admin/membership-applications': 'Membership Applications',
  '/admin/members':                 'Members',
  '/admin/committees':              'Committees',
  '/admin/committee-types':         'Committee Types',
  '/admin/positions':               'Positions',
  '/admin/committee-assignments':   'Committee Assignments',
  '/admin/reporting-hierarchy':     'Reporting Hierarchy',
  '/admin/posts':                   'Blog / News',
  '/admin/notices':                 'Notices',
  '/admin/profile-update-requests': 'Profile Update Requests',
  '/admin/reports':                 'Reports',
  '/admin/settings':                'Settings',
};

export default function AdminTopNavbar({ onToggleSidebar }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const rawUser = localStorage.getItem('ndm_user');
  const user = rawUser ? JSON.parse(rawUser) : null;
  const displayName = user?.name || user?.email || 'Admin';
  const initials = displayName.slice(0, 2).toUpperCase();

  const pageTitle = ROUTE_TITLES[pathname] || 'Admin';

  function handleLogout() {
    localStorage.removeItem('ndm_token');
    localStorage.removeItem('ndm_user');
    navigate('/login');
  }

  return (
    <header className="adm-topnav">
      <div className="adm-topnav__left">
        <button className="adm-topnav__menu-btn" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          <Menu size={20} />
        </button>
        <h1 className="adm-topnav__title">{pageTitle}</h1>
      </div>

      <div className="adm-topnav__right">
        {/* Notifications */}
        <button className="adm-topnav__icon-btn adm-topnav__bell" aria-label="Notifications">
          <Bell size={20} />
          <span className="adm-topnav__badge">3</span>
        </button>

        {/* Profile Dropdown */}
        <div className="adm-topnav__profile">
          <button
            className="adm-topnav__profile-btn"
            onClick={() => setDropdownOpen(o => !o)}
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            <div className="adm-topnav__avatar">{initials}</div>
            <span className="adm-topnav__name">{displayName}</span>
            <ChevronDown size={14} className={`adm-topnav__chevron ${dropdownOpen ? 'adm-topnav__chevron--open' : ''}`} />
          </button>

          {dropdownOpen && (
            <>
              <div className="adm-topnav__backdrop" onClick={() => setDropdownOpen(false)} />
              <div className="adm-topnav__dropdown">
                <button className="adm-topnav__dd-item" onClick={() => { setDropdownOpen(false); navigate('/admin/settings'); }}>
                  <User size={15} /> Profile & Settings
                </button>
                <div className="adm-topnav__dd-divider" />
                <button className="adm-topnav__dd-item adm-topnav__dd-item--danger" onClick={handleLogout}>
                  <LogOut size={15} /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
