import React, { useState } from 'react';
import { AppState } from '../types';
import { TrendingUp, TrendingDown, DollarSign, BrainCircuit, Activity } from 'lucide-react';
import { generateFinancialAdvice } from '../services/geminiService';

interface DashboardProps {
  state: AppState;
}

const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const [advice, setAdvice] = useState<string>("");
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const totalBalance = state.accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalStockValue = state.portfolio.reduce((sum, stock) => {
    // Simple conversion for demo: 1 USD = 31 TWD
    const priceInTwd = stock.currency === 'USD' ? stock.currentPrice * 31 : stock.currentPrice;
    return sum + (priceInTwd * stock.quantity);
  }, 0);
  
  const netWorth = totalBalance + totalStockValue;
  
  // Calculate monthly stats (mock logic for current month)
  const income = state.transactions
    .filter(t => t.type === '收入')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expense = state.transactions
    .filter(t => t.type === '支出')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleGetAdvice = async () => {
    setLoadingAdvice(true);
    const result = await generateFinancialAdvice(state);
    setAdvice(result);
    setLoadingAdvice(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">早安，{state.user?.name} 👋</h1>
          <p className="text-slate-500">這裡是您的財務總覽</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500 font-medium">總淨資產 (TWD估算)</p>
          <p className="text-3xl font-extrabold text-slate-900">NT$ {netWorth.toLocaleString()}</p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">本月總收入</p>
            <p className="text-xl font-bold text-slate-800">NT$ {income.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-full">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">本月總支出</p>
            <p className="text-xl font-bold text-slate-800">NT$ {expense.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">投資總市值</p>
            <p className="text-xl font-bold text-slate-800">NT$ {Math.round(totalStockValue).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* AI Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg text-white p-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
            <BrainCircuit size={32} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2">Gemini 智能財務顧問</h3>
            <p className="text-indigo-100 mb-4 text-sm leading-relaxed">
              透過先進的 AI 模型分析您的消費習慣與資產配置，提供個人化的理財建議。
            </p>
            
            {!advice ? (
               <button 
                onClick={handleGetAdvice}
                disabled={loadingAdvice}
                className="bg-white text-indigo-600 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors disabled:opacity-50"
              >
                {loadingAdvice ? '分析中...' : '開始分析我的財務狀況'}
              </button>
            ) : (
              <div className="bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-sm animate-fade-in">
                <p className="whitespace-pre-line text-sm leading-6">{advice}</p>
                <button 
                  onClick={() => setAdvice("")} 
                  className="mt-3 text-xs text-indigo-200 hover:text-white underline"
                >
                  重新分析
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions Preview */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">近期交易紀錄</h3>
          <span className="text-xs text-slate-400">最近 5 筆</span>
        </div>
        <div className="divide-y divide-slate-100">
          {state.transactions.slice(0, 5).map(t => {
            const category = state.categories.find(c => c.id === t.categoryId);
            const isIncome = t.type === '收入';
            return (
              <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isIncome ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    <DollarSign size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{category?.name || '未分類'}</p>
                    <p className="text-xs text-slate-500">{t.date} • {t.note}</p>
                  </div>
                </div>
                <span className={`font-bold ${isIncome ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {isIncome ? '+' : '-'}{t.amount.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
