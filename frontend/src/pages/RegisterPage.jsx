import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, User, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

function PasswordStrength({ password }) {
  if (!password) return null;
  const checks = [
    { label: '6+ characters', ok: password.length >= 6 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /[0-9]/.test(password) },
  ];
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
      {checks.map(({ label, ok }) => (
        <span key={label} style={{
          fontSize: '0.7rem', fontWeight: 500,
          color: ok ? '#16a34a' : 'var(--tx-3)',
          display: 'flex', alignItems: 'center', gap: '3px',
        }}>
          <CheckCircle2 size={11} color={ok ? '#16a34a' : 'var(--bd)'} strokeWidth={2} />
          {label}
        </span>
      ))}
    </div>
  );
}

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError('Please fill in all fields.'); return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.'); return;
    }
    setError('');
    setIsLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      const status = err?.response?.status;
      const detail = err?.response?.data?.detail;
      if (status === 409) {
        setError('An account with this email already exists.');
      } else if (status === 422) {
        setError(detail?.[0]?.msg || 'Invalid input. Please check your details.');
      } else if (!err?.response) {
        setError('Cannot reach the server. Is the backend running?');
      } else {
        setError(detail || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}><Zap size={18} color="white" strokeWidth={2.5} /></div>
          <span style={styles.logoText}>FolioSnap</span>
        </div>

        <h1 style={styles.heading}>Create your account</h1>
        <p style={styles.subheading}>Start building your portfolio website today</p>

        {error && (
          <div style={styles.errorBox}>
            <AlertCircle size={15} color="#dc2626" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          {[
            { id: 'reg-name',     key: 'name',     label: 'Full Name',        type: 'text',     Icon: User, placeholder: 'Jane Smith' },
            { id: 'reg-email',    key: 'email',    label: 'Email',            type: 'email',    Icon: Mail, placeholder: 'you@example.com' },
            { id: 'reg-password', key: 'password', label: 'Password',         type: 'password', Icon: Lock, placeholder: '••••••••' },
            { id: 'reg-confirm',  key: 'confirm',  label: 'Confirm Password', type: 'password', Icon: Lock, placeholder: '••••••••' },
          ].map(({ id, key, label, type, Icon, placeholder }) => (
            <div key={key} style={styles.field}>
              <label htmlFor={id} style={styles.label}>{label}</label>
              <div style={styles.inputWrap}>
                <Icon size={15} color="var(--tx-3)" style={styles.inputIcon} />
                <input
                  id={id}
                  type={type}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={set(key)}
                  style={styles.input}
                  required
                />
              </div>
              {key === 'password' && <PasswordStrength password={form.password} />}
            </div>
          ))}

          <button
            id="register-submit-btn"
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: '0.9rem', borderRadius: '9px', marginTop: '4px' }}
          >
            {isLoading ? <><span className="spinner" />Creating Account…</> : 'Create Account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--bg-1)' },
  card: { width: '100%', maxWidth: '420px', background: 'var(--bg-0)', border: '1px solid var(--bd)', borderRadius: '14px', padding: '36px 32px', boxShadow: 'var(--sh-lg)' },
  logo: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' },
  logoIcon: { width: '32px', height: '32px', background: 'var(--acc)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoText: { fontWeight: 700, fontSize: '1.1rem', color: 'var(--tx-1)', letterSpacing: '-0.03em' },
  heading: { fontSize: '1.45rem', fontWeight: 800, color: 'var(--tx-1)', letterSpacing: '-0.03em', marginBottom: '6px' },
  subheading: { fontSize: '0.85rem', color: 'var(--tx-3)', marginBottom: '24px' },
  errorBox: { display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.2)', borderRadius: '8px', padding: '10px 12px', marginBottom: '18px', fontSize: '0.82rem', color: '#dc2626' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '0.78rem', fontWeight: 600, color: 'var(--tx-2)' },
  inputWrap: { position: 'relative' },
  inputIcon: { position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' },
  input: { width: '100%', boxSizing: 'border-box', padding: '10px 12px 10px 34px', background: 'var(--bg-1)', border: '1px solid var(--bd)', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--tx-1)', outline: 'none', fontFamily: 'inherit' },
  footer: { textAlign: 'center', fontSize: '0.82rem', color: 'var(--tx-3)', marginTop: '20px' },
  link: { color: 'var(--acc)', fontWeight: 600, textDecoration: 'none' },
};
