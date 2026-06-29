import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import api from '../utils/api';
import { format } from 'date-fns';
import { useSettings } from '../context/SettingsContext';

const AlertBanner = () => {
  const { currency, darkMode } = useSettings();
  const [alerts, setAlerts] = useState([]);
  const [dismissed, setDismissed] = useState(() => {
    try {
      const saved = sessionStorage.getItem('dismissedAlerts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const location = useLocation();

  useEffect(() => {
    fetchAlerts();
  }, [location.pathname]); // Refresh alerts on navigation

  const fetchAlerts = async () => {
    try {
      const month = format(new Date(), 'yyyy-MM');
      const res = await api.get(`/alerts?month=${month}`);
      setAlerts(res.data);
    } catch (err) {
      console.error('Failed to fetch alerts', err);
    }
  };

  const handleDismiss = (category) => {
    const newDismissed = [...dismissed, category];
    setDismissed(newDismissed);
    sessionStorage.setItem('dismissedAlerts', JSON.stringify(newDismissed));
  };

  const visibleAlerts = alerts.filter(a => !dismissed.includes(a.category));

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="mb-6 space-y-3">
      {visibleAlerts.map((alert, idx) => {
        const isDanger = alert.level === 'danger';
        const isWarning = alert.level === 'warning';
        
        let message = alert.message;
        if (isDanger) {
          message = `You have exceeded your ${alert.category} budget by ${currency}${(alert.spent - alert.budget).toFixed(2)}.`;
        } else if (isWarning) {
          message = `You have used ${alert.percentage.toFixed(1)}% of your ${alert.category} budget (${currency}${alert.spent.toFixed(2)} / ${currency}${alert.budget}).`;
        }

        if (isDanger) {
          return (
            <div 
              key={idx} 
              className="flex items-start p-4 border rounded-lg shadow-sm relative transition-all duration-300"
              style={{
                backgroundColor: darkMode ? 'rgba(127, 29, 29, 0.3)' : '#fef2f2',
                borderColor: darkMode ? '#991b1b' : '#fecaca',
                color: darkMode ? '#fca5a5' : '#991b1b'
              }}
            >
              <AlertTriangle className="shrink-0 mt-0.5 mr-3 h-5 w-5" />
              <div className="flex-1">
                <h3 className="text-sm font-bold">{alert.category} Budget Alert</h3>
                <div className="mt-1 text-sm font-medium opacity-90">{message}</div>
              </div>
              <button onClick={() => handleDismiss(alert.category)} className="absolute top-4 right-4 opacity-70 hover:opacity-100 transition-opacity">
                <X size={18} />
              </button>
            </div>
          );
        }

        if (isWarning) {
          return (
            <div 
              key={idx} 
              className="flex items-start p-4 border rounded-lg shadow-sm relative transition-all duration-300"
              style={{
                backgroundColor: darkMode ? 'rgba(124, 45, 18, 0.3)' : '#fff7ed',
                borderColor: darkMode ? '#9a3412' : '#fed7aa',
                color: darkMode ? '#fdba74' : '#9a3412'
              }}
            >
              <AlertCircle className="shrink-0 mt-0.5 mr-3 h-5 w-5" />
              <div className="flex-1">
                <h3 className="text-sm font-bold">{alert.category} Budget Alert</h3>
                <div className="mt-1 text-sm font-medium opacity-90">{message}</div>
              </div>
              <button onClick={() => handleDismiss(alert.category)} className="absolute top-4 right-4 opacity-70 hover:opacity-100 transition-opacity">
                <X size={18} />
              </button>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

export default AlertBanner;
