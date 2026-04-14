import { ChevronRight } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarSubmenu from './SidebarSubmenu';

export default function SidebarMenuItem({
  item,
  collapsed = false,
  open = false,
  onToggle,
  onAction,
  onItemClick,
}) {
  const { pathname } = useLocation();
  const Icon = item.icon;
  const hasChildren = Boolean(item.children?.length);
  const isParentActive = hasChildren && item.children.some((child) => pathname === child.path || pathname.startsWith(`${child.path}/`));

  if (hasChildren) {
    return (
      <div className={`adm-sidebar-item ${open ? 'adm-sidebar-item--open' : ''}`}>
        <button
          type="button"
          className={`adm-sidebar-link adm-sidebar-link--button ${isParentActive ? 'adm-sidebar-link--active' : ''}`}
          onClick={() => onToggle(item.id)}
          title={collapsed ? item.label : undefined}
          aria-expanded={open}
        >
          <span className="adm-sidebar-link__leading">
            {Icon ? <Icon size={18} className="adm-sidebar-link__icon" /> : null}
            {!collapsed && <span className="adm-sidebar-link__label">{item.label}</span>}
          </span>
          {!collapsed && (
            <span className={`adm-sidebar-link__chevron ${open ? 'adm-sidebar-link__chevron--open' : ''}`}>
              <ChevronRight size={15} />
            </span>
          )}
        </button>
        <SidebarSubmenu item={item} collapsed={collapsed} open={open} onItemClick={onItemClick} />
      </div>
    );
  }

  if (item.action) {
    return (
      <button
        type="button"
        className="adm-sidebar-link adm-sidebar-link--utility"
        onClick={() => onAction(item.action)}
        title={collapsed ? item.label : undefined}
      >
        <span className="adm-sidebar-link__leading">
          {Icon ? <Icon size={18} className="adm-sidebar-link__icon" /> : null}
          {!collapsed && <span className="adm-sidebar-link__label">{item.label}</span>}
        </span>
      </button>
    );
  }

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) => `adm-sidebar-link ${isActive ? 'adm-sidebar-link--active' : ''}`}
      title={collapsed ? item.label : undefined}
      onClick={onItemClick}
    >
      <span className="adm-sidebar-link__leading">
        {Icon ? <Icon size={18} className="adm-sidebar-link__icon" /> : null}
        {!collapsed && <span className="adm-sidebar-link__label">{item.label}</span>}
      </span>
      {!collapsed && item.badge ? <span className="adm-sidebar-link__badge">{item.badge}</span> : null}
    </NavLink>
  );
}
