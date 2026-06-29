import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, Calendar, DollarSign, Clock } from 'lucide-react';
import api from '../utils/api';
import { useSettings } from '../context/SettingsContext';
import { format, parseISO } from 'date-fns';

const Subscriptions = () => {
  const { currency, categories } = useSettings();
  const expenseCategories = categories?.expense?.length > 0 ? categories.expense : ['Food', 'Others'];
  
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: expenseCategories[0],
    frequency: 'monthly',
    startDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const res = await api.get('/subscriptions');
      setSubscriptions(res.data);
    } catch (err) {
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.amount || Number(formData.amount) <= 0) {
      toast.error('Please provide valid name and amount');
      return;
    }
    
    try {
      await api.post('/subscriptions', {
        ...formData,
        amount: Number(formData.amount),
        startDate: new Date(formData.startDate).toISOString()
      });
      toast.success('Subscription added');
      setFormData(prev => ({ ...prev, name: '', amount: '' }));
      fetchSubscriptions();
    } catch (err) {
      toast.error('Failed to add subscription');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subscription?')) return;
    try {
      await api.delete(`/subscriptions/${id}`);
      toast.success('Subscription deleted');
      fetchSubscriptions();
    } catch (err) {
      toast.error('Failed to delete subscription');
    }
  };

  const totalMonthlyCost = subscriptions.reduce((sum, sub) => {
    if (sub.frequency === 'weekly') return sum + (sub.amount * 4.33);
    if (sub.frequency === 'yearly') return sum + (sub.amount / 12);
    return sum + sub.amount;
  }, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Recurring Subscriptions</h1>
        <p className="text-[var(--text-secondary)] mt-1">Track your fixed recurring costs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="card rounded-xl shadow-sm p-6 text-center">
            <h2 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-2">Estimated Monthly Cost</h2>
            <p className="text-4xl font-bold text-red-500">{currency}{totalMonthlyCost.toFixed(2)}</p>
          </div>

          <div className="card rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">Add Subscription</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Netflix"
                  className="block w-full rounded-md border-[var(--border-color)] bg-[var(--bg-primary)] py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Amount ({currency})</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0.01"
                  className="block w-full rounded-md border-[var(--border-color)] bg-[var(--bg-primary)] py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="block w-full rounded-md border-[var(--border-color)] bg-[var(--bg-primary)] py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border transition-colors"
                >
                  {expenseCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Frequency</label>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    className="block w-full rounded-md border-[var(--border-color)] bg-[var(--bg-primary)] py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border transition-colors"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-[var(--border-color)] bg-[var(--bg-primary)] py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border transition-colors"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full inline-flex justify-center items-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} className="mr-2" /> Add Subscription
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-[var(--border-color)]">
              <h2 className="text-lg font-bold">Active Subscriptions</h2>
            </div>
            
            {loading ? (
              <div className="p-8 text-center text-[var(--text-secondary)]">Loading...</div>
            ) : subscriptions.length === 0 ? (
              <div className="p-8 text-center text-[var(--text-secondary)]">No active subscriptions found.</div>
            ) : (
              <ul className="divide-y divide-[var(--border-color)]">
                {subscriptions.map(sub => (
                  <li key={sub.id} className="p-4 sm:p-6 hover:bg-[var(--bg-secondary)] transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                          <DollarSign size={20} />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium">{sub.name}</p>
                          <div className="flex flex-wrap items-center text-xs text-[var(--text-secondary)] mt-1 gap-3">
                            <span className="flex items-center"><Calendar size={12} className="mr-1" /> {format(parseISO(sub.startDate), 'MMM d, yyyy')}</span>
                            <span className="flex items-center capitalize"><Clock size={12} className="mr-1" /> {sub.frequency}</span>
                            <span className="bg-[var(--bg-primary)] px-2 py-0.5 rounded-full border border-[var(--border-color)]">{sub.category}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center ml-4">
                        <span className="text-sm font-bold mr-4">{currency}{sub.amount.toFixed(2)}</span>
                        <button
                          onClick={() => handleDelete(sub.id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          aria-label="Delete subscription"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
