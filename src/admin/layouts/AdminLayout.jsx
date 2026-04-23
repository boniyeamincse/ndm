import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminTopbar from '../components/AdminTopbar';
import AdminFooter from '../components/AdminFooter';
import SidebarOverlay from '../components/SidebarOverlay';
import { filterMenuGroups, getMenuState, adminMenuGroups } from '../config/menuConfig';
import { getStoredAdminUser } from '../mock/layoutMock';
import { SETTINGS_UPDATED_EVENT, getSettingsSnapshot } from '../modules/settings/shared/services/settingsService';

const MOBILE_BREAKPOINT = 1024;

export default function AdminLayout({ children }) {
  const { pathname } = useLocation();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('ndm_admin_sidebar_collapsed') === 'true';
  });
  const [openSubmenus, setOpenSubmenus] = useState([]);
  const [organizationSettings, setOrganizationSettings] = useState(() => getSettingsSnapshot('organization'));

  const user = useMemo(() => getStoredAdminUser(), []);
  const visibleGroups = useMemo(() => filterMenuGroups(adminMenuGroups, user), [user]);
  const organizationName = organizationSettings?.short_name || organizationSettings?.organization_name || user.organizationName;
  const brandingLogo = organizationSettings?.logo_url || '/images/logo/logo.jpeg';
  const brandingFavicon = organizationSettings?.favicon_url || brandingLogo || '/favicon.svg';

  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('ndm_admin_sidebar_collapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    const { openIds } = getMenuState(visibleGroups, pathname);
    setOpenSubmenus((current) => Array.from(new Set([...current, ...openIds])));
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [visibleGroups, pathname, isMobile]);

  useEffect(() => {
    function handleSettingsUpdated(event) {
      if (event?.detail?.section === 'organization') {
        setOrganizationSettings(event.detail.data || getSettingsSnapshot('organization'));
      }
    }

    function handleStorage(event) {
      if (event.key === 'ndm_admin_settings:organization') {
        setOrganizationSettings(getSettingsSnapshot('organization'));
      }
    }

    window.addEventListener(SETTINGS_UPDATED_EVENT, handleSettingsUpdated);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(SETTINGS_UPDATED_EVENT, handleSettingsUpdated);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    if (!brandingFavicon) return;

    let iconLink = document.querySelector("link[rel='icon']");
    if (!iconLink) {
      iconLink = document.createElement('link');
      iconLink.setAttribute('rel', 'icon');
      document.head.appendChild(iconLink);
    }

    iconLink.setAttribute('href', brandingFavicon);
  }, [brandingFavicon]);

  function handleToggleSidebar() {
    if (isMobile) {
      setSidebarOpen((current) => !current);
      return;
    }

    setSidebarCollapsed((current) => !current);
  }

  function handleToggleSubmenu(id) {
    setOpenSubmenus((current) => (
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]
    ));
  }

  const layoutClassName = [
    'adm-layout',
    sidebarCollapsed ? 'adm-layout--collapsed' : '',
    isMobile ? 'adm-layout--mobile' : '',
    sidebarOpen ? 'adm-layout--sidebar-open' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={layoutClassName}>
      <SidebarOverlay visible={isMobile && sidebarOpen} onClick={() => setSidebarOpen(false)} />
      <AdminSidebar
        groups={visibleGroups}
        collapsed={!isMobile && sidebarCollapsed}
        isMobile={isMobile}
        isOpen={sidebarOpen}
        organizationName={organizationName}
        organizationLogo={brandingLogo}
        openSubmenus={openSubmenus}
        onToggleSubmenu={handleToggleSubmenu}
        onToggleSidebar={handleToggleSidebar}
        onCloseMobile={() => setSidebarOpen(false)}
      />
      <div className="adm-layout__main">
        <AdminTopbar
          isMobile={isMobile}
          sidebarOpen={sidebarOpen}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={handleToggleSidebar}
        />
        <main className="adm-layout__content">{children || <Outlet />}</main>
        <AdminFooter />
      </div>
    </div>
  );
}
