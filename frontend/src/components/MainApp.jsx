import { useState } from 'react';
import { Sparkles, FileText, Wand2, Globe } from 'lucide-react';
import ResumeUpload from './ResumeUpload';
import StyleSelector from './StyleSelector';
import GenerationProgress from './GenerationProgress';
import ErrorCard from './ErrorCard';
import { generatePortfolio } from '../services/api';

const TRUST_BADGES = [
  { Icon: FileText, label: 'PDF Upload' },
  { Icon: Wand2,    label: 'AI Analysis' },
  { Icon: Globe,    label: 'Instant Portfolio' },
];

export default function MainApp({ onPortfolioReady }) {
  const [file, setFile]             = useState(null);
  const [style, setStyle]           = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError]           = useState(null);
  const [fileError, setFileError]   = useState(null);

  const canGenerate = !!file && !!style && !isGenerating;

  const handleFileAccepted = (accepted) => {
    setFileError(null);
    setError(null);
    setFile(accepted);
  };

  const handleFileRemove = () => {
    setFile(null);
    setFileError(null);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!file)  { setFileError('Please upload a PDF resume before generating.'); return; }
    if (!style) { setError({ type: 'generation_failed', message: 'Please select a portfolio style.' }); return; }
    if (isGenerating) return;

    setError(null);
    setFileError(null);
    setIsGenerating(true);
    setUploadProgress(0);

    try {
      const result = await generatePortfolio(file, style, setUploadProgress);
      onPortfolioReady({ html: result.html, file, style });
    } catch (err) {
      const status = err?.response?.status;
      const serverMsg = err?.response?.data?.detail || err?.response?.data?.message;

      if (!err?.response) {
        // Network error — backend unreachable or CORS
        setError({ type: 'upload_failed', message: 'Cannot reach the server. Make sure the backend is running.' });
      } else if (status === 400 || status === 415 || status === 422) {
        // Bad request — likely invalid file type or missing fields
        setError({ type: 'invalid_pdf', message: serverMsg || 'The file or request was rejected by the server.' });
      } else if (status >= 500) {
        // Backend/AI error
        setError({ type: 'generation_failed', message: serverMsg || 'The server encountered an error. Please try again.' });
      } else {
        // Our own response-validation error or unexpected status
        setError({ type: 'generation_failed', message: err?.message || 'An unexpected error occurred.' });
      }
    } finally {
      setIsGenerating(false);
      setUploadProgress(0);
    }
  };

  return (
    <div
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '48px 24px',
        display: 'grid',
        gridTemplateColumns: '1fr 480px',
        gap: '56px',
        alignItems: 'start',
      }}
      className="main-app-grid"
    >
      {/* ─── Left: Hero ─────────────────────────────────────── */}
      <div style={{ paddingTop: '24px' }}>
        <div style={{ marginBottom: '28px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--acc-light)',
              border: '1px solid var(--acc-bd)',
              borderRadius: '6px',
              padding: '5px 10px',
              marginBottom: '20px',
            }}
          >
            <Sparkles size={13} color="var(--acc)" strokeWidth={2} />
            <span style={{ fontSize: '0.73rem', fontWeight: 600, color: 'var(--acc)', letterSpacing: '0.02em' }}>
              AI-Powered Portfolio Builder
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              color: 'var(--tx-1)',
              lineHeight: 1.1,
              letterSpacing: '-0.04em',
              marginBottom: '16px',
            }}
          >
            Turn your résumé into a<br />
            <span style={{ color: 'var(--acc)' }}>portfolio website</span>
            <br />in seconds.
          </h1>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--tx-2)',
              lineHeight: '1.65',
              maxWidth: '480px',
              fontWeight: 400,
            }}
          >
            Upload your resume PDF, pick a style, and watch our AI craft a fully
            functional, beautiful portfolio site — no code required.
          </p>
        </div>

        {/* Trust badges */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {TRUST_BADGES.map(({ Icon, label }) => (
            <div key={label} className="tag">
              <Icon size={12} strokeWidth={2} />
              {label}
            </div>
          ))}
        </div>

        {/* Decorative code block */}
        <div
          style={{
            marginTop: '40px',
            background: 'var(--bg-0)',
            border: '1px solid var(--bd)',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: 'var(--sh-md)',
          }}
        >
          <div
            style={{
              background: 'var(--bg-2)',
              borderBottom: '1px solid var(--bd)',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {['#ff5f56','#ffbd2e','#27c93f'].map(c => (
              <span key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />
            ))}
            <span style={{ fontSize: '0.72rem', color: 'var(--tx-3)', marginLeft: '8px', fontFamily: 'var(--font-mono)' }}>
              portfolio.html — generated by FolioSnap AI
            </span>
          </div>
          <div style={{ padding: '16px 20px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', lineHeight: '1.8' }}>
            {[
              { color: '#7c3aed', text: '<section ' },
              { color: 'var(--acc)', text: 'class', inline: true },
              { color: 'var(--tx-2)', text: '="hero">', inline: true },
              { color: 'var(--tx-3)', break: true, text: '  <h1>John Doe</h1>' },
              { color: 'var(--tx-3)', text: '  <p>Full-Stack Engineer</p>' },
              { color: 'var(--tx-3)', text: '  <div class="skills">...</div>' },
              { color: '#7c3aed', text: '</section>' },
            ].map((line, i) =>
              line.break ? (
                <div key={i} style={{ color: 'var(--tx-3)' }}>{line.text}</div>
              ) : (
                <div key={i} style={{ color: line.color }}>{line.text}</div>
              )
            )}
          </div>
        </div>
      </div>

      {/* ─── Right: Upload Card ──────────────────────────────── */}
      <div>
        <div
          className="card"
          style={{ padding: '28px', boxShadow: 'var(--sh-lg)' }}
        >
          <h2
            style={{
              fontWeight: 700,
              fontSize: '1.05rem',
              color: 'var(--tx-1)',
              marginBottom: '4px',
              letterSpacing: '-0.02em',
            }}
          >
            Create your portfolio
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--tx-3)', marginBottom: '24px' }}>
            Upload your résumé and choose a style to get started.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <ResumeUpload
              file={file}
              onFileAccepted={handleFileAccepted}
              onFileRemove={handleFileRemove}
              error={fileError}
            />

            <StyleSelector selected={style} onSelect={setStyle} />

            <button
              id="generate-portfolio-btn"
              className="btn-primary"
              disabled={!canGenerate}
              onClick={handleGenerate}
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '13px',
                fontSize: '0.93rem',
                borderRadius: '10px',
              }}
            >
              {isGenerating ? (
                <>
                  <span className="spinner" style={{ width: '16px', height: '16px' }} />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles size={16} strokeWidth={2} />
                  Generate Portfolio
                </>
              )}
            </button>

            {isGenerating && (
              <GenerationProgress
                isGenerating={isGenerating}
                uploadProgress={uploadProgress}
              />
            )}

            {error && (
              <ErrorCard
                type={error.type}
                message={error.message}
                onRetry={() => { setError(null); handleGenerate(); }}
              />
            )}
          </div>
        </div>

        {/* Fine print */}
        <p
          style={{
            textAlign: 'center',
            fontSize: '0.72rem',
            color: 'var(--tx-3)',
            marginTop: '14px',
          }}
        >
          Your resume is processed securely and never stored permanently.
        </p>
      </div>
    </div>
  );
}
