import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import MainApp from './components/MainApp';
import PortfolioViewer from './components/PortfolioViewer';
import './index.css';

export default function App() {
  const [portfolio, setPortfolio] = useState(null); // { html, file, style }

  return (
    <ThemeProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />

        <main style={{ flex: 1 }}>
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
        </main>

        <footer
          style={{
            borderTop: '1px solid var(--bd)',
            padding: '16px 24px',
            textAlign: 'center',
            fontSize: '0.73rem',
            color: 'var(--tx-3)',
          }}
        >
          © {new Date().getFullYear()} FolioSnap — AI-Powered Portfolio Generator
        </footer>
      </div>
    </ThemeProvider>
  );
}
