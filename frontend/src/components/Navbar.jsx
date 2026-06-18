import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="w-full bg-surface border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="font-bold text-lg text-text-main">
            FolioSnap
          </Link>
          
          <nav className="hidden md:flex gap-6">
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="text-text-muted hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Link to="/generate" className="text-text-muted hover:text-primary transition-colors">
                  Generate
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-text-muted hidden sm:block">
                {currentUser?.name}
              </span>
              <button 
                onClick={handleLogout} 
                className="text-sm text-text-muted hover:text-text-main transition-colors"
              >
                Logout
              </button>
              <Link to="/generate">
                <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-hover transition-colors">
                  Create Portfolio
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-text-muted hover:text-text-main transition-colors">
                Sign In
              </Link>
              <Link to="/register">
                <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-hover transition-colors">
                  Get Started
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
