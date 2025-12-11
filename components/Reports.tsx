import React from 'react';
import { AppState } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface ReportsProps {
  state: AppState;
}

const Reports: React.FC<ReportsProps> = ({ state }) => {
  // Prepare data for Expense by Category Pie Chart
  const expenseData = state.categories
    .filter(c => c.type === 'EXPENSE')
    .map(cat => {
      const total = state.transactions
        .filter(t => t.categoryId === cat.id && t.type === '支出')
        .reduce((sum, t) => sum + t.amount, 0);
      return { name: cat.name, value: total, color: cat.color };
    })
    .filter(d => d.value > 0);

  // Prepare data for Income vs Expense Bar Chart
  const monthlyData = [
    { name: '本月', Income: 0, Expense: 0 }
  ];

  state.transactions.forEach(t => {
      // For demo, we just dump everything into "Current Month"
      if (t.type === '收入') monthlyData[0].Income += t.amount;
      if (t.type === '支出') monthlyData[0].Expense += t.amount;
  });

  return (
    <div className="space-y-6">
       <header>
          <h1 className="text-2xl font-bold text-slate-800">財務報表</h1>
          <p className="text-slate-500">視覺化分析您的資金流向</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expense Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">支出類別分佈</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                   formatter={(value: number) => `NT$ ${value.toLocaleString()}`}
                   contentStyle={{backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {expenseData.map((entry, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: entry.color}}></div>
                <span className="text-slate-600">{entry.name}</span>
                <span className="font-semibold text-slate-800 ml-auto">{Math.round((entry.value / monthlyData[0].Expense) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Income vs Expense */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">收支對比</h3>
           <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} barGap={20}>
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip 
                     cursor={{fill: 'transparent'}}
                     contentStyle={{backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Legend iconType="circle" />
                  <Bar dataKey="Income" name="收入" fill="#10b981" radius={[10, 10, 0, 0]} barSize={40} />
                  <Bar dataKey="Expense" name="支出" fill="#ef4444" radius={[10, 10, 0, 0]} barSize={40} />
                </BarChart>
             </ResponsiveContainer>
           </div>
           <div className="mt-4 p-4 bg-slate-50 rounded-xl flex justify-between items-center">
             <div>
               <p className="text-xs text-slate-500">本月結餘</p>
               <p className={`text-xl font-bold ${(monthlyData[0].Income - monthlyData[0].Expense) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                 NT$ {(monthlyData[0].Income - monthlyData[0].Expense).toLocaleString()}
               </p>
             </div>
             <div className="text-right">
                <p className="text-xs text-slate-500">儲蓄率</p>
                <p className="text-lg font-semibold text-indigo-600">
                  {monthlyData[0].Income > 0 
                    ? Math.round(((monthlyData[0].Income - monthlyData[0].Expense) / monthlyData[0].Income) * 100) 
                    : 0}%
                </p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
