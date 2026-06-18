import { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { generatePortfolio } from '../services/api';
import PortfolioViewer from '../components/PortfolioViewer';
import PortfolioEditor from '../components/PortfolioEditor';

export default function GeneratePage() {
  const location = useLocation();
  const preloaded = location.state?.preloaded || null;

  const [portfolio, setPortfolio] = useState(
    preloaded ? { html: preloaded.html_content, style: preloaded.style, file: null, id: preloaded.id, original_html: preloaded.original_html } : null
  );
  const [isEditing, setIsEditing] = useState(false);

  const [file, setFile] = useState(null);
  const [style, setStyle] = useState('developer');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  if (portfolio) {
    if (isEditing) {
      return (
        <PortfolioEditor 
          portfolio={{...portfolio, html_content: portfolio.html}} 
          onBack={() => setIsEditing(false)} 
          onSaved={(updated) => setPortfolio(prev => ({...prev, html: updated.html_content}))}
        />
      );
    }
    return (
      <div className="w-full mx-auto px-6 py-6">
        <PortfolioViewer
          html={portfolio.html}
          file={portfolio.file}
          style={portfolio.style}
          onReset={() => { setPortfolio(null); setIsEditing(false); setFile(null); }}
          onEdit={() => setIsEditing(true)}
        />
      </div>
    );
  }

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setError(null);
    } else {
      alert('Please upload a PDF file.');
    }
  };

  const startGeneration = async () => {
    if (!file || !style) return;
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await generatePortfolio(file, style, () => {});
      setPortfolio({ html: result.html, file, style, id: result.portfolio_id, original_html: result.html });
    } catch (err) {
      setIsGenerating(false);
      const serverMsg = err?.response?.data?.detail || err?.response?.data?.message || err?.message || 'Cannot reach the server.';
      setError(serverMsg);
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center py-12 px-6">
      <div className="max-w-xl w-full bg-surface border border-border p-8 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold text-text-main mb-2">Create Portfolio</h1>
        <p className="text-text-muted mb-8">Upload your resume and select a style.</p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-100 mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-text-main mb-2">1. Upload Resume (PDF)</label>
          <div 
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${file ? 'border-primary bg-primary/5' : 'border-border hover:border-primary'}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
            {file ? (
              <span className="text-primary font-medium">{file.name}</span>
            ) : (
              <span className="text-text-muted">Click to browse or drag and drop</span>
            )}
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-text-main mb-2">2. Select Design Style</label>
          <select 
            value={style} 
            onChange={(e) => setStyle(e.target.value)}
            className="w-full border border-border rounded-lg p-3 bg-surface text-text-main outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="developer">Developer (Technical, clean)</option>
            <option value="corporate">Corporate (Professional, grid)</option>
            <option value="creative">Creative (Bold, artistic)</option>
            <option value="modern-startup">Modern Startup (Fresh, dynamic)</option>
          </select>
        </div>

        <button 
          disabled={!file || isGenerating} 
          onClick={startGeneration} 
          className={`w-full py-3 rounded-lg font-medium transition-colors ${!file || isGenerating ? 'bg-border text-text-muted cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-hover'}`}
        >
          {isGenerating ? 'Generating Portfolio...' : 'Generate Portfolio'}
        </button>
      </div>
    </div>
  );
}
