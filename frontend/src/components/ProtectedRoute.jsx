import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wraps any route that requires authentication.
 * Shows a spinner while session is being restored, then redirects to /login
 * if unauthenticated, preserving the intended destination in location state.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '12px',
        color: 'var(--tx-3)',
      }}>
        <div className="spinner-muted" style={{ width: '24px', height: '24px' }} />
        <span style={{ fontSize: '0.85rem' }}>Restoring session…</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
