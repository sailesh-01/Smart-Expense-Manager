import { useSettings } from '../context/SettingsContext';

const BudgetCard = ({ category, budget, spent, onUpdate }) => {
  const { currency } = useSettings();
  const percentage = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
  
  let progressColor = 'bg-green-500';
  if (percentage >= 100) progressColor = 'bg-red-500';
  else if (percentage >= 80) progressColor = 'bg-orange-500';
  else if (percentage >= 60) progressColor = 'bg-yellow-400';

  return (
    <div className="card rounded-xl shadow-sm p-5 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">{category}</h3>
        <div className="text-sm font-medium">
          <span className={percentage >= 100 ? 'text-red-500' : ''}>{currency}{spent.toFixed(2)}</span>
          <span className="text-[var(--text-secondary)]"> / {currency}{budget}</span>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div 
          className={`h-2.5 rounded-full transition-all duration-500 ${progressColor}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-[var(--text-secondary)]">{percentage.toFixed(1)}% Used</span>
        <button 
          onClick={() => onUpdate(category, budget)}
          className="text-xs text-blue-500 hover:text-blue-700 font-medium"
        >
          Edit Limit
        </button>
      </div>
    </div>
  );
};

export default BudgetCard;
