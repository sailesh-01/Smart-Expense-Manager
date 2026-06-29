import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { Save, Moon, Sun, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const CURRENCIES = [
  { symbol: '$', label: 'USD - US Dollar' },
  { symbol: '€', label: 'EUR - Euro' },
  { symbol: '£', label: 'GBP - British Pound' },
  { symbol: '₹', label: 'INR - Indian Rupee' },
  { symbol: '¥', label: 'JPY - Japanese Yen' },
];

const Settings = () => {
  const { currency, setCurrency, darkMode, setDarkMode } = useSettings();
  const { logout } = useAuth();

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Settings saved successfully!');
  };

  const handleResetData = async () => {
    if (window.confirm('Are you sure you want to delete all your expenses and reset budgets? This cannot be undone.')) {
      try {
        await api.delete('/api/user/data');
        toast.success('All data has been wiped.');
      } catch (err) {
        toast.error('Failed to reset data.');
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('WARNING: Are you entirely sure you want to permanently delete your account and all data? This cannot be undone.')) {
      try {
        await api.delete('/api/user/account');
        toast.success('Account successfully deleted.');
        logout();
      } catch (err) {
        toast.error('Failed to delete account.');
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">App Settings</h1>
        <p className="text-[var(--text-secondary)] mt-1">Manage your application preferences.</p>
      </div>

      <div className="card rounded-xl shadow-sm p-6">
        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Theme Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b border-[var(--border-color)] pb-2">Appearance</h2>
            <div className="flex items-center justify-between max-w-sm">
              <div>
                <label className="block text-sm font-medium">Dark Mode</label>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Switch between light and dark themes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-full transition-colors flex items-center justify-center ${
                  darkMode 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            </div>
          </div>

          {/* Currency Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b border-[var(--border-color)] pb-2">Regional</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Currency Symbol</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="block w-full max-w-xs rounded-md border-[var(--border-color)] bg-[var(--bg-primary)] py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors border text-[var(--text-primary)]"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.symbol} value={c.symbol}>
                    {c.label} ({c.symbol})
                  </option>
                ))}
              </select>
              <p className="text-xs text-[var(--text-secondary)] mt-2">
                This will update the currency symbol displayed across the entire application.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[var(--border-color)]">
            <button
              type="submit"
              className="inline-flex justify-center items-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              <Save size={16} className="mr-2" />
              Save Preferences
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="card rounded-xl shadow-sm p-6 border-red-500 border-opacity-30 border">
        <h2 className="text-lg font-bold text-red-500 mb-4 flex items-center">
          <AlertTriangle className="mr-2" size={20} />
          Danger Zone
        </h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-md font-semibold">Delete All Expenses & Budgets</h3>
              <p className="text-sm text-[var(--text-secondary)] max-w-sm">
                This will wipe out all your financial records and reset your budgets to default. You will keep your account.
              </p>
            </div>
            <button 
              onClick={handleResetData}
              className="bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 px-4 py-2 rounded-md font-medium transition-colors"
            >
              Reset Data
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-6">
            <div>
              <h3 className="text-md font-semibold">Delete Account</h3>
              <p className="text-sm text-[var(--text-secondary)] max-w-sm">
                Permanently delete your account, your username, and all associated financial records. You will be logged out.
              </p>
            </div>
            <button 
              onClick={handleDeleteAccount}
              className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md font-medium transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
