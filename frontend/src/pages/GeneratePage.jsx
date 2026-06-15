import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import MainApp from '../components/MainApp';
import PortfolioViewer from '../components/PortfolioViewer';

/**
 * GeneratePage wraps the existing MainApp + PortfolioViewer.
 * It also accepts a preloaded portfolio passed via React Router state
 * (used when clicking "Open" from the Dashboard).
 */
export default function GeneratePage() {
  const location = useLocation();
  const preloaded = location.state?.preloaded || null;

  // If preloaded from dashboard: { html_content, style, id }
  const [portfolio, setPortfolio] = useState(
    preloaded
      ? { html: preloaded.html_content, style: preloaded.style, file: null }
      : null
  );

  return (
    <>
      {portfolio ? (
        <div style={{ padding: '20px 24px', maxWidth: '1400px', margin: '0 auto' }}>
          <PortfolioViewer
            html={portfolio.html}
            file={portfolio.file}
            style={portfolio.style}
            onReset={() => setPortfolio(null)}
          />
        </div>
      ) : (
        <MainApp onPortfolioReady={setPortfolio} />
      )}
    </>
  );
}
