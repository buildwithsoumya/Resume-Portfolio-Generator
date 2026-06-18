import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const detail = err?.response?.data?.detail;
      if (err?.response?.status === 401) {
        setError('Incorrect email or password.');
      } else if (!err?.response) {
        setError('Cannot reach the server.');
      } else {
        setError(detail || 'Login failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-sm bg-surface border border-border rounded-xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-text-main mb-2 text-center">Sign In</h1>
        <p className="text-text-muted text-center mb-6">Welcome back to FolioSnap</p>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-text-main mb-1" htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-surface border border-border rounded-md px-3 py-2 text-text-main outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-1" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-surface border border-border rounded-md px-3 py-2 text-text-main outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 bg-primary text-white w-full py-2 rounded-md font-medium hover:bg-primary-hover transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
