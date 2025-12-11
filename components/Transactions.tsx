import React, { useState } from 'react';
import { Account, Category, Transaction, TransactionType } from '../types';
import { Filter, ArrowUpCircle, ArrowDownCircle, Search } from 'lucide-react';

interface TransactionsProps {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  onAddTransaction: (t: Transaction) => void;
}

const Transactions: React.FC<TransactionsProps> = ({ transactions, accounts, categories, onAddTransaction }) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newTrans, setNewTrans] = useState<Partial<Transaction>>({
    type: TransactionType.EXPENSE,
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    note: '',
    accountId: accounts[0]?.id || '',
    categoryId: categories[0]?.id || ''
  });

  const filteredTransactions = transactions.filter(t => {
    const matchesType = filterType === 'ALL' || t.type === filterType;
    const matchesSearch = t.note.includes(searchTerm) || 
                          categories.find(c => c.id === t.categoryId)?.name.includes(searchTerm);
    return matchesType && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTrans.amount && newTrans.accountId && newTrans.categoryId) {
      onAddTransaction({
        id: Date.now().toString(),
        amount: Number(newTrans.amount),
        type: newTrans.type as TransactionType,
        date: newTrans.date || '',
        note: newTrans.note || '',
        accountId: newTrans.accountId,
        categoryId: newTrans.categoryId
      });
      setShowAdd(false);
      // Reset mostly but keep date
      setNewTrans({ ...newTrans, amount: 0, note: '' });
    }
  };

  return (
    <div className="space-y-6">
       <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">收支紀錄</h1>
          <p className="text-slate-500">詳細的財務流水帳</p>
        </div>
        <div className="flex space-x-2">
          <button 
             onClick={() => setShowAdd(true)}
             className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
          >
            記一筆
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex space-x-2 overflow-x-auto">
          {['ALL', TransactionType.EXPENSE, TransactionType.INCOME].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filterType === type 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {type === 'ALL' ? '全部紀錄' : type}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="搜尋備註或分類..." 
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">日期</th>
                <th className="p-4 font-semibold">類別</th>
                <th className="p-4 font-semibold">備註</th>
                <th className="p-4 font-semibold">帳戶</th>
                <th className="p-4 font-semibold text-right">金額</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredTransactions.map(t => {
                const cat = categories.find(c => c.id === t.categoryId);
                const acc = accounts.find(a => a.id === t.accountId);
                const isIncome = t.type === TransactionType.INCOME;
                return (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-slate-600 font-mono">{t.date}</td>
                    <td className="p-4">
                      <span className="flex items-center space-x-2">
                         <div className={`w-2 h-2 rounded-full`} style={{backgroundColor: cat?.color || '#ccc'}}></div>
                         <span className="font-medium text-slate-700">{cat?.name}</span>
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{t.note}</td>
                    <td className="p-4 text-slate-500">{acc?.name}</td>
                    <td className={`p-4 text-right font-bold ${isIncome ? 'text-emerald-600' : 'text-red-500'}`}>
                      {isIncome ? '+' : '-'}{t.amount.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">沒有找到相關紀錄</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

       {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
            <h2 className="text-xl font-bold mb-4 text-slate-800">新增交易紀錄</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex bg-slate-100 rounded-lg p-1">
                 {[TransactionType.EXPENSE, TransactionType.INCOME].map(type => (
                   <button
                    key={type}
                    type="button"
                    onClick={() => setNewTrans({...newTrans, type: type})}
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                      newTrans.type === type 
                        ? 'bg-white text-indigo-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                   >
                     {type}
                   </button>
                 ))}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">金額</label>
                <input 
                  type="number" 
                  required
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-xl font-bold"
                  value={newTrans.amount || ''}
                  onChange={e => setNewTrans({...newTrans, amount: Number(e.target.value)})}
                  placeholder="0"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">日期</label>
                   <input 
                      type="date"
                      required
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={newTrans.date}
                      onChange={e => setNewTrans({...newTrans, date: e.target.value})}
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">帳戶</label>
                   <select
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={newTrans.accountId}
                      onChange={e => setNewTrans({...newTrans, accountId: e.target.value})}
                   >
                     {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                   </select>
                </div>
              </div>

              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">分類</label>
                   <select
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={newTrans.categoryId}
                      onChange={e => setNewTrans({...newTrans, categoryId: e.target.value})}
                   >
                     {categories
                       .filter(c => c.type === (newTrans.type === TransactionType.INCOME ? 'INCOME' : 'EXPENSE'))
                       .map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                   </select>
              </div>

              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">備註</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newTrans.note}
                    onChange={e => setNewTrans({...newTrans, note: e.target.value})}
                    placeholder="午餐、加油..."
                  />
              </div>

              <div className="flex space-x-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAdd(false)}
                  className="flex-1 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                <button 
                  type="submit" 
                  className={`flex-1 py-2 text-white rounded-lg shadow-lg transition-colors ${
                    newTrans.type === TransactionType.INCOME 
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30' 
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30'
                  }`}
                >
                  儲存紀錄
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
