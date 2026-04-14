import { NavLink } from 'react-router-dom';

export default function SidebarSubmenu({ item, collapsed = false, open = false, onItemClick }) {
  if (!item.children?.length || collapsed || !open) {
    return null;
  }

  return (
    <div className="adm-sidebar-submenu" role="group" aria-label={item.label}>
      {item.children.map((child) => (
        <NavLink
          key={child.id}
          to={child.path}
          className={({ isActive }) => `adm-sidebar-submenu__link ${isActive ? 'adm-sidebar-submenu__link--active' : ''}`}
          onClick={onItemClick}
        >
          <span className="adm-sidebar-submenu__dot" aria-hidden="true" />
          <span>{child.label}</span>
        </NavLink>
      ))}
    </div>
  );
}
