import { AlertCircle, RefreshCw } from 'lucide-react';

const ERROR_MESSAGES = {
  invalid_pdf:  { title: 'Invalid File', body: 'Please upload a valid PDF document. Other file types are not supported.' },
  upload_failed: { title: 'Upload Failed', body: 'We couldn\'t upload your resume. Check your connection and try again.' },
  generation_failed: { title: 'Generation Failed', body: 'The AI couldn\'t generate your portfolio. Please try again or choose a different style.' },
  default: { title: 'Something went wrong', body: 'An unexpected error occurred. Please try again.' },
};

export default function ErrorCard({ type = 'default', message, onRetry }) {
  const { title, body } = ERROR_MESSAGES[type] || ERROR_MESSAGES.default;

  return (
    <div
      id="error-card"
      className="animate-fade-in"
      style={{
        background: 'rgba(220,38,38,.04)',
        border: '1px solid rgba(220,38,38,.2)',
        borderRadius: '10px',
        padding: '16px',
        display: 'flex',
        gap: '12px',
        marginTop: '12px',
      }}
    >
      <div style={{ flexShrink: 0, marginTop: '1px' }}>
        <AlertCircle size={17} color="#dc2626" strokeWidth={2} />
      </div>

      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#dc2626', marginBottom: '3px' }}>
          {title}
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--tx-2)', lineHeight: '1.5' }}>
          {message || body}
        </p>
        {onRetry && (
          <button
            id="retry-btn"
            className="btn-ghost"
            onClick={onRetry}
            style={{ marginTop: '10px', color: '#dc2626', padding: '5px 0', fontWeight: 600, fontSize: '0.8rem' }}
          >
            <RefreshCw size={13} strokeWidth={2} />
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
