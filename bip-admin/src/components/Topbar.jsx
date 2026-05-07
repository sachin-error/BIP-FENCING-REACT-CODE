import { useAuth } from '../context/AuthContext';

const styles = `
  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    height: 56px;
    flex-shrink: 0;
    overflow: hidden;
    background: #ffffff;
    border-bottom: 1px solid #e5e7eb;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  }

  .topbar-title {
    font-size: 16px;
    font-weight: 700;
    color: #24292f;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
    flex: 1;
  }

  .topbar-title span {
    color: #0969da;
  }

  .topbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .topbar-user-info {
    text-align: right;
    margin-right: 4px;
  }

  .topbar-user-name {
    font-size: 13px;
    font-weight: 600;
    color: #24292f;
    line-height: 1.3;
  }

  .topbar-user-role {
    font-size: 11px;
    color: #57606a;
    line-height: 1.3;
  }

  .topbar-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #0969da;
    color: #ffffff;
    font-size: 14px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .btn-logout-top {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 6px 12px;
    border: 1px solid #d0d7de;
    border-radius: 6px;
    background: #f6f8fa;
    color: #24292f;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.15s ease, border-color 0.15s ease;
  }

  .btn-logout-top:hover {
    background: #eaeef2;
    border-color: #b5bdc5;
  }

  @media (max-width: 480px) {
    .topbar {
      padding: 0 10px;
      gap: 6px;
    }

    .topbar-user-info {
      display: none;
    }

    .logout-label {
      display: none;
    }

    .btn-logout-top {
      padding: 6px 8px;
      min-width: unset;
    }

    .topbar-title {
      font-size: 14px;
    }
  }

  @media (max-width: 360px) {
    .topbar-avatar {
      width: 28px;
      height: 28px;
      font-size: 12px;
    }

    .topbar-title {
      font-size: 13px;
    }
  }
`;

export default function Topbar() {
  const { logout } = useAuth();

  return (
    <>
      <style>{styles}</style>
      <header className="topbar">
        <div className="topbar-title">
          Bip Fencing <span>Admin</span>
        </div>
        <div className="topbar-right">
          <div className="topbar-user-info">
            <div className="topbar-user-name">Admin User</div>
            <div className="topbar-user-role">Administrator</div>
          </div>
          <div className="topbar-avatar">A</div>
          <button className="btn-logout-top" onClick={logout}>
            <i className="bi bi-box-arrow-right"></i>
            <span className="logout-label"> Logout</span>
          </button>
        </div>
      </header>
    </>
  );
}