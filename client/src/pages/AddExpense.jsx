import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ExpenseForm from '../components/ExpenseForm';
import toast from 'react-hot-toast';
import { useState } from 'react';

const AddExpense = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await api.post('/expenses', data);
      toast.success('Expense added successfully!');
      navigate('/expenses');
    } catch (err) {
      console.error(err);
      toast.error('Failed to add expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card rounded-xl shadow-sm overflow-hidden p-6 sm:p-8">
        <h1 className="text-2xl font-bold mb-6">Add New Expense</h1>
        <ExpenseForm onSubmit={handleSubmit} isLoading={isSubmitting} />
      </div>
    </div>
  );
};

export default AddExpense;
