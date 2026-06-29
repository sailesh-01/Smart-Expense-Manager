import { useState, useEffect } from 'react';
import api from '../utils/api';
import { format, subMonths } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import toast from 'react-hot-toast';
import { Download } from 'lucide-react';
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

const Reports = () => {
  const { currency } = useSettings();
  const [loading, setLoading] = useState(true);
  const [reportMonth, setReportMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [reportData, setReportData] = useState(null);
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    fetchReport();
    fetchBarData();
  }, [reportMonth]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/reports/monthly?month=${reportMonth}`);
      setReportData(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const fetchBarData = async () => {
    try {
      const monthsToFetch = 6;
      const data = [];
      const now = new Date();
      
      // We will fetch 6 months of summary to build the bar chart
      for (let i = monthsToFetch - 1; i >= 0; i--) {
        const m = subMonths(now, i);
        const mStr = format(m, 'yyyy-MM');
        const mLabel = format(m, 'MMM');
        
        try {
          const res = await api.get(`/reports/monthly?month=${mStr}`);
          data.push({
            name: mLabel,
            total: res.data.total
          });
        } catch (e) {
          data.push({ name: mLabel, total: 0 });
        }
      }
      setBarData(data);
    } catch (err) {
      console.error('Failed to fetch bar chart data', err);
    }
  };

  const downloadCSV = () => {
    if (!reportData) return;
    
    // Simple CSV generation
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Category,Total Spent\n";
    
    Object.entries(reportData.categoryTotals).forEach(([cat, val]) => {
      csvContent += `${cat},${val}\n`;
    });
    
    csvContent += `\nTotal,${reportData.total}\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ExpensiQ_Report_${reportMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Monthly Reports</h1>
          <p className="text-[var(--text-secondary)] mt-1">Analyze your spending habits over time.</p>
        </div>
        <div className="flex gap-3">
          <input
            type="month"
            value={reportMonth}
            onChange={(e) => setReportMonth(e.target.value)}
            className="rounded-md border-[var(--border-color)] bg-[var(--bg-primary)] py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border transition-colors"
          />
          <button
            onClick={downloadCSV}
            disabled={!reportData || reportData.total === 0}
            className="inline-flex items-center gap-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:bg-[var(--bg-primary)] px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {loading || !reportData ? (
        <div className="text-center p-12">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card rounded-xl shadow-sm p-5 border-l-4 border-l-blue-500">
              <h3 className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-1">Total Expenses</h3>
              <p className="text-2xl font-bold">{currency}{reportData.total.toFixed(2)}</p>
            </div>
            <div className="card rounded-xl shadow-sm p-5 border-l-4 border-l-purple-500">
              <h3 className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-1">Daily Average</h3>
              <p className="text-2xl font-bold">{currency}{reportData.avgDaily.toFixed(2)}</p>
            </div>
            <div className="card rounded-xl shadow-sm p-5 border-l-4 border-l-pink-500">
              <h3 className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-1">Highest Category</h3>
              <p className="text-2xl font-bold">{reportData.topCategory || 'N/A'}</p>
            </div>
            <div className="card rounded-xl shadow-sm p-5 border-l-4 border-l-orange-500">
              <h3 className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-1">Transactions</h3>
              <p className="text-2xl font-bold">{Object.keys(reportData.categoryTotals).length} Categories</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 card rounded-xl shadow-sm p-6">
              <h3 className="font-bold mb-4">Category Breakdown</h3>
              <div className="space-y-4">
                {Object.entries(reportData.categoryTotals)
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, amt]) => {
                    const percentage = reportData.total > 0 ? (amt / reportData.total) * 100 : 0;
                    return (
                      <div key={cat}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[cat] || COLORS.Others }}></span>
                            {cat}
                          </span>
                          <span className="font-bold">{currency}{amt.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="h-1.5 rounded-full transition-all duration-500" 
                            style={{ width: `${percentage}%`, backgroundColor: COLORS[cat] || COLORS.Others }}
                          ></div>
                        </div>
                        <div className="text-right text-xs text-[var(--text-secondary)] mt-0.5">{percentage.toFixed(1)}%</div>
                      </div>
                    );
                })}
                {Object.keys(reportData.categoryTotals).length === 0 && (
                  <p className="text-sm text-[var(--text-secondary)] text-center py-4">No expenses recorded for this month.</p>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 card rounded-xl shadow-sm p-6 flex flex-col">
              <h3 className="font-bold mb-4">Last 6 Months Comparison</h3>
              <div className="flex-1 min-h-[250px]">
                {barData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tickMargin={10} stroke="var(--text-secondary)" fontSize={12} />
                      <YAxis axisLine={false} tickLine={false} stroke="var(--text-secondary)" fontSize={12} tickFormatter={(val) => `${currency}${val}`} />
                      <Tooltip 
                        cursor={{ fill: 'var(--bg-primary)' }}
                        formatter={(value) => [`${currency}${value.toFixed(2)}`, 'Total Spent']}
                        contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px' }}
                      />
                      <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                        {barData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.total > 0 ? '#3b82f6' : '#94a3b8'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-[var(--text-secondary)]">Loading chart data...</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
