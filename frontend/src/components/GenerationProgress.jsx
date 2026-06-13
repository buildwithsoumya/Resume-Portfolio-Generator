import { useEffect, useState } from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { GENERATION_STEPS } from '../lib/constants';

export default function GenerationProgress({ isGenerating, uploadProgress }) {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    if (!isGenerating) {
      setActiveStep(0);
      setCompletedSteps([]);
      return;
    }

    let stepIndex = 0;
    setActiveStep(0);
    setCompletedSteps([]);

    const advance = () => {
      if (stepIndex < GENERATION_STEPS.length - 1) {
        const delay = GENERATION_STEPS[stepIndex].duration;
        return setTimeout(() => {
          setCompletedSteps(prev => [...prev, stepIndex]);
          stepIndex++;
          setActiveStep(stepIndex);
          advance();
        }, delay);
      }
    };

    const timer = advance();
    return () => clearTimeout(timer);
  }, [isGenerating]);

  if (!isGenerating) return null;

  return (
    <div
      className="animate-fade-in"
      style={{
        padding: '20px',
        background: 'var(--bg-1)',
        border: '1px solid var(--bd)',
        borderRadius: '10px',
        marginTop: '16px',
      }}
    >
      <p className="label" style={{ marginBottom: '14px' }}>Generation Progress</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {GENERATION_STEPS.map((step, i) => {
          const isCompleted = completedSteps.includes(i);
          const isActive = activeStep === i;

          return (
            <div
              key={step.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                opacity: i > activeStep ? 0.35 : 1,
                transition: 'opacity 0.3s ease',
              }}
            >
              {isCompleted ? (
                <CheckCircle2 size={16} color="#16a34a" strokeWidth={2} style={{ flexShrink: 0 }} />
              ) : isActive ? (
                <Loader2
                  size={16}
                  color="var(--acc)"
                  strokeWidth={2}
                  style={{ flexShrink: 0, animation: 'spin 1s linear infinite' }}
                />
              ) : (
                <Circle size={16} color="var(--tx-3)" strokeWidth={1.5} style={{ flexShrink: 0 }} />
              )}

              <span
                style={{
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isCompleted ? '#16a34a' : isActive ? 'var(--tx-1)' : 'var(--tx-3)',
                  transition: 'all 0.2s ease',
                }}
              >
                {step.label}
              </span>

              {isActive && (
                <div
                  style={{
                    marginLeft: 'auto',
                    width: '80px',
                    height: '3px',
                    background: 'var(--bg-3)',
                    borderRadius: '99px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      background: 'var(--acc)',
                      borderRadius: '99px',
                      animation: `progress-bar ${step.duration}ms linear forwards`,
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div style={{ marginTop: '14px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '5px',
            }}
          >
            <span style={{ fontSize: '0.72rem', color: 'var(--tx-3)' }}>Upload</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--tx-3)', fontFamily: 'var(--font-mono)' }}>
              {uploadProgress}%
            </span>
          </div>
          <div
            style={{
              height: '3px',
              background: 'var(--bg-3)',
              borderRadius: '99px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                background: 'var(--acc)',
                borderRadius: '99px',
                width: `${uploadProgress}%`,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
