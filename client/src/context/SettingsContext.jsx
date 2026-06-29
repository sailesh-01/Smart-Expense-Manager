import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('currency') || '$';
  });

  const { isAuthenticated } = useAuth();
  const [categories, setCategories] = useState({ expense: [], income: [] });

  const fetchCategories = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  // Handle currency
  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  // Handle dark mode DOM updates
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <SettingsContext.Provider value={{ currency, setCurrency, darkMode, setDarkMode, categories, fetchCategories }}>
      {children}
    </SettingsContext.Provider>
  );
};
