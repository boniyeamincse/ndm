import { LogOut, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfileDropdown({ onClose }) {
  const navigate = useNavigate();

  function handleNavigate(path) {
    onClose();
    navigate(path);
  }

  function handleLogout() {
    localStorage.removeItem('ndm_token');
    localStorage.removeItem('ndm_user');
    onClose();
    navigate('/login');
  }

  return (
    <div className="adm-dropdown-panel adm-dropdown-panel--compact">
      <button type="button" className="adm-dropdown-link" onClick={() => handleNavigate('/admin/profile')}>
        <User size={16} />
        <span>My Profile</span>
      </button>
      <button type="button" className="adm-dropdown-link" onClick={() => handleNavigate('/admin/settings')}>
        <Settings size={16} />
        <span>Account Settings</span>
      </button>
      <button type="button" className="adm-dropdown-link adm-dropdown-link--danger" onClick={handleLogout}>
        <LogOut size={16} />
        <span>Logout</span>
      </button>
    </div>
  );
}
