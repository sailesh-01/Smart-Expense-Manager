import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('username');
    return saved ? { username: saved } : null;
  });
  
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  const login = async (username, password) => {
    const res = await api.post('/login', { username, password });
    const { token, username: userStr } = res.data;
    setToken(token);
    setUser({ username: userStr });
    localStorage.setItem('token', token);
    localStorage.setItem('username', userStr);
  };

  const register = async (username, password) => {
    const res = await api.post('/register', { username, password });
    const { token, username: userStr } = res.data;
    setToken(token);
    setUser({ username: userStr });
    localStorage.setItem('token', token);
    localStorage.setItem('username', userStr);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    // Clear session storage alerts to prevent bleed across accounts
    sessionStorage.removeItem('dismissedAlerts');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};
