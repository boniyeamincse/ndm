import { Navigate, useLocation } from 'react-router-dom';

const ADMIN_ROLES = ['superadmin', 'admin', 'moderator'];

function hasAdminRole(user) {
  const roles = Array.isArray(user.roles) ? user.roles : [user.role_type].filter(Boolean);
  return roles.some(r => ADMIN_ROLES.includes(r));
}

export default function ProtectedRoute({ children, adminOnly = false }) {
  const location = useLocation();
  const token = localStorage.getItem('ndm_token');

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly) {
    try {
      const user = JSON.parse(localStorage.getItem('ndm_user') || '{}');
      if (!hasAdminRole(user)) {
        return <Navigate to="/member/dashboard" replace />;
      }
    } catch {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}
