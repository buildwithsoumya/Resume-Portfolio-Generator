import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchPortfolios, fetchPortfolioById, deletePortfolio } from '../services/api';
import {
  Sparkles, FolderOpen, Trash2, Download, Eye,
  Code2, Briefcase, Palette, Rocket, Clock, AlertCircle, Loader2,
} from 'lucide-react';

const STYLE_META = {
  developer:        { label: 'Developer',      Icon: Code2,     accent: '#2563eb' },
  corporate:        { label: 'Corporate',      Icon: Briefcase, accent: '#0f766e' },
  creative:         { label: 'Creative',       Icon: Palette,   accent: '#7c3aed' },
  'modern-startup': { label: 'Modern Startup', Icon: Rocket,    accent: '#ea580c' },
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [portfolios, setPortfolios] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError]   = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [openingId, setOpeningId]   = useState(null);

  useEffect(() => {
    fetchPortfolios()
      .then(setPortfolios)
      .catch(() => setListError('Failed to load your portfolios. Please refresh.'))
      .finally(() => setLoadingList(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this portfolio? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deletePortfolio(id);
      setPortfolios(prev => prev.filter(p => p.id !== id));
    } catch {
      alert('Failed to delete portfolio. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpen = async (id) => {
    setOpeningId(id);
    try {
      const portfolio = await fetchPortfolioById(id);
      // Navigate to viewer passing data via state
      navigate('/generate', { state: { preloaded: portfolio } });
    } catch {
      alert('Failed to load portfolio. Please try again.');
    } finally {
      setOpeningId(null);
    }
  };

  const handleDownload = async (id, style) => {
    try {
      const portfolio = await fetchPortfolioById(id);
      const blob = new Blob([portfolio.html_content], { type: 'text/html' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `portfolio-${style}-${id}.html`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download portfolio.');
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Welcome */}
      <div style={{ marginBottom: '36px' }}>
        <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--acc)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>
          Dashboard
        </p>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--tx-1)', letterSpacing: '-0.03em', marginBottom: '6px' }}>
          Welcome back, {currentUser?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--tx-3)' }}>
          {portfolios.length > 0
            ? `You have ${portfolios.length} portfolio${portfolios.length > 1 ? 's' : ''} generated.`
            : 'Generate your first portfolio to get started.'}
        </p>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '40px' }}>
        <Link to="/generate" style={{ textDecoration: 'none' }}>
          <div className="card card-hover" style={{ padding: '20px', cursor: 'pointer' }}>
            <div style={{ width: '38px', height: '38px', background: 'var(--acc-light)', border: '1px solid var(--acc-bd)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <Sparkles size={18} color="var(--acc)" strokeWidth={2} />
            </div>
            <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--tx-1)', marginBottom: '3px' }}>Generate Portfolio</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--tx-3)' }}>Upload a resume and create a new portfolio</p>
          </div>
        </Link>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ width: '38px', height: '38px', background: 'rgba(22,163,74,.1)', border: '1px solid rgba(22,163,74,.2)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
            <FolderOpen size={18} color="#16a34a" strokeWidth={2} />
          </div>
          <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--tx-1)', marginBottom: '3px' }}>My Portfolios</p>
          <p style={{ fontSize: '0.78rem', color: 'var(--tx-3)' }}>{portfolios.length} portfolio{portfolios.length !== 1 ? 's' : ''} saved</p>
        </div>
      </div>

      {/* Portfolio History */}
      <div>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--tx-1)', marginBottom: '16px', letterSpacing: '-0.02em' }}>
          Portfolio History
        </h2>

        {loadingList && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--tx-3)', padding: '24px 0' }}>
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: '0.875rem' }}>Loading portfolios…</span>
          </div>
        )}

        {listError && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'rgba(220,38,38,.05)', border: '1px solid rgba(220,38,38,.2)', borderRadius: '10px', padding: '14px 16px', fontSize: '0.85rem', color: '#dc2626' }}>
            <AlertCircle size={16} />
            {listError}
          </div>
        )}

        {!loadingList && !listError && portfolios.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 24px', border: '1px dashed var(--bd)', borderRadius: '12px' }}>
            <FolderOpen size={32} color="var(--tx-3)" strokeWidth={1.5} style={{ marginBottom: '12px' }} />
            <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--tx-2)', marginBottom: '4px' }}>No portfolios yet</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--tx-3)', marginBottom: '16px' }}>Generate your first portfolio to see it here</p>
            <Link to="/generate">
              <button className="btn-primary" style={{ fontSize: '0.83rem', padding: '8px 16px' }}>
                <Sparkles size={14} /> Generate Now
              </button>
            </Link>
          </div>
        )}

        {!loadingList && portfolios.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {portfolios.map((p) => {
              const meta = STYLE_META[p.style] || STYLE_META.developer;
              const { label, Icon, accent } = meta;
              const isDeleting = deletingId === p.id;
              const isOpening  = openingId  === p.id;

              return (
                <div
                  key={p.id}
                  className="card"
                  style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}
                >
                  <div style={{ width: '38px', height: '38px', background: `${accent}15`, borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={17} color={accent} strokeWidth={1.8} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--tx-1)', marginBottom: '2px' }}>
                      {label} Portfolio
                      <span style={{ marginLeft: '8px', fontSize: '0.7rem', fontWeight: 500, background: 'var(--bg-2)', border: '1px solid var(--bd)', borderRadius: '4px', padding: '1px 6px', color: 'var(--tx-3)' }}>
                        #{p.id}
                      </span>
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--tx-3)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={11} /> {formatDate(p.created_at)}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <button
                      className="btn-ghost"
                      onClick={() => handleOpen(p.id)}
                      disabled={isOpening}
                      title="Open in viewer"
                      style={{ padding: '7px 10px', fontSize: '0.78rem' }}
                    >
                      {isOpening ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Eye size={14} />}
                      <span style={{ display: 'none' }}>Open</span>
                    </button>
                    <button
                      className="btn-ghost"
                      onClick={() => handleDownload(p.id, p.style)}
                      title="Download HTML"
                      style={{ padding: '7px 10px', fontSize: '0.78rem' }}
                    >
                      <Download size={14} />
                    </button>
                    <button
                      className="btn-ghost"
                      onClick={() => handleDelete(p.id)}
                      disabled={isDeleting}
                      title="Delete"
                      style={{ padding: '7px 10px', color: isDeleting ? 'var(--tx-3)' : '#dc2626' }}
                    >
                      {isDeleting ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
