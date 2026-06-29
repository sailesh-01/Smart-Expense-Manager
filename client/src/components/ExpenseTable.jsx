import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const CATEGORY_STYLES = {
  Food: { backgroundColor: 'var(--cat-food)', color: '#ffffff' },
  Transport: { backgroundColor: 'var(--cat-transport)', color: '#ffffff' },
  Books: { backgroundColor: 'var(--cat-books)', color: '#ffffff' },
  Rent: { backgroundColor: 'var(--cat-rent)', color: '#ffffff' },
  Entertainment: { backgroundColor: 'var(--cat-entertainment)', color: '#ffffff' },
  Health: { backgroundColor: 'var(--cat-health)', color: '#ffffff' },
  Clothing: { backgroundColor: 'var(--cat-clothing)', color: '#ffffff' },
  Others: { backgroundColor: 'var(--cat-others)', color: '#ffffff' }
};

const ExpenseTable = ({ expenses, onDelete }) => {
  const { currency } = useSettings();

  if (!expenses || expenses.length === 0) {
    return (
      <div className="p-8 text-center text-[var(--text-secondary)]">
        No transactions found. Add some to get started!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-[var(--border-color)]">
        <thead className="bg-[var(--bg-primary)]">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Date</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Category</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Notes</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Amount</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-[var(--bg-secondary)] divide-y divide-[var(--border-color)]">
          {expenses.map((expense) => (
            <tr key={expense.id} className="hover:bg-[var(--bg-primary)] transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {format(new Date(expense.date), 'MMM dd, yyyy')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span 
                  className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm" 
                  style={CATEGORY_STYLES[expense.category] || CATEGORY_STYLES.Others}
                >
                  {expense.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">
                {expense.notes || '-'}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${expense.type === 'income' ? 'text-green-500' : ''}`}>
                {expense.type === 'income' ? '+' : '-'}{currency}{expense.amount.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onDelete(expense.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  aria-label="Delete transaction"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTable;
