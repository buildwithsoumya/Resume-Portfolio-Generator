import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const AuthContext = createContext(null);

const TOKEN_KEY = 'foliosnap_token';
const USER_KEY  = 'foliosnap_user';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)) || null; }
    catch { return null; }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(true); // resolves session on mount

  // Restore & validate session on mount
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { setIsLoading(false); return; }

    axios.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(({ data }) => {
        setCurrentUser(data);
        setIsAuthenticated(true);
        localStorage.setItem(USER_KEY, JSON.stringify(data));
      })
      .catch(() => {
        // Token expired or invalid — clear storage
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setCurrentUser(null);
        setIsAuthenticated(false);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await axios.post(`${API_BASE}/auth/login`, { email, password });
    localStorage.setItem(TOKEN_KEY, data.access_token);

    const me = await axios.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });
    localStorage.setItem(USER_KEY, JSON.stringify(me.data));
    setCurrentUser(me.data);
    setIsAuthenticated(true);
    return me.data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    await axios.post(`${API_BASE}/auth/register`, { name, email, password });
    // Auto-login after registration
    return login(email, password);
  }, [login]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setCurrentUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

/** Returns the stored JWT token for use in Axios headers. */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
