import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import MainApp from '../components/MainApp';
import PortfolioViewer from '../components/PortfolioViewer';

import PortfolioEditor from '../components/PortfolioEditor';

/**
 * GeneratePage wraps the existing MainApp + PortfolioViewer + PortfolioEditor.
 * It also accepts a preloaded portfolio passed via React Router state
 * (used when clicking "Open" from the Dashboard).
 */
export default function GeneratePage() {
  const location = useLocation();
  const preloaded = location.state?.preloaded || null;

  // If preloaded from dashboard: { html_content, style, id, original_html }
  const [portfolio, setPortfolio] = useState(
    preloaded
      ? { html: preloaded.html_content, style: preloaded.style, file: null, id: preloaded.id, original_html: preloaded.original_html }
      : null
  );

  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      {portfolio ? (
        isEditing ? (
          <PortfolioEditor 
            portfolio={{...portfolio, html_content: portfolio.html}} 
            onBack={() => setIsEditing(false)} 
            onSaved={(updated) => setPortfolio(prev => ({...prev, html: updated.html_content}))}
          />
        ) : (
          <div style={{ padding: '20px 24px', maxWidth: '1400px', margin: '0 auto' }}>
            <PortfolioViewer
              html={portfolio.html}
              file={portfolio.file}
              style={portfolio.style}
              onReset={() => { setPortfolio(null); setIsEditing(false); }}
              onEdit={() => setIsEditing(true)}
            />
          </div>
        )
      ) : (
        <MainApp onPortfolioReady={(p) => {
          // p contains: { html, file, style, portfolio_id }
          setPortfolio({ html: p.html, file: p.file, style: p.style, id: p.portfolio_id, original_html: p.html });
        }} />
      )}
    </>
  );
}
