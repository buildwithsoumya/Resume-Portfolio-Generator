import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) { setError('Please fill in all fields.'); return; }
    setError('');
    setIsLoading(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      const detail = err?.response?.data?.detail;
      if (!err?.response) {
        setError('Cannot reach the server.');
      } else if (err?.response?.status === 400 && typeof detail === 'string' && detail.includes('Email already registered')) {
        setError('This email is already registered.');
      } else {
        setError(detail || 'Registration failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-sm bg-surface border border-border rounded-xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-text-main mb-2 text-center">Create Account</h1>
        <p className="text-text-muted text-center mb-6">Join FolioSnap to build your portfolio</p>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-text-main mb-1" htmlFor="register-name">Full Name</label>
            <input
              id="register-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-surface border border-border rounded-md px-3 py-2 text-text-main outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-1" htmlFor="register-email">Email</label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-surface border border-border rounded-md px-3 py-2 text-text-main outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-1" htmlFor="register-password">Password</label>
            <input
              id="register-password"
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
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
