import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { STORAGE_KEYS } from '../config/constants';
import ChangePasswordModal from '../components/auth/ChangePasswordModal';

const menuLinks = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/reservations', label: 'Reservations' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/menu', label: 'Menu' },
  { to: '/admin/accounting', label: 'Accounting' },
  { to: '/admin/database', label: 'Database' },
  { to: '/admin/messages', label: 'Messages' },
];

function formatLastLogin(value) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [lastLogin, setLastLogin] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    setLastLogin(formatLastLogin(localStorage.getItem(STORAGE_KEYS.LAST_LOGIN)));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span>PLATIA</span>
          <small>Admin Portal</small>
        </div>

        <nav className="admin-sidebar-nav">
          {menuLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto p-3 border-top border-secondary">
          <div className="small text-white-50 text-truncate mb-1" title={user?.email}>
            {user?.name || 'Admin'}
            <br />
            <span className="text-warning">{user?.email}</span>
          </div>

          {lastLogin && (
            <div className="text-white-50" style={{ fontSize: '0.72rem' }}>
              Last login: {lastLogin}
            </div>
          )}

          <div className="d-grid gap-2 mt-3">
            <button
              type="button"
              onClick={() => setShowChangePassword(true)}
              className="btn btn-outline-light btn-sm rounded-pill"
            >
              Change Password
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-warning btn-sm rounded-pill fw-bold"
            >
              Logout
            </button>

            <NavLink to="/" className="btn btn-outline-warning btn-sm rounded-pill">
              Back to Site
            </NavLink>
          </div>
        </div>
      </aside>

      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}

      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
