import { Link } from 'react-router-dom';
import { Zap, Sparkles, ArrowRight, FileText, Wand2, Globe } from 'lucide-react';

const FEATURES = [
  { Icon: FileText, title: 'Upload Resume',       desc: 'Drop your PDF resume — we handle the rest.' },
  { Icon: Wand2,    title: 'AI Extraction',        desc: 'Our AI parses and structures your experience.' },
  { Icon: Globe,    title: 'Instant Portfolio',    desc: 'Get a live portfolio website in seconds.' },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-1)' }}>
      {/* ─── Nav ─── */}
      <header style={{ borderBottom: '1px solid var(--bd)', background: 'var(--bg-0)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', background: 'var(--acc)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={15} color="white" strokeWidth={2.5} />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--tx-1)', letterSpacing: '-0.03em' }}>FolioSnap</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to="/login">
              <button className="btn-ghost" style={{ fontSize: '0.85rem' }}>Sign In</button>
            </Link>
            <Link to="/register">
              <button className="btn-primary" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>Get Started</button>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section style={{ maxWidth: '700px', margin: '0 auto', padding: '96px 24px 64px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--acc-light)', border: '1px solid var(--acc-bd)', borderRadius: '6px', padding: '5px 12px', marginBottom: '24px' }}>
          <Sparkles size={13} color="var(--acc)" strokeWidth={2} />
          <span style={{ fontSize: '0.73rem', fontWeight: 600, color: 'var(--acc)' }}>AI-Powered · Instant · Free to try</span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', fontWeight: 800, color: 'var(--tx-1)', lineHeight: 1.1, letterSpacing: '-0.04em', marginBottom: '20px' }}>
          Turn your résumé into a<br />
          <span style={{ color: 'var(--acc)' }}>portfolio website</span><br />
          in seconds.
        </h1>

        <p style={{ fontSize: '1.05rem', color: 'var(--tx-2)', lineHeight: 1.65, maxWidth: '520px', margin: '0 auto 36px' }}>
          Upload your resume PDF, pick a design style, and watch FolioSnap AI craft a fully functional, beautiful portfolio — no code required.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register">
            <button className="btn-primary" style={{ padding: '12px 24px', fontSize: '0.95rem', borderRadius: '10px' }}>
              <Sparkles size={16} /> Start for Free
            </button>
          </Link>
          <Link to="/login">
            <button className="btn-secondary" style={{ padding: '12px 24px', fontSize: '0.95rem', borderRadius: '10px' }}>
              Sign In <ArrowRight size={15} />
            </button>
          </Link>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {FEATURES.map(({ Icon, title, desc }) => (
            <div key={title} className="card" style={{ padding: '24px' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--acc-light)', border: '1px solid var(--acc-bd)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Icon size={19} color="var(--acc)" strokeWidth={1.8} />
              </div>
              <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--tx-1)', marginBottom: '5px' }}>{title}</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--tx-3)', lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
