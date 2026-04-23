export default function SidebarLogo({
  collapsed = false,
  organizationName = 'Student Movment - NDM',
  logoUrl = '/images/logo/logo.jpeg',
}) {
  return (
    <div className="adm-sidebar-logo">
      <div className="adm-sidebar-logo__mark" aria-hidden="true">
        {logoUrl ? <img src={logoUrl} alt="Organization logo" className="adm-sidebar-logo__image" /> : 'NDM'}
      </div>
      {!collapsed && (
        <div className="adm-sidebar-logo__text">
          <p className="adm-sidebar-logo__title">Student Movment</p>
          <p className="adm-sidebar-logo__sub">{organizationName}</p>
        </div>
      )}
    </div>
  );
}
