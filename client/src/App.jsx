import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import AlertBanner from './components/AlertBanner';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import ExpenseList from './pages/ExpenseList';
import BudgetSettings from './pages/BudgetSettings';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Subscriptions from './pages/Subscriptions';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200 flex flex-col">
      {isAuthenticated && <Navbar />}
      <div className={isAuthenticated ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow" : "w-full flex-grow flex flex-col"}>
        {isAuthenticated && <AlertBanner />}
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/add" element={<ProtectedRoute><AddExpense /></ProtectedRoute>} />
          <Route path="/expenses" element={<ProtectedRoute><ExpenseList /></ProtectedRoute>} />
          <Route path="/budget" element={<ProtectedRoute><BudgetSettings /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/subscriptions" element={<ProtectedRoute><Subscriptions /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <footer className="w-full py-6 text-center text-sm text-[var(--text-secondary)] border-t border-[var(--border-color)] bg-[var(--bg-secondary)] mt-auto">
        Copyright &copy; 2026 SmartExpense Manager - All Rights Reserved.
      </footer>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
