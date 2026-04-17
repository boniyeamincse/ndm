import { Bell, ChevronDown, Plus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { ADMIN_QUICK_ACTIONS } from '../config/quickActions';
import { getPageMeta } from '../config/menuConfig';
import { getStoredAdminUser, mockNotificationCount, mockNotifications } from '../mock/layoutMock';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import SidebarToggleButton from './SidebarToggleButton';
import TopbarSearch from './TopbarSearch';

export default function AdminTopbar({ isMobile, sidebarOpen, sidebarCollapsed, onToggleSidebar }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const pageMeta = useMemo(() => getPageMeta(pathname), [pathname]);
  const user = useMemo(() => getStoredAdminUser(), []);
  const initials = (user?.name || 'Admin')
    .split(' ')
    .slice(0, 2)
    .map((segment) => segment[0])
    .join('')
    .toUpperCase();

  function toggleDropdown(key) {
    setActiveDropdown((current) => (current === key ? null : key));
  }

  function handleQuickAction(route) {
    setActiveDropdown(null);
    navigate(route);
  }

  return (
    <header className="adm-topbar">
      <div className="adm-topbar__left">
        <SidebarToggleButton
          mobile={isMobile}
          open={sidebarOpen}
          collapsed={sidebarCollapsed}
          onClick={onToggleSidebar}
          label={isMobile ? 'Open navigation menu' : 'Collapse navigation menu'}
          className="adm-topbar__toggle"
        />
        <div className="adm-topbar__heading">
          <p className="adm-topbar__eyebrow">{pageMeta.section}</p>
          <h1 className="adm-topbar__title">{pageMeta.title}</h1>
        </div>
      </div>

      <div className="adm-topbar__center">
        <TopbarSearch />
      </div>

      <div className="adm-topbar__right">
        <div className="adm-topbar-menu">
          <button
            type="button"
            className="adm-quick-action-btn"
            aria-label="Open quick actions"
            aria-expanded={activeDropdown === 'quick-actions'}
            onClick={() => toggleDropdown('quick-actions')}
          >
            <Plus size={16} />
            <span>Quick Action</span>
          </button>
          {activeDropdown === 'quick-actions' ? (
            <div className="adm-topbar-menu__panel adm-topbar-menu__panel--right">
              <div className="adm-dropdown-panel adm-quick-action-menu">
                <div className="adm-dropdown-panel__header">
                  <div>
                    <p className="adm-dropdown-panel__title">Quick Actions</p>
                    <p className="adm-dropdown-panel__sub">Jump into common admin tasks</p>
                  </div>
                  <Plus size={16} />
                </div>
                <div className="adm-dropdown-panel__body adm-quick-action-menu__body">
                  {ADMIN_QUICK_ACTIONS.map((action) => {
                    const Icon = action.icon;

                    return (
                      <button
                        key={action.label}
                        type="button"
                        className="adm-quick-action-menu__item"
                        onClick={() => handleQuickAction(action.route)}
                      >
                        <span className="adm-quick-action-menu__icon" style={{ '--action-color': action.color || 'var(--adm-primary)' }}>
                          <Icon size={16} strokeWidth={1.9} />
                        </span>
                        <span className="adm-quick-action-menu__meta">
                          <span className="adm-quick-action-menu__title">{action.label}</span>
                          <span className="adm-quick-action-menu__desc">{action.description}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="adm-topbar-menu">
          <button
            type="button"
            className="adm-icon-button adm-topbar-menu__trigger"
            aria-label="Open notifications"
            aria-expanded={activeDropdown === 'notifications'}
            onClick={() => toggleDropdown('notifications')}
          >
            <Bell size={18} />
            <span className="adm-topbar-menu__badge">{mockNotificationCount}</span>
          </button>
          {activeDropdown === 'notifications' ? (
            <div className="adm-topbar-menu__panel adm-topbar-menu__panel--right">
              <NotificationDropdown count={mockNotificationCount} notifications={mockNotifications} />
            </div>
          ) : null}
        </div>

        <div className="adm-topbar-menu">
          <button
            type="button"
            className="adm-profile-chip"
            onClick={() => toggleDropdown('profile')}
            aria-label="Open profile menu"
            aria-expanded={activeDropdown === 'profile'}
          >
            <span className="adm-profile-chip__avatar">{initials}</span>
            <span className="adm-profile-chip__meta">
              <span className="adm-profile-chip__name">{user.name}</span>
              <span className="adm-profile-chip__role">{user.role}</span>
            </span>
            <ChevronDown size={16} className={`adm-profile-chip__chevron ${activeDropdown === 'profile' ? 'adm-profile-chip__chevron--open' : ''}`} />
          </button>
          {activeDropdown === 'profile' ? (
            <div className="adm-topbar-menu__panel adm-topbar-menu__panel--right">
              <ProfileDropdown onClose={() => setActiveDropdown(null)} />
            </div>
          ) : null}
        </div>
      </div>

      {activeDropdown ? (
        <button
          type="button"
          className="adm-topbar__dismiss"
          aria-label="Close open menu"
          onClick={() => setActiveDropdown(null)}
        />
      ) : null}
    </header>
  );
}
