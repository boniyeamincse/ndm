import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminTopbar from '../components/AdminTopbar';
import AdminFooter from '../components/AdminFooter';
import SidebarOverlay from '../components/SidebarOverlay';
import { filterMenuGroups, getMenuState, adminMenuGroups } from '../config/menuConfig';
import { getStoredAdminUser } from '../mock/layoutMock';

const MOBILE_BREAKPOINT = 1024;

export default function AdminLayout({ children }) {
  const { pathname } = useLocation();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('ndm_admin_sidebar_collapsed') === 'true';
  });
  const [openSubmenus, setOpenSubmenus] = useState([]);

  const user = useMemo(() => getStoredAdminUser(), []);
  const visibleGroups = useMemo(() => filterMenuGroups(adminMenuGroups, user), [user]);

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
        organizationName={user.organizationName}
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
