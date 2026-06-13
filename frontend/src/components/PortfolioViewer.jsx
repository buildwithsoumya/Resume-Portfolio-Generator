import { useRef } from 'react';
import {
  FileText, RefreshCw, Download, CheckCircle2,
  Code2, Briefcase, Palette, Rocket, ExternalLink,
} from 'lucide-react';

const STYLE_META = {
  developer:      { label: 'Developer',      Icon: Code2,     accent: '#2563eb' },
  corporate:      { label: 'Corporate',      Icon: Briefcase, accent: '#0f766e' },
  creative:       { label: 'Creative',       Icon: Palette,   accent: '#7c3aed' },
  'modern-startup': { label: 'Modern Startup', Icon: Rocket,  accent: '#ea580c' },
};

export default function PortfolioViewer({ file, style, html, onReset }) {
  const iframeRef = useRef(null);
  const meta = STYLE_META[style] || STYLE_META.developer;
  const { label, Icon, accent } = meta;

  const handleDownload = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-${style}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenNewTab = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div
      id="portfolio-viewer-grid"
      className="animate-fade-in"
      style={{
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: '20px',
        height: 'calc(100vh - 96px)',
        minHeight: '600px',
      }}
    >
      {/* ─── Left Panel ─────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          overflowY: 'auto',
        }}
      >
        {/* Status banner */}
        <div
          style={{
            background: 'rgba(22,163,74,.06)',
            border: '1px solid rgba(22,163,74,.2)',
            borderRadius: '10px',
            padding: '14px',
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-start',
          }}
        >
          <CheckCircle2 size={17} color="#16a34a" strokeWidth={2} style={{ flexShrink: 0, marginTop: '1px' }} />
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.83rem', color: '#16a34a' }}>Portfolio Generated</p>
            <p style={{ fontSize: '0.73rem', color: 'var(--tx-3)', marginTop: '2px' }}>
              Your portfolio is ready to preview and download.
            </p>
          </div>
        </div>

        {/* File info */}
        <div className="card" style={{ padding: '14px' }}>
          <p className="label" style={{ marginBottom: '10px' }}>Source File</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                background: 'var(--bg-2)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <FileText size={16} color="var(--tx-3)" strokeWidth={1.8} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  color: 'var(--tx-1)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {file?.name}
              </p>
              <p style={{ fontSize: '0.72rem', color: 'var(--tx-3)' }}>
                {file ? `${(file.size / 1024).toFixed(0)} KB` : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Style info */}
        <div className="card" style={{ padding: '14px' }}>
          <p className="label" style={{ marginBottom: '10px' }}>Selected Style</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                background: `${accent}15`,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon size={16} color={accent} strokeWidth={1.8} />
            </div>
            <p style={{ fontWeight: 600, fontSize: '0.85rem', color: accent }}>{label}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p className="label" style={{ marginBottom: '2px' }}>Actions</p>

          <button
            id="download-html-btn"
            className="btn-primary"
            onClick={handleDownload}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <Download size={15} strokeWidth={2} />
            Download HTML
          </button>

          <button
            id="open-new-tab-btn"
            className="btn-secondary"
            onClick={handleOpenNewTab}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <ExternalLink size={15} strokeWidth={2} />
            Open in New Tab
          </button>

          <button
            id="generate-again-btn"
            className="btn-ghost"
            onClick={onReset}
            style={{
              width: '100%',
              justifyContent: 'center',
              borderTop: '1px solid var(--bd)',
              borderRadius: 0,
              paddingTop: '10px',
              marginTop: '4px',
            }}
          >
            <RefreshCw size={14} strokeWidth={2} />
            Generate Again
          </button>
        </div>
      </div>

      {/* ─── Right Panel ────────────────────────────────────── */}
      <div
        style={{
          background: 'var(--bg-2)',
          border: '1px solid var(--bd)',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Browser chrome bar */}
        <div
          style={{
            background: 'var(--bg-1)',
            borderBottom: '1px solid var(--bd)',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#ff5f56', '#ffbd2e', '#27c93f'].map(c => (
              <span key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />
            ))}
          </div>
          <div
            style={{
              flex: 1,
              background: 'var(--bg-2)',
              border: '1px solid var(--bd)',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '0.72rem',
              color: 'var(--tx-3)',
              fontFamily: 'var(--font-mono)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            portfolio-preview — {label} Style
          </div>
        </div>

        <iframe
          ref={iframeRef}
          id="portfolio-preview-iframe"
          srcDoc={html}
          title="Portfolio Preview"
          sandbox="allow-scripts allow-same-origin"
          style={{
            flex: 1,
            width: '100%',
            border: 'none',
            background: 'white',
          }}
        />
      </div>
    </div>
  );
}
