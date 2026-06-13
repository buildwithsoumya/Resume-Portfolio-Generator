import { Zap, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { theme, toggle } = useTheme();

  return (
    <header
      style={{
        background: 'var(--bg-0)',
        borderBottom: '1px solid var(--bd)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '30px',
              height: '30px',
              background: 'var(--acc)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Zap size={16} color="white" strokeWidth={2.5} />
          </div>
          <span
            style={{
              fontWeight: 700,
              fontSize: '1.05rem',
              color: 'var(--tx-1)',
              letterSpacing: '-0.03em',
            }}
          >
            FolioSnap
          </span>
          <span
            style={{
              background: 'var(--acc-light)',
              border: '1px solid var(--acc-bd)',
              color: 'var(--acc)',
              borderRadius: '4px',
              padding: '2px 7px',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Beta
          </span>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            id="theme-toggle"
            className="btn-ghost"
            onClick={toggle}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            style={{ padding: '7px 10px' }}
          >
            {theme === 'dark'
              ? <Sun size={17} strokeWidth={2} />
              : <Moon size={17} strokeWidth={2} />
            }
          </button>
        </div>
      </div>
    </header>
  );
}
