import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchPortfolios, fetchPortfolioById, deletePortfolio } from '../services/api';

const STYLE_META = {
  developer:        { label: 'Developer' },
  corporate:        { label: 'Corporate' },
  creative:         { label: 'Creative' },
  'modern-startup': { label: 'Modern Startup' },
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
      .catch(() => setListError('Failed to load your portfolios.'))
      .finally(() => setLoadingList(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this portfolio? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deletePortfolio(id);
      setPortfolios(prev => prev.filter(p => p.id !== id));
    } catch {
      alert('Failed to delete portfolio.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpen = async (id) => {
    setOpeningId(id);
    try {
      const portfolio = await fetchPortfolioById(id);
      navigate('/generate', { state: { preloaded: portfolio } });
    } catch {
      alert('Failed to load portfolio.');
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
    <div className="max-w-7xl mx-auto w-full px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-main mb-2">My Portfolios</h1>
          <p className="text-text-muted">Manage your generated portfolio websites.</p>
        </div>
        <Link to="/generate">
          <button className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary-hover transition-colors">
            Create New
          </button>
        </Link>
      </div>

      {loadingList && <div className="text-text-muted">Loading portfolios...</div>}
      
      {listError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-100 mb-6">
          {listError}
        </div>
      )}

      {!loadingList && portfolios.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map(p => {
            const meta = STYLE_META[p.style] || STYLE_META.developer;
            const isDeleting = deletingId === p.id;
            const isOpening = openingId === p.id;

            return (
              <div key={p.id} className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="bg-background border-b border-border p-6 h-32 flex items-center justify-center">
                   <span className="text-text-muted font-medium">{meta.label} Style</span>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-text-main mb-1">Portfolio #{p.id}</h3>
                  <p className="text-sm text-text-muted mb-6">
                    Created {formatDate(p.created_at)}
                  </p>
                  
                  <div className="mt-auto flex gap-3">
                    <button 
                      onClick={() => window.open(`/api/portfolios/${p.id}/html`, '_blank')}
                      className="flex-1 bg-surface border border-border text-text-main py-2 rounded-md hover:bg-background transition-colors text-sm font-medium"
                    >
                      Preview
                    </button>
                    <button 
                      onClick={() => handleOpen(p.id)} 
                      disabled={isOpening}
                      className="flex-1 bg-primary text-white py-2 rounded-md hover:bg-primary-hover transition-colors text-sm font-medium"
                    >
                      {isOpening ? 'Loading...' : 'Edit'}
                    </button>
                  </div>
                  
                  <div className="flex gap-3 mt-3">
                    <button 
                      onClick={() => handleDownload(p.id, p.style)}
                      className="flex-1 text-primary hover:text-primary-hover py-2 text-sm font-medium transition-colors"
                    >
                      Download
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id)} 
                      disabled={isDeleting}
                      className="flex-1 text-red-600 hover:text-red-700 py-2 text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loadingList && !listError && portfolios.length === 0 && (
        <div className="text-center py-20 bg-surface border border-border rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-text-main mb-2">No portfolios yet</h2>
          <p className="text-text-muted mb-6">You haven't generated any portfolios yet.</p>
          <Link to="/generate">
            <button className="bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-primary-hover transition-colors">
              Create Your First Portfolio
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
