import React from 'react';
import { LayoutDashboard, Wallet, Receipt, LineChart, PieChart, LogOut } from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
  onLogout: () => void;
  user: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onLogout, user }) => {
  const menuItems = [
    { id: 'dashboard', label: '總覽', icon: LayoutDashboard },
    { id: 'accounts', label: '帳戶管理', icon: Wallet },
    { id: 'transactions', label: '收支紀錄', icon: Receipt },
    { id: 'portfolio', label: '投資組合', icon: LineChart },
    { id: 'reports', label: '財務報表', icon: PieChart },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-slate-900 text-white min-h-screen fixed left-0 top-0 z-20 shadow-xl">
      <div className="p-6 flex items-center space-x-3 border-b border-slate-800/50">
        <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <span className="font-bold text-xl text-white">W</span>
        </div>
        <span className="text-xl font-bold tracking-wide text-slate-100">WealthFlow</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-indigo-100' : 'text-slate-500 group-hover:text-indigo-300'} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/50 bg-slate-900/50">
        {user && (
          <div className="flex items-center space-x-3 mb-4 p-2 bg-slate-800/50 rounded-lg">
             <img 
               src={user.avatar} 
               alt={user.name}
               className="w-10 h-10 rounded-full bg-slate-700 border-2 border-slate-600"
             />
             <div className="overflow-hidden">
               <p className="text-sm font-bold text-slate-200 truncate">{user.name}</p>
               <p className="text-xs text-slate-400 truncate">{user.email}</p>
             </div>
          </div>
        )}
        <button 
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">登出帳戶</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;