import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import SidebarLogo from './SidebarLogo';
import SidebarMenu from './SidebarMenu';
import SidebarToggleButton from './SidebarToggleButton';
import { adminUtilityItems } from '../config/menuConfig';

export default function AdminSidebar({
  groups,
  collapsed,
  isMobile,
  isOpen,
  organizationName,
  openSubmenus,
  onToggleSubmenu,
  onToggleSidebar,
  onCloseMobile,
}) {
  const navigate = useNavigate();

  function handleAction(action) {
    if (action !== 'logout') return;
    localStorage.removeItem('ndm_token');
    localStorage.removeItem('ndm_user');
    navigate('/login');
  }

  const className = [
    'adm-sidebar',
    collapsed ? 'adm-sidebar--collapsed' : '',
    isMobile ? 'adm-sidebar--mobile' : '',
    isOpen ? 'adm-sidebar--open' : '',
  ].filter(Boolean).join(' ');

  return (
    <aside className={className} aria-label="Admin navigation">
      <div className="adm-sidebar__header">
        <SidebarLogo collapsed={collapsed && !isMobile} organizationName={organizationName} />
        {isMobile ? (
          <button type="button" className="adm-icon-button" onClick={onCloseMobile} aria-label="Close navigation drawer">
            <X size={18} />
          </button>
        ) : (
          <SidebarToggleButton
            collapsed={collapsed}
            onClick={onToggleSidebar}
            label="Collapse navigation menu"
          />
        )}
      </div>

      <nav className="adm-sidebar__body">
        <SidebarMenu
          groups={groups}
          collapsed={collapsed && !isMobile}
          openSubmenus={openSubmenus}
          onToggleSubmenu={onToggleSubmenu}
          onAction={handleAction}
          onItemClick={isMobile ? onCloseMobile : undefined}
        />
      </nav>

      <div className="adm-sidebar__footer">
        <SidebarMenu
          groups={[{ id: 'utility', label: 'Utility', items: adminUtilityItems }]}
          collapsed={collapsed && !isMobile}
          openSubmenus={openSubmenus}
          onToggleSubmenu={onToggleSubmenu}
          onAction={handleAction}
          onItemClick={isMobile ? onCloseMobile : undefined}
        />
      </div>
    </aside>
  );
}
