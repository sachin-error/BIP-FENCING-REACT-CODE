import { useAuth } from '../context/AuthContext';

export default function Topbar() {
  const { logout } = useAuth();
  return (
    <header className="topbar">
      <div className="topbar-title">
        Bip Fencing <span>Admin</span>
      </div>
      <div className="topbar-right">
        <div style={{ textAlign: 'right', marginRight: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#24292f' }}>Admin User</div>
          <div style={{ fontSize: 11, color: '#57606a' }}>Administrator</div>
        </div>
        <div className="topbar-avatar">A</div>
        <button className="btn-logout-top" onClick={logout}>
          <i className="bi bi-box-arrow-right"></i> Logout
        </button>
      </div>
    </header>
  );
}
