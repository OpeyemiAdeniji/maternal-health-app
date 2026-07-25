import { createContext, useEffect, useState } from 'react';
import api, { ACCESS_TOKEN_KEY } from '../services/api';
import { requestNotificationPermission } from '../utils/notifications';

const REFRESH_TOKEN_KEY = 'modacare_refresh_token';
const USER_KEY = 'modacare_user';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem(ACCESS_TOKEN_KEY)
  );

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login/', { email, password });
    localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setUser(data.user);
    setIsAuthenticated(true);

    // fire and forget — prompts for permission and saves the token if granted
    requestNotificationPermission();

    return data.user;
  };

  const register = async ({ fullName, email, password, confirmPassword }) => {
    await api.post('/api/auth/register/', {
      full_name: fullName,
      email,
      password,
      confirm_password: confirmPassword,
    });
    return login(email, password);
  };

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setIsAuthenticated(false);
  };

  // merges fresh fields (e.g. from a /api/auth/profile/ fetch) into the cached user
  // object — login only ever returns a minimal user, so screens that need up-to-date
  // fields (motherhood_stage, etc.) should pull them and sync them back here
  const updateUser = (patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
  };

  // keeps state in sync if the api layer clears the token on a 401 elsewhere
  useEffect(() => {
    const syncFromStorage = () => setIsAuthenticated(!!localStorage.getItem(ACCESS_TOKEN_KEY));
    window.addEventListener('storage', syncFromStorage);
    return () => window.removeEventListener('storage', syncFromStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
