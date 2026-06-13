import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, CheckCircle2 } from 'lucide-react';

export default function ResumeUpload({ file, onFileAccepted, onFileRemove, error }) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10 MB
    onDropAccepted: ([accepted]) => onFileAccepted(accepted),
    disabled: !!file,
  });

  const borderColor = isDragReject
    ? '#dc2626'
    : isDragActive
    ? 'var(--acc)'
    : file
    ? '#16a34a'
    : 'var(--bd)';

  const bgColor = isDragReject
    ? 'rgba(220,38,38,.05)'
    : isDragActive
    ? 'var(--acc-light)'
    : file
    ? 'rgba(22,163,74,.04)'
    : 'var(--bg-1)';

  return (
    <div>
      <p className="label" style={{ marginBottom: '10px' }}>Resume PDF</p>

      {!file ? (
        <div
          {...getRootProps()}
          id="resume-dropzone"
          style={{
            border: `2px dashed ${borderColor}`,
            background: bgColor,
            borderRadius: '10px',
            padding: '32px 24px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            outline: 'none',
          }}
        >
          <input {...getInputProps()} id="resume-file-input" />

          <div
            style={{
              width: '44px',
              height: '44px',
              background: 'var(--bg-2)',
              border: '1px solid var(--bd)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
            }}
          >
            <Upload size={20} color={isDragActive ? 'var(--acc)' : 'var(--tx-3)'} strokeWidth={1.8} />
          </div>

          {isDragReject ? (
            <p style={{ color: '#dc2626', fontWeight: 500, fontSize: '0.9rem' }}>
              Only PDF files are accepted
            </p>
          ) : isDragActive ? (
            <p style={{ color: 'var(--acc)', fontWeight: 500, fontSize: '0.9rem' }}>
              Drop your resume here
            </p>
          ) : (
            <>
              <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--tx-1)', marginBottom: '4px' }}>
                Drag & drop your resume
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--tx-3)' }}>
                or <span style={{ color: 'var(--acc)', fontWeight: 600 }}>browse to upload</span>
              </p>
              <p style={{ fontSize: '0.73rem', color: 'var(--tx-3)', marginTop: '10px' }}>
                PDF only · Max 10 MB
              </p>
            </>
          )}
        </div>
      ) : (
        <div
          id="uploaded-file-card"
          style={{
            border: '1px solid #bbf7d0',
            background: 'rgba(22,163,74,.04)',
            borderRadius: '10px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.2s ease',
          }}
          className="animate-fade-in"
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              background: 'rgba(22,163,74,.1)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <FileText size={18} color="#16a34a" strokeWidth={1.8} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontWeight: 600,
                fontSize: '0.875rem',
                color: 'var(--tx-1)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {file.name}
            </p>
            <p style={{ fontSize: '0.73rem', color: 'var(--tx-3)', marginTop: '2px' }}>
              {(file.size / 1024).toFixed(0)} KB · PDF Document
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <CheckCircle2 size={16} color="#16a34a" strokeWidth={2} />
            <button
              id="remove-file-btn"
              className="btn-ghost"
              onClick={onFileRemove}
              aria-label="Remove file"
              style={{ padding: '5px', color: 'var(--tx-3)' }}
            >
              <X size={15} strokeWidth={2} />
            </button>
          </div>
        </div>
      )}

      {error && (
        <p
          style={{
            fontSize: '0.78rem',
            color: '#dc2626',
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
