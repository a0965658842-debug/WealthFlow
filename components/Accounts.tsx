import React, { useState } from 'react';
import { Account, AccountType } from '../types';
import { Plus, CreditCard, Banknote, Landmark, Wallet, Trash2, Edit2 } from 'lucide-react';

interface AccountsProps {
  accounts: Account[];
  onAddAccount: (account: Account) => void;
  onDeleteAccount: (id: string) => void;
}

const Accounts: React.FC<AccountsProps> = ({ accounts, onAddAccount, onDeleteAccount }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAccount, setNewAccount] = useState<Partial<Account>>({
    name: '',
    type: AccountType.BANK,
    balance: 0,
    currency: 'TWD'
  });

  const getIcon = (type: AccountType) => {
    switch (type) {
      case AccountType.BANK: return <Landmark />;
      case AccountType.CASH: return <Banknote />;
      case AccountType.CREDIT: return <CreditCard />;
      case AccountType.INVESTMENT: return <Wallet />;
      default: return <Wallet />;
    }
  };

  const getBgColor = (type: AccountType) => {
    switch (type) {
      case AccountType.BANK: return 'bg-blue-500';
      case AccountType.CASH: return 'bg-emerald-500';
      case AccountType.CREDIT: return 'bg-pink-500';
      case AccountType.INVESTMENT: return 'bg-purple-500';
      default: return 'bg-slate-500';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAccount.name && newAccount.balance !== undefined) {
      onAddAccount({
        id: Date.now().toString(),
        name: newAccount.name,
        type: newAccount.type as AccountType,
        balance: Number(newAccount.balance),
        currency: newAccount.currency || 'TWD',
        accountNumber: newAccount.accountNumber || '',
        bankName: newAccount.bankName || ''
      });
      setIsModalOpen(false);
      setNewAccount({ name: '', type: AccountType.BANK, balance: 0, currency: 'TWD' });
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">帳戶管理</h1>
          <p className="text-slate-500">管理您的銀行、現金與投資帳戶</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>新增帳戶</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(acc => (
          <div key={acc.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group relative">
            <div className={`h-2 w-full ${getBgColor(acc.type)}`}></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${getBgColor(acc.type)} bg-opacity-10 text-${getBgColor(acc.type).replace('bg-', '')}`}>
                  {getIcon(acc.type)}
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                   <button className="text-slate-400 hover:text-indigo-600"><Edit2 size={16}/></button>
                   <button onClick={() => onDeleteAccount(acc.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">{acc.name}</h3>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">{acc.type} • {acc.currency}</p>
              
              <div className="flex items-baseline space-x-1">
                <span className="text-sm text-slate-500">$</span>
                <span className="text-2xl font-bold text-slate-900">{acc.balance.toLocaleString()}</span>
              </div>
              
              {acc.bankName && (
                <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between text-xs text-slate-500">
                  <span>{acc.bankName}</span>
                  <span className="font-mono">{acc.accountNumber}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
            <h2 className="text-xl font-bold mb-4 text-slate-800">新增帳戶</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">帳戶名稱</label>
                <input 
                  type="text" 
                  required
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newAccount.name}
                  onChange={e => setNewAccount({...newAccount, name: e.target.value})}
                  placeholder="例如: 薪轉戶"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">帳戶類型</label>
                <select 
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newAccount.type}
                  onChange={e => setNewAccount({...newAccount, type: e.target.value as AccountType})}
                >
                  {Object.values(AccountType).map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">初始餘額</label>
                  <input 
                    type="number" 
                    required
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newAccount.balance}
                    onChange={e => setNewAccount({...newAccount, balance: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">幣別</label>
                  <select 
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newAccount.currency}
                    onChange={e => setNewAccount({...newAccount, currency: e.target.value})}
                  >
                    <option value="TWD">TWD</option>
                    <option value="USD">USD</option>
                    <option value="JPY">JPY</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
                >
                  確認新增
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
