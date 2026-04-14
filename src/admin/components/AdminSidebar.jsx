import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, FileText, Building2, Layers, Briefcase,
  Network, Newspaper, Bell, UserCog, BarChart2, Settings, LogOut,
  ChevronLeft, ChevronRight, Shield,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/membership-applications', icon: FileText,    label: 'Applications' },
  { to: '/admin/members',                 icon: Users,       label: 'Members' },
  { to: '/admin/committees',              icon: Building2,   label: 'Committees' },
  { to: '/admin/committee-types',         icon: Layers,      label: 'Committee Types' },
  { to: '/admin/positions',              icon: Shield,       label: 'Positions' },
  { to: '/admin/committee-assignments',   icon: Briefcase,   label: 'Assignments' },
  { to: '/admin/reporting-hierarchy',     icon: Network,     label: 'Hierarchy' },
  { to: '/admin/posts',                   icon: Newspaper,   label: 'Blog / News' },
  { to: '/admin/notices',                 icon: Bell,        label: 'Notices' },
  { to: '/admin/profile-update-requests', icon: UserCog,     label: 'Profile Requests' },
  { to: '/admin/reports',                 icon: BarChart2,   label: 'Reports' },
  { to: '/admin/settings',               icon: Settings,    label: 'Settings' },
];

export default function AdminSidebar({ collapsed, onToggle }) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('ndm_token');
    localStorage.removeItem('ndm_user');
    navigate('/login');
  }

  return (
    <aside className={`adm-sidebar ${collapsed ? 'adm-sidebar--collapsed' : ''}`}>
      {/* Logo */}
      <div className="adm-sidebar__brand">
        <div className="adm-sidebar__logo">
          <span className="adm-sidebar__logo-mark">NDM</span>
          {!collapsed && <span className="adm-sidebar__logo-text">Admin Panel</span>}
        </div>
        <button className="adm-sidebar__toggle" onClick={onToggle} aria-label="Toggle sidebar">
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="adm-sidebar__nav">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `adm-sidebar__link ${isActive ? 'adm-sidebar__link--active' : ''}`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={18} strokeWidth={1.8} className="adm-sidebar__link-icon" />
            {!collapsed && <span className="adm-sidebar__link-label">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="adm-sidebar__footer">
        <button className="adm-sidebar__link adm-sidebar__logout" onClick={handleLogout} title={collapsed ? 'Logout' : undefined}>
          <LogOut size={18} strokeWidth={1.8} className="adm-sidebar__link-icon" />
          {!collapsed && <span className="adm-sidebar__link-label">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
