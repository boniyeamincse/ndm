import SidebarMenuItem from './SidebarMenuItem';

export default function SidebarMenu({
  groups,
  collapsed = false,
  openSubmenus,
  onToggleSubmenu,
  onAction,
  onItemClick,
}) {
  return (
    <div className="adm-sidebar-menu">
      {groups.map((group) => (
        <section key={group.id} className="adm-sidebar-group">
          {!collapsed && <p className="adm-sidebar-group__title">{group.label}</p>}
          <div className="adm-sidebar-group__items">
            {group.items.map((item) => (
              <SidebarMenuItem
                key={item.id}
                item={item}
                collapsed={collapsed}
                open={openSubmenus.includes(item.id)}
                onToggle={onToggleSubmenu}
                onAction={onAction}
                onItemClick={onItemClick}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
