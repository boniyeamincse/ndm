import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Users,
  FileText,
  CalendarClock,
  MessageCircle,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';

const menuSections = [
  {
    title: 'Main',
    items: [
      { to: '/member/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Member Workspace',
    items: [
      { to: '/member/profile', label: 'My Profile', icon: User },
      { to: '/member/committee', label: 'Committee', icon: Users },
      { to: '/member/applications', label: 'Applications', icon: FileText },
      { to: '/member/events', label: 'Events & Programs', icon: CalendarClock },
      { to: '/member/communication', label: 'Communication', icon: MessageCircle },
      { to: '/member/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export default function MemberSidebar({ onNavigate, onLogout, className = '' }) {
  return (
    <aside className={`member-sidebar ${className}`.trim()}>
      {menuSections.map(section => (
        <div className="member-sidebar__section" key={section.title}>
          <p className="member-sidebar__section-title">{section.title}</p>
          {section.items.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `member-sidebar__link ${isActive ? 'active' : ''}`}
              onClick={onNavigate}
              end={item.to === '/member/dashboard'}
            >
              <span className="member-sidebar__link-left">
                <item.icon size={16} />
                {item.label}
              </span>
              <ChevronRight size={14} />
            </NavLink>
          ))}
        </div>
      ))}

      <button type="button" className="member-sidebar__link" onClick={onLogout}>
        <span className="member-sidebar__link-left">
          <LogOut size={16} />
          Logout
        </span>
      </button>
    </aside>
  );
}
