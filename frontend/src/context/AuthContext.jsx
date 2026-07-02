import { createContext, useEffect, useState } from 'react';
import api, { ACCESS_TOKEN_KEY } from '../services/api';

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

  // keeps state in sync if the api layer clears the token on a 401 elsewhere
  useEffect(() => {
    const syncFromStorage = () => setIsAuthenticated(!!localStorage.getItem(ACCESS_TOKEN_KEY));
    window.addEventListener('storage', syncFromStorage);
    return () => window.removeEventListener('storage', syncFromStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
