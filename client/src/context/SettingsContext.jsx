import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('currency') || '$';
  });

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
    <SettingsContext.Provider value={{ currency, setCurrency, darkMode, setDarkMode }}>
      {children}
    </SettingsContext.Provider>
  );
};
