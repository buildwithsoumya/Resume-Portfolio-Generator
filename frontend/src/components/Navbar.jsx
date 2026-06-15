import { Link, useNavigate } from 'react-router-dom';
import { Zap, Sun, Moon, LayoutDashboard, Sparkles, FolderOpen, LogOut, LogIn, UserPlus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header style={{
      background: 'var(--bg-0)',
      borderBottom: '1px solid var(--bd)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '30px', height: '30px', background: 'var(--acc)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={16} color="white" strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--tx-1)', letterSpacing: '-0.03em' }}>FolioSnap</span>
          <span style={{ background: 'var(--acc-light)', border: '1px solid var(--acc-bd)', color: 'var(--acc)', borderRadius: '4px', padding: '2px 7px', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Beta
          </span>
        </Link>

        {/* Right nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                <button className="btn-ghost" style={{ fontSize: '0.83rem', gap: '5px' }}>
                  <LayoutDashboard size={15} strokeWidth={2} />
                  <span style={{ display: 'none' }}>Dashboard</span>
                </button>
              </Link>
              <Link to="/generate" style={{ textDecoration: 'none' }}>
                <button className="btn-ghost" style={{ fontSize: '0.83rem' }}>
                  <Sparkles size={15} strokeWidth={2} />
                  Generate
                </button>
              </Link>
              <div style={{ width: '1px', height: '20px', background: 'var(--bd)', margin: '0 4px' }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--tx-3)', padding: '0 4px', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser?.name}
              </span>
              <button
                id="logout-btn"
                className="btn-ghost"
                onClick={handleLogout}
                title="Sign out"
                style={{ padding: '7px 9px', color: 'var(--tx-3)' }}
              >
                <LogOut size={15} strokeWidth={2} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <button className="btn-ghost" style={{ fontSize: '0.83rem' }}>
                  <LogIn size={15} strokeWidth={2} /> Sign In
                </button>
              </Link>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <button className="btn-primary" style={{ fontSize: '0.83rem', padding: '7px 14px' }}>
                  <UserPlus size={14} strokeWidth={2} /> Sign Up
                </button>
              </Link>
            </>
          )}

          <div style={{ width: '1px', height: '20px', background: 'var(--bd)', margin: '0 4px' }} />

          <button
            id="theme-toggle"
            className="btn-ghost"
            onClick={toggle}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            style={{ padding: '7px 10px' }}
          >
            {theme === 'dark' ? <Sun size={17} strokeWidth={2} /> : <Moon size={17} strokeWidth={2} />}
          </button>
        </div>
      </div>
    </header>
  );
}
