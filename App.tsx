
import React, { useState, useEffect } from 'react';
import { AppState, User, Account, Transaction, Stock } from './types';
import { MOCK_STATE, fluctuatePrices } from './utils/store';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Accounts from './components/Accounts';
import Transactions from './components/Transactions';
import Portfolio from './components/Portfolio';
import Reports from './components/Reports';
import Auth from './components/Auth';
import { Menu, Loader2 } from 'lucide-react';
import { auth, isFirebaseInitialized } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const App: React.FC = () => {
  // --- State Management ---
  const [appState, setAppState] = useState<AppState>(() => {
    // Try to load from localStorage for data, but auth comes from Firebase
    const saved = localStorage.getItem('wealthflow_state');
    const parsed = saved ? JSON.parse(saved) : MOCK_STATE;
    return { ...parsed, user: null }; // Reset user initially, wait for Firebase
  });

  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Persistence Effect
  useEffect(() => {
    // We don't save 'user' to local storage anymore as Firebase handles it
    const stateToSave = { ...appState, user: null }; 
    localStorage.setItem('wealthflow_state', JSON.stringify(stateToSave));
  }, [appState]);

  // Firebase Auth Listener
  useEffect(() => {
    if (!isFirebaseInitialized) {
      setIsAuthChecking(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setAppState(prev => ({
          ...prev,
          user: {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            email: firebaseUser.email || '',
            avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(firebaseUser.uid)}`
          }
        }));
      } else {
        setAppState(prev => ({ ...prev, user: null }));
      }
      setIsAuthChecking(false);
    });

    return () => unsubscribe();
  }, []);

  // Real-time Stock Simulator Effect
  useEffect(() => {
    if (!appState.user) return;
    
    const interval = setInterval(() => {
      setAppState(prev => ({
        ...prev,
        portfolio: fluctuatePrices(prev.portfolio)
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [appState.user]);


  // --- Actions ---
  const handleLogin = (user: User) => {
    // This is now mainly handled by the onAuthStateChanged effect
    setAppState(prev => ({ ...prev, user }));
  };

  const handleLogout = async () => {
    if (isFirebaseInitialized) {
      await signOut(auth);
    }
    setAppState(prev => ({ ...prev, user: null }));
    setCurrentView('dashboard');
  };

  const addAccount = (account: Account) => {
    setAppState(prev => ({
      ...prev,
      accounts: [...prev.accounts, account]
    }));
  };

  const deleteAccount = (id: string) => {
    setAppState(prev => ({
      ...prev,
      accounts: prev.accounts.filter(a => a.id !== id)
    }));
  };

  const addTransaction = (t: Transaction) => {
    setAppState(prev => {
      // Update account balance
      const accounts = prev.accounts.map(a => {
        if (a.id === t.accountId) {
          const change = t.type === '收入' ? t.amount : -t.amount;
          return { ...a, balance: a.balance + change };
        }
        return a;
      });
      
      return {
        ...prev,
        transactions: [t, ...prev.transactions],
        accounts
      };
    });
  };

  const addStock = (stock: Stock) => {
    setAppState(prev => ({
      ...prev,
      portfolio: [...prev.portfolio, stock]
    }));
  };

  const updateStock = (symbol: string, update: Partial<Stock>) => {
    setAppState(prev => ({
      ...prev,
      portfolio: prev.portfolio.map(s => s.symbol === symbol ? { ...s, ...update } : s)
    }));
  };

  // --- Render ---

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  if (!appState.user) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard state={appState} />;
      case 'accounts': return <Accounts accounts={appState.accounts} onAddAccount={addAccount} onDeleteAccount={deleteAccount} />;
      case 'transactions': return <Transactions transactions={appState.transactions} accounts={appState.accounts} categories={appState.categories} onAddTransaction={addTransaction} />;
      case 'portfolio': return <Portfolio portfolio={appState.portfolio} onAddStock={addStock} onUpdateStock={updateStock} />;
      case 'reports': return <Reports state={appState} />;
      default: return <Dashboard state={appState} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar for Desktop */}
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        onLogout={handleLogout} 
        user={appState.user}
      />

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-slate-900 text-white z-40 px-4 py-3 flex justify-between items-center shadow-md">
        <span className="font-bold text-lg">WealthFlow</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="fixed top-14 left-0 w-full bg-slate-800 z-30 p-4 space-y-2 md:hidden">
          {['dashboard', 'accounts', 'transactions', 'portfolio', 'reports'].map(v => (
             <button 
               key={v}
               onClick={() => { setCurrentView(v); setIsMobileMenuOpen(false); }}
               className="block w-full text-left text-white py-2 px-4 rounded hover:bg-slate-700 capitalize"
             >
               {v}
             </button>
          ))}
          <button onClick={handleLogout} className="block w-full text-left text-red-400 py-2 px-4">登出</button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
           {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
