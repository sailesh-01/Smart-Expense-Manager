import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, List, Settings as SettingsIcon, PieChart, Wallet, SlidersHorizontal, LogOut, Repeat } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Home size={20} /> },
    { name: 'Expenses', path: '/expenses', icon: <List size={20} /> },
    { name: 'Budget', path: '/budget', icon: <SettingsIcon size={20} /> },
    { name: 'Reports', path: '/reports', icon: <PieChart size={20} /> },
    { name: 'Subs', path: '/subscriptions', icon: <Repeat size={20} /> },
    { name: 'Settings', path: '/settings', icon: <SlidersHorizontal size={20} /> },
  ];

  return (
    <nav className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Wallet className="text-blue-500" size={28} />
              <span className="font-extrabold text-xl tracking-wide text-[var(--text-primary)] hidden sm:block">
                ExpensiQ
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === item.path
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]'
                  }`}
              >
                {item.icon}
                <span className="hidden md:block">{item.name}</span>
              </Link>
            ))}
            <div className="h-6 w-px bg-[var(--border-color)] mx-1 hidden sm:block"></div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
              <span className="hidden md:block">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
