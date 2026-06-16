import { useState, useEffect, useRef, useCallback } from 'react';
import { Save, RotateCcw, Download, X, Plus, Trash2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { updatePortfolio } from '../services/api';

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default function PortfolioEditor({ portfolio, onBack, onSaved }) {
  const [doc, setDoc] = useState(null);
  const [htmlContent, setHtmlContent] = useState(portfolio.html_content);
  
  const [fields, setFields] = useState({});
  const [lists, setLists] = useState({});
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(''); // 'saved', 'unsaved'
  const iframeRef = useRef(null);

  // Parse HTML into DOM on mount
  useEffect(() => {
    const parser = new DOMParser();
    const d = parser.parseFromString(portfolio.html_content, 'text/html');
    setDoc(d);
    
    // Extract simple fields
    const newFields = {};
    ['name', 'headline', 'about', 'contact'].forEach(key => {
      const el = d.querySelector(`[data-editable="${key}"]`);
      newFields[key] = el ? el.innerHTML : '';
    });
    setFields(newFields);

    // Extract lists
    const newLists = {};
    ['skills', 'projects', 'experience', 'education'].forEach(key => {
      const container = d.querySelector(`[data-list="${key}"]`);
      if (container) {
        newLists[key] = Array.from(container.children).map((el, i) => ({
          id: `${key}-${i}`,
          html: el.innerHTML,
        }));
      } else {
        newLists[key] = [];
      }
    });
    setLists(newLists);
  }, [portfolio.html_content]);

  // Update HTML string whenever fields or lists change
  const updateHtml = useCallback(() => {
    if (!doc) return;
    
    // Update simple fields
    ['name', 'headline', 'about', 'contact'].forEach(key => {
      const el = doc.querySelector(`[data-editable="${key}"]`);
      if (el && fields[key] !== undefined) {
        el.innerHTML = fields[key];
      }
    });

    // Update lists
    ['skills', 'projects', 'experience', 'education'].forEach(key => {
      const container = doc.querySelector(`[data-list="${key}"]`);
      if (container && lists[key]) {
        // Clear container
        const templateNode = container.children[0]?.cloneNode(false) || doc.createElement('div');
        container.innerHTML = '';
        
        lists[key].forEach(item => {
          const child = templateNode.cloneNode(false);
          child.innerHTML = item.html;
          container.appendChild(child);
        });
      }
    });

    const newHtml = doc.documentElement.outerHTML;
    setHtmlContent(newHtml);
    setSaveStatus('unsaved');
  }, [doc, fields, lists]);

  // Debounce the HTML generation to avoid excessive iframe reloads
  const debouncedUpdate = useCallback(debounce(updateHtml, 300), [updateHtml]);

  useEffect(() => {
    debouncedUpdate();
  }, [fields, lists, debouncedUpdate]);

  const handleFieldChange = (key, val) => {
    setFields(prev => ({ ...prev, [key]: val }));
  };

  const handleListItemChange = (listKey, id, val) => {
    setLists(prev => ({
      ...prev,
      [listKey]: prev[listKey].map(item => item.id === id ? { ...item, html: val } : item)
    }));
  };

  const addListItem = (listKey) => {
    setLists(prev => {
      const list = prev[listKey] || [];
      const newId = `${listKey}-${Date.now()}`;
      // Clone HTML of the last item, or empty if none
      const templateHtml = list.length > 0 ? list[list.length - 1].html : 'New Item';
      return { ...prev, [listKey]: [...list, { id: newId, html: templateHtml }] };
    });
  };

  const removeListItem = (listKey, id) => {
    setLists(prev => ({
      ...prev,
      [listKey]: prev[listKey].filter(item => item.id !== id)
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await updatePortfolio(portfolio.id, htmlContent);
      setSaveStatus('saved');
      if (onSaved) onSaved(updated);
      setTimeout(() => setSaveStatus(''), 3000);
    } catch {
      alert('Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (!confirm('Discard all unsaved changes and revert to original?')) return;
    
    // Reset to original_html if exists, else fallback to current
    const original = portfolio.original_html || portfolio.html_content;
    const parser = new DOMParser();
    const d = parser.parseFromString(original, 'text/html');
    setDoc(d);
    
    const newFields = {};
    ['name', 'headline', 'about', 'contact'].forEach(key => {
      const el = d.querySelector(`[data-editable="${key}"]`);
      newFields[key] = el ? el.innerHTML : '';
    });
    setFields(newFields);

    const newLists = {};
    ['skills', 'projects', 'experience', 'education'].forEach(key => {
      const container = d.querySelector(`[data-list="${key}"]`);
      if (container) {
        newLists[key] = Array.from(container.children).map((el, i) => ({
          id: `${key}-${i}`,
          html: el.innerHTML,
        }));
      } else {
        newLists[key] = [];
      }
    });
    setLists(newLists);
    setHtmlContent(original);
    setSaveStatus('');
  };

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-${portfolio.style}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBack = () => {
    if (saveStatus === 'unsaved') {
      if (!confirm('You have unsaved changes. Are you sure you want to leave?')) return;
    }
    onBack();
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', height: 'calc(100vh - 57px)', overflow: 'hidden' }}>
      {/* ─── LEFT SIDE: Editor ─── */}
      <div style={{ background: 'var(--bg-0)', borderRight: '1px solid var(--bd)', display: 'flex', flexDirection: 'column' }}>
        
        {/* Editor Header */}
        <div style={{ padding: '16px', borderBottom: '1px solid var(--bd)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button className="btn-ghost" onClick={handleBack} style={{ padding: '6px' }}>
              <ArrowLeft size={16} />
            </button>
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Edit Portfolio</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {saveStatus === 'unsaved' && <span style={{ fontSize: '0.75rem', color: '#ea580c', fontWeight: 500 }}>Unsaved</span>}
            {saveStatus === 'saved' && <span style={{ fontSize: '0.75rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={12}/> Saved</span>}
            <button className="btn-primary" onClick={handleSave} disabled={isSaving || saveStatus !== 'unsaved'} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              {isSaving ? 'Saving...' : <><Save size={14} /> Save</>}
            </button>
          </div>
        </div>

        {/* Editor Form */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          
          <div style={{ marginBottom: '24px' }}>
            <h3 style={styles.sectionTitle}>Basic Info</h3>
            {['name', 'headline'].map(key => (
              <div key={key} style={styles.field}>
                <label style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                <input 
                  value={fields[key] || ''} 
                  onChange={e => handleFieldChange(key, e.target.value)}
                  style={styles.input}
                />
              </div>
            ))}
            
            <div style={styles.field}>
              <label style={styles.label}>About</label>
              <textarea 
                value={fields['about'] || ''} 
                onChange={e => handleFieldChange('about', e.target.value)}
                style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Contact Info (HTML)</label>
              <textarea 
                value={fields['contact'] || ''} 
                onChange={e => handleFieldChange('contact', e.target.value)}
                style={{ ...styles.input, minHeight: '60px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}
              />
            </div>
          </div>

          {['skills', 'projects', 'experience', 'education'].map(listKey => (
            <div key={listKey} style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h3 style={styles.sectionTitle}>{listKey.charAt(0).toUpperCase() + listKey.slice(1)}</h3>
                <button className="btn-ghost" onClick={() => addListItem(listKey)} style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                  <Plus size={12} /> Add Item
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(lists[listKey] || []).map((item, idx) => (
                  <div key={item.id} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <textarea 
                      value={item.html}
                      onChange={e => handleListItemChange(listKey, item.id, e.target.value)}
                      style={{ ...styles.input, minHeight: '60px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', flex: 1 }}
                    />
                    <button className="btn-ghost" onClick={() => removeListItem(listKey, item.id)} style={{ padding: '6px', color: '#dc2626' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {(!lists[listKey] || lists[listKey].length === 0) && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--tx-3)', fontStyle: 'italic' }}>No items found in HTML.</p>
                )}
              </div>
            </div>
          ))}

        </div>

        {/* Editor Footer Actions */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--bd)', display: 'flex', gap: '10px' }}>
          <button className="btn-ghost" onClick={handleReset} style={{ flex: 1, justifyContent: 'center' }}>
            <RotateCcw size={14} /> Reset
          </button>
          <button className="btn-secondary" onClick={handleDownload} style={{ flex: 1, justifyContent: 'center' }}>
            <Download size={14} /> Download
          </button>
        </div>
      </div>

      {/* ─── RIGHT SIDE: Live Preview ─── */}
      <div style={{ background: 'var(--bg-2)', display: 'flex', flexDirection: 'column', padding: '16px' }}>
        <div style={{ flex: 1, background: 'var(--bg-1)', borderRadius: '12px', border: '1px solid var(--bd)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ background: 'var(--bg-0)', borderBottom: '1px solid var(--bd)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              {['#ff5f56', '#ffbd2e', '#27c93f'].map(c => <span key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
            </div>
            <div style={{ flex: 1, background: 'var(--bg-2)', border: '1px solid var(--bd)', borderRadius: '6px', padding: '4px 10px', fontSize: '0.72rem', color: 'var(--tx-3)', fontFamily: 'var(--font-mono)', textAlign: 'center' }}>
              Live Preview
            </div>
          </div>

          <iframe
            ref={iframeRef}
            srcDoc={htmlContent}
            title="Live Preview"
            sandbox="allow-scripts allow-same-origin"
            style={{ flex: 1, width: '100%', border: 'none', background: 'white' }}
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  sectionTitle: { fontSize: '0.85rem', fontWeight: 700, color: 'var(--tx-1)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' },
  label: { fontSize: '0.75rem', fontWeight: 600, color: 'var(--tx-2)' },
  input: { width: '100%', boxSizing: 'border-box', padding: '8px 10px', background: 'var(--bg-1)', border: '1px solid var(--bd)', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--tx-1)', outline: 'none', fontFamily: 'inherit' },
};
