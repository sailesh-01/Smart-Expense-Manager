import { useState, useEffect } from 'react';
import api from '../utils/api';
import ExpenseTable from '../components/ExpenseTable';
import toast from 'react-hot-toast';
import { Search } from 'lucide-react';

import { useSettings } from '../context/SettingsContext';

const ExpenseList = () => {
  const { categories } = useSettings();
  const allCategories = ['All', ...(categories?.expense || []), ...(categories?.income || [])];
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterMonth, setFilterMonth] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, [filterCategory, filterMonth]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      let url = '/expenses?';
      if (filterCategory !== 'All') url += `category=${filterCategory}&`;
      if (filterMonth) url += `month=${filterMonth}&`;
      
      const res = await api.get(url);
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses(expenses.filter(e => e.id !== id));
      toast.success('Transaction deleted');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete transaction');
    }
  };

  const filteredExpenses = expenses.filter(e => 
    searchQuery === '' || 
    (e.notes && e.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">All Transactions</h1>
      </div>

      <div className="card rounded-xl shadow-sm p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={18} />
            </div>
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 block w-full rounded-md border-[var(--border-color)] bg-[var(--bg-primary)] py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors border"
            />
          </div>

          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="block w-full rounded-md border-[var(--border-color)] bg-[var(--bg-primary)] py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors border"
            >
              {allCategories.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
              ))}
            </select>
          </div>

          <div>
            <input
              type="month"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="block w-full rounded-md border-[var(--border-color)] bg-[var(--bg-primary)] py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors border"
            />
          </div>
        </div>
      </div>

      <div className="card rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : (
          <ExpenseTable expenses={filteredExpenses} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
