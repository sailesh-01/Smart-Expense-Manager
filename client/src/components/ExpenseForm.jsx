import { useState } from 'react';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const ExpenseForm = ({ initialData, onSubmit, isLoading }) => {
  const { currency, categories } = useSettings();
  const expenseCats = categories?.expense?.length > 0 ? categories.expense : ['Food', 'Others'];
  const incomeCats = categories?.income?.length > 0 ? categories.income : ['Salary', 'Other'];
  const [formData, setFormData] = useState({
    type: initialData?.type || 'expense',
    amount: initialData?.amount || '',
    category: initialData?.category || 'Food',
    date: initialData?.date ? initialData.date.split('T')[0] : new Date().toISOString().split('T')[0],
    notes: initialData?.notes || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'type') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        category: value === 'income' ? incomeCats[0] : expenseCats[0]
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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
      <div className="flex justify-center mb-6">
        <div className="bg-[var(--bg-secondary)] p-1 rounded-lg inline-flex">
          <button
            type="button"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${formData.type === 'expense' ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            onClick={() => handleChange({ target: { name: 'type', value: 'expense' } })}
          >
            Expense
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${formData.type === 'income' ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            onClick={() => handleChange({ target: { name: 'type', value: 'income' } })}
          >
            Income
          </button>
        </div>
      </div>

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
            {(formData.type === 'income' ? incomeCats : expenseCats).map(c => (
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
          {isLoading ? 'Saving...' : `Save ${formData.type === 'income' ? 'Income' : 'Expense'}`}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
