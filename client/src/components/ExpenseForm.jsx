import { useState } from 'react';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const CATEGORIES = ['Food', 'Transport', 'Books', 'Rent', 'Entertainment', 'Health', 'Clothing', 'Others'];

const ExpenseForm = ({ initialData, onSubmit, isLoading }) => {
  const { currency } = useSettings();
  const [formData, setFormData] = useState({
    amount: initialData?.amount || '',
    category: initialData?.category || 'Food',
    date: initialData?.date ? initialData.date.split('T')[0] : new Date().toISOString().split('T')[0],
    notes: initialData?.notes || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      toast.error('Please enter a valid positive amount');
      return;
    }
    
    // Format date properly
    const submitData = {
      ...formData,
      amount: Number(formData.amount),
      date: new Date(formData.date).toISOString()
    };
    
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Amount ({currency})</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">{currency}</span>
            </div>
            <input
              type="number"
              name="amount"
              step="0.01"
              min="0.01"
              required
              value={formData.amount}
              onChange={handleChange}
              className="pl-7 block w-full rounded-md border-[var(--border-color)] bg-[var(--bg-primary)] py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors border"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="block w-full rounded-md border-[var(--border-color)] bg-[var(--bg-primary)] py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors border"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Date</label>
          <input
            type="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="block w-full rounded-md border-[var(--border-color)] bg-[var(--bg-primary)] py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors border"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Notes (Optional)</label>
          <input
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            maxLength={50}
            className="block w-full rounded-md border-[var(--border-color)] bg-[var(--bg-primary)] py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors border"
            placeholder="e.g. Lunch at cafe"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center items-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
        >
          <Save size={16} className="mr-2" />
          {isLoading ? 'Saving...' : 'Save Expense'}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
