import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex-grow flex flex-col items-center justify-center py-20 px-6">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-text-main leading-tight mb-6">
          Turn your resume into a portfolio website instantly.
        </h1>
        <p className="text-lg text-text-muted mb-10 max-w-2xl mx-auto">
          Upload your PDF, select a design, and let FolioSnap generate a clean, professional portfolio website ready to share with employers.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={isAuthenticated ? "/generate" : "/register"}>
            <button className="bg-primary text-white px-8 py-3 rounded-lg font-medium text-lg hover:bg-primary-hover transition-colors w-full sm:w-auto">
              Get Started for Free
            </button>
          </Link>
          {!isAuthenticated && (
            <Link to="/login">
              <button className="bg-surface text-text-main border border-border px-8 py-3 rounded-lg font-medium text-lg hover:bg-background transition-colors w-full sm:w-auto">
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <div className="bg-surface border border-border p-8 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-3">Upload PDF</h3>
          <p className="text-text-muted leading-relaxed">
            Simply drag and drop your existing resume. Our system extracts your work experience, education, and skills.
          </p>
        </div>
        <div className="bg-surface border border-border p-8 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-3">Select Design</h3>
          <p className="text-text-muted leading-relaxed">
            Choose from multiple professional layouts optimized for readability and clean presentation.
          </p>
        </div>
        <div className="bg-surface border border-border p-8 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-3">Generate & Edit</h3>
          <p className="text-text-muted leading-relaxed">
            Get a live portfolio in seconds. Tweak the content directly in the browser and download the source code.
          </p>
        </div>
      </div>
    </div>
  );
}
