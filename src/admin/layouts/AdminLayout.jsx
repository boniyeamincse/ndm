import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminTopNavbar from '../components/AdminTopNavbar';

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`adm-layout ${collapsed ? 'adm-layout--collapsed' : ''}`}>
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div className="adm-layout__main">
        <AdminTopNavbar onToggleSidebar={() => setCollapsed(c => !c)} />
        <main className="adm-layout__content">{children}</main>
      </div>
    </div>
  );
}
