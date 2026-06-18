import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage    from './pages/LandingPage';
import LoginPage      from './pages/LoginPage';
import RegisterPage   from './pages/RegisterPage';
import DashboardPage  from './pages/DashboardPage';
import GeneratePage   from './pages/GeneratePage';

import './index.css';

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-main font-sans">
      <Navbar />
      <main className="flex-grow flex flex-col w-full">
        {children}
      </main>
      <footer className="w-full py-6 px-6 border-t border-border bg-surface text-center mt-auto">
        <p className="text-sm text-text-muted">
          © {new Date().getFullYear()} FolioSnap. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Layout><LandingPage /></Layout>} />
            <Route path="/login"    element={<Layout><LoginPage /></Layout>} />
            <Route path="/register" element={<Layout><RegisterPage /></Layout>} />

            {/* Protected */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout><DashboardPage /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/generate" element={
              <ProtectedRoute>
                <Layout><GeneratePage /></Layout>
              </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
