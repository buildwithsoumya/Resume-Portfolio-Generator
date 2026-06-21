import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark') || 
      localStorage.getItem('theme') === 'dark';
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

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
          <button 
            onClick={toggleTheme} 
            className="p-2 text-text-muted hover:text-text-main transition-colors rounded-full"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>
          
          {isAuthenticated ? (
            <>
              <span className="text-sm text-text-muted hidden sm:block">
                {currentUser?.name}
              </span>
              <button 
                onClick={handleLogout} 
                className="text-sm text-text-muted hover:text-red-500 transition-colors"
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
