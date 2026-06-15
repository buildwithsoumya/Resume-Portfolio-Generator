import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Mail, Lock, AlertCircle } from 'lucide-react';

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
        setError('Cannot reach the server. Is the backend running?');
      } else {
        setError(detail || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoIcon}><Zap size={18} color="white" strokeWidth={2.5} /></div>
          <span style={styles.logoText}>FolioSnap</span>
        </div>

        <h1 style={styles.heading}>Welcome back</h1>
        <p style={styles.subheading}>Sign in to your account to continue</p>

        {error && (
          <div style={styles.errorBox}>
            <AlertCircle size={15} color="#dc2626" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          <div style={styles.field}>
            <label style={styles.label} htmlFor="login-email">Email</label>
            <div style={styles.inputWrap}>
              <Mail size={15} color="var(--tx-3)" style={styles.inputIcon} />
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={styles.input}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label} htmlFor="login-password">Password</label>
            <div style={styles.inputWrap}>
              <Lock size={15} color="var(--tx-3)" style={styles.inputIcon} />
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={styles.input}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: '0.9rem', borderRadius: '9px' }}
          >
            {isLoading ? <><span className="spinner" />Signing In…</> : 'Sign In'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Create one</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    background: 'var(--bg-1)',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    background: 'var(--bg-0)',
    border: '1px solid var(--bd)',
    borderRadius: '14px',
    padding: '36px 32px',
    boxShadow: 'var(--sh-lg)',
  },
  logo: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' },
  logoIcon: {
    width: '32px', height: '32px', background: 'var(--acc)',
    borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  logoText: { fontWeight: 700, fontSize: '1.1rem', color: 'var(--tx-1)', letterSpacing: '-0.03em' },
  heading: { fontSize: '1.45rem', fontWeight: 800, color: 'var(--tx-1)', letterSpacing: '-0.03em', marginBottom: '6px' },
  subheading: { fontSize: '0.85rem', color: 'var(--tx-3)', marginBottom: '24px' },
  errorBox: {
    display: 'flex', alignItems: 'center', gap: '8px',
    background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.2)',
    borderRadius: '8px', padding: '10px 12px', marginBottom: '18px',
    fontSize: '0.82rem', color: '#dc2626',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '0.78rem', fontWeight: 600, color: 'var(--tx-2)' },
  inputWrap: { position: 'relative' },
  inputIcon: { position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' },
  input: {
    width: '100%', boxSizing: 'border-box',
    padding: '10px 12px 10px 34px',
    background: 'var(--bg-1)', border: '1px solid var(--bd)',
    borderRadius: '8px', fontSize: '0.875rem', color: 'var(--tx-1)',
    outline: 'none', transition: 'border-color 0.15s ease',
    fontFamily: 'inherit',
  },
  footer: { textAlign: 'center', fontSize: '0.82rem', color: 'var(--tx-3)', marginTop: '20px' },
  link: { color: 'var(--acc)', fontWeight: 600, textDecoration: 'none' },
};
