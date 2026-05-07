import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    if (!result.success) {
      setError(result.message || 'Invalid username or password');
    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-bg-grid"></div>
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon">
            <i className="bi bi-shield-lock-fill"></i>
          </div>
          <h1>Bip Fencing Admin</h1>
          <p>Secure Access Portal</p>
        </div>

        {error && (
          <div className="alert-error mb-3">
            <i className="bi bi-exclamation-triangle-fill"></i> {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="admin"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Authenticating...</>
            ) : (
              <><i className="bi bi-unlock-fill me-2"></i>Sign In</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}