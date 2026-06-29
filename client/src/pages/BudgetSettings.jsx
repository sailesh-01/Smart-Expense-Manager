import { useState, useEffect } from 'react';
import api from '../utils/api';
import BudgetCard from '../components/BudgetCard';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Save } from 'lucide-react';

const CATEGORIES = ['Food', 'Transport', 'Books', 'Rent', 'Entertainment', 'Health', 'Clothing', 'Others'];

const BudgetSettings = () => {
  const [budgets, setBudgets] = useState({});
  const [spent, setSpent] = useState({});
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editCategory, setEditCategory] = useState('');
  const [editAmount, setEditAmount] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const budgetRes = await api.get('/budget');
      setBudgets(budgetRes.data);

      const month = format(new Date(), 'yyyy-MM');
      const reportRes = await api.get(`/reports/monthly?month=${month}`);
      setSpent(reportRes.data.categoryTotals || {});
    } catch (err) {
      console.error(err);
      toast.error('Failed to load budget data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (category, currentBudget) => {
    setEditCategory(category);
    setEditAmount(currentBudget);
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/budget', {
        category: editCategory,
        amount: Number(editAmount)
      });
      setBudgets(prev => ({ ...prev, [editCategory]: Number(editAmount) }));
      toast.success(`${editCategory} budget updated`);
      setIsEditing(false);
    } catch (err) {
      toast.error('Failed to update budget');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Monthly Budgets</h1>
        <p className="text-[var(--text-secondary)] mt-1">Set limits for each category to track your spending.</p>
      </div>

      {loading ? (
        <div className="text-center p-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map(cat => (
            <BudgetCard
              key={cat}
              category={cat}
              budget={budgets[cat] || 0}
              spent={spent[cat] || 0}
              onUpdate={handleEditClick}
            />
          ))}
        </div>
      )}

      {/* Simple Modal overlay for editing */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--bg-secondary)] rounded-xl shadow-lg max-w-sm w-full p-6">
            <h3 className="text-lg font-bold mb-4">Update {editCategory} Budget</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Budget Limit ($)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="block w-full rounded-md border-[var(--border-color)] bg-[var(--bg-primary)] py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors border"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-medium rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  <Save size={16} className="mr-2" />
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetSettings;
