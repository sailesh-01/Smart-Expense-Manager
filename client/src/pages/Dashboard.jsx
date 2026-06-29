import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { format, parseISO } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PlusCircle, ArrowRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const COLORS = {
  Food: '#f97316',
  Transport: '#3b82f6',
  Books: '#8b5cf6',
  Rent: '#ef4444',
  Entertainment: '#ec4899',
  Health: '#10b981',
  Clothing: '#f43f5e',
  Others: '#64748b'
};

const Dashboard = () => {
  const { currency } = useSettings();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, budgetTotal: 0 });
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const month = format(new Date(), 'yyyy-MM');
      
      const [expensesRes, budgetRes, reportRes] = await Promise.all([
        api.get(`/expenses?month=${month}`),
        api.get('/budget'),
        api.get(`/reports/monthly?month=${month}`)
      ]);

      const expenses = expensesRes.data;
      const budgets = budgetRes.data;
      const report = reportRes.data;

      // Stats
      const budgetTotal = Object.values(budgets).reduce((a, b) => a + b, 0);
      setStats({
        total: report.total,
        budgetTotal
      });

      // Pie Chart Data
      const pieD = Object.entries(report.categoryTotals).map(([name, value]) => ({
        name, value
      })).filter(d => d.value > 0);
      setPieData(pieD);

      // Line Chart Data (Daily Trend)
      const dailyTotals = {};
      const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        dailyTotals[i] = 0;
      }
      expenses.forEach(e => {
        const day = new Date(e.date).getDate();
        dailyTotals[day] += e.amount;
      });
      
      const lineD = Object.entries(dailyTotals).map(([day, amount]) => ({
        day: `${day}`,
        amount
      }));
      setLineData(lineD);

      // Recent Expenses
      setRecentExpenses(expenses.slice(0, 5));
      
    } catch (err) {
      console.error('Error fetching dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-12">Loading dashboard...</div>;
  }

  const remaining = stats.budgetTotal - stats.total;
  const isOverBudget = remaining < 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-[var(--text-secondary)]">{format(new Date(), 'MMMM yyyy')} Overview</p>
        </div>
        <Link to="/add" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <PlusCircle size={20} />
          <span className="hidden sm:inline">Add Expense</span>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-2">Total Spent</h3>
          <p className="text-3xl font-bold">{currency}{stats.total.toFixed(2)}</p>
        </div>
        <div className="card rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-2">Total Budget</h3>
          <p className="text-3xl font-bold">{currency}{stats.budgetTotal.toFixed(2)}</p>
        </div>
        <div className="card rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-2">Remaining</h3>
          <p className={`text-3xl font-bold ${isOverBudget ? 'text-red-500' : 'text-green-500'}`}>
            {currency}{isOverBudget ? '0.00' : remaining.toFixed(2)}
          </p>
          {isOverBudget && <p className="text-xs text-red-500 mt-1">Over budget by {currency}{Math.abs(remaining).toFixed(2)}</p>}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card rounded-xl shadow-sm p-6">
          <h3 className="font-bold mb-4">Spending by Category</h3>
          <div className="h-64">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name] || COLORS.Others} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${currency}${value.toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[var(--text-secondary)]">No data for this month</div>
            )}
          </div>
        </div>

        <div className="card rounded-xl shadow-sm p-6">
          <h3 className="font-bold mb-4">Daily Spending Trend</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" opacity={0.2} />
                <XAxis dataKey="day" stroke="var(--text-secondary)" fontSize={12} tickMargin={10} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickFormatter={(value) => `${currency}${value}`} />
                <Tooltip 
                  formatter={(value) => [`${currency}${value}`, 'Spent']}
                  labelFormatter={(label) => `Day ${label}`}
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
          <h3 className="font-bold">Recent Transactions</h3>
          <Link to="/expenses" className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1 font-medium">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="divide-y divide-[var(--border-color)]">
          {recentExpenses.length > 0 ? (
            recentExpenses.map(expense => (
              <div key={expense.id} className="p-4 sm:px-6 flex justify-between items-center hover:bg-[var(--bg-primary)] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${COLORS[expense.category] || COLORS.Others}20`, color: COLORS[expense.category] || COLORS.Others }}>
                    {expense.category.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{expense.category}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{expense.notes || 'No notes'} • {format(new Date(expense.date), 'MMM dd')}</p>
                  </div>
                </div>
                <div className="font-bold text-sm">
                  {currency}{expense.amount.toFixed(2)}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-[var(--text-secondary)]">No recent transactions.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
