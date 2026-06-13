import { PORTFOLIO_STYLES } from '../lib/constants';

export default function StyleSelector({ selected, onSelect }) {
  return (
    <div>
      <p className="label" style={{ marginBottom: '10px' }}>Portfolio Style</p>

      <div
        id="style-selector-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
        }}
      >
        {PORTFOLIO_STYLES.map(({ id, label, Icon, description, accent }) => {
          const isSelected = selected === id;

          return (
            <button
              key={id}
              id={`style-${id}`}
              onClick={() => onSelect(id)}
              style={{
                textAlign: 'left',
                background: isSelected ? `${accent}0d` : 'var(--bg-1)',
                border: `1.5px solid ${isSelected ? accent : 'var(--bd)'}`,
                borderRadius: '10px',
                padding: '14px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                outline: 'none',
                position: 'relative',
                overflow: 'hidden',
              }}
              aria-pressed={isSelected}
              aria-label={`Select ${label} style`}
            >
              {isSelected && (
                <span
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '7px',
                    height: '7px',
                    background: accent,
                    borderRadius: '50%',
                  }}
                />
              )}

              <div
                style={{
                  width: '32px',
                  height: '32px',
                  background: isSelected ? `${accent}1a` : 'var(--bg-2)',
                  border: `1px solid ${isSelected ? `${accent}33` : 'var(--bd)'}`,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon
                  size={16}
                  color={isSelected ? accent : 'var(--tx-3)'}
                  strokeWidth={1.8}
                />
              </div>

              <p
                style={{
                  fontWeight: 600,
                  fontSize: '0.83rem',
                  color: isSelected ? accent : 'var(--tx-1)',
                  marginBottom: '4px',
                  transition: 'color 0.15s ease',
                }}
              >
                {label}
              </p>
              <p
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--tx-3)',
                  lineHeight: '1.4',
                }}
              >
                {description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
