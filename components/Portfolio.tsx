import React, { useState } from 'react';
import { Stock } from '../types';
import { RefreshCcw, TrendingUp, TrendingDown, Globe, MapPin, Plus } from 'lucide-react';

interface PortfolioProps {
  portfolio: Stock[];
  onAddStock: (stock: Stock) => void;
  onUpdateStock: (symbol: string, newStock: Partial<Stock>) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ portfolio, onAddStock, onUpdateStock }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStock, setNewStock] = useState<Partial<Stock>>({
    region: 'TW',
    currency: 'TWD',
    quantity: 0,
    avgCost: 0,
    currentPrice: 0
  });

  const calculatePL = (stock: Stock) => {
    return (stock.currentPrice - stock.avgCost) * stock.quantity;
  };

  const calculatePLPercent = (stock: Stock) => {
    if (stock.avgCost === 0) return 0;
    return ((stock.currentPrice - stock.avgCost) / stock.avgCost) * 100;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(newStock.symbol && newStock.quantity) {
      onAddStock({
        symbol: newStock.symbol.toUpperCase(),
        name: newStock.name || newStock.symbol.toUpperCase(),
        region: newStock.region as 'TW' | 'US',
        quantity: Number(newStock.quantity),
        avgCost: Number(newStock.avgCost),
        currentPrice: Number(newStock.currentPrice) || Number(newStock.avgCost),
        currency: newStock.region === 'TW' ? 'TWD' : 'USD'
      });
      setIsModalOpen(false);
      setNewStock({ region: 'TW', currency: 'TWD', quantity: 0, avgCost: 0 });
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">投資組合</h1>
          <p className="text-slate-500">台灣證交所與國際股市即時追蹤</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>新增持股</span>
        </button>
      </header>

      <div className="flex items-center space-x-2 text-sm text-slate-500 bg-amber-50 border border-amber-200 p-3 rounded-lg">
        <RefreshCcw size={16} className="animate-spin" />
        <span>市場價格模擬即時更新中... (Demo Mode)</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {portfolio.map(stock => {
          const pl = calculatePL(stock);
          const plPercent = calculatePLPercent(stock);
          const isPositive = pl >= 0;

          return (
            <div key={stock.symbol} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-xl ${stock.region === 'TW' ? 'bg-sky-100 text-sky-600' : 'bg-rose-100 text-rose-600'}`}>
                    {stock.region === 'TW' ? <MapPin size={20}/> : <Globe size={20}/>}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{stock.name}</h3>
                    <p className="text-sm text-slate-500 font-mono">{stock.symbol}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1 ${isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  <span>{Math.abs(plPercent).toFixed(2)}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                 <div>
                   <p className="text-xs text-slate-400">持有股數</p>
                   <p className="font-semibold text-slate-700">{stock.quantity.toLocaleString()}</p>
                 </div>
                 <div>
                   <p className="text-xs text-slate-400">平均成本</p>
                   <p className="font-semibold text-slate-700">{stock.currency} {stock.avgCost.toFixed(2)}</p>
                 </div>
                 <div>
                   <p className="text-xs text-slate-400">現價</p>
                   <p className={`font-bold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>{stock.currency} {stock.currentPrice.toFixed(2)}</p>
                 </div>
                 <div>
                   <p className="text-xs text-slate-400">未實現損益</p>
                   <p className={`font-bold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                     {stock.currency} {pl.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                   </p>
                 </div>
              </div>

              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${isPositive ? 'bg-emerald-500' : 'bg-red-500'}`} 
                  style={{ width: `${Math.min(Math.abs(plPercent) * 2, 100)}%` }} // Visual approximation
                ></div>
              </div>
            </div>
          );
        })}
      </div>

       {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
            <h2 className="text-xl font-bold mb-4 text-slate-800">新增持股</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex bg-slate-100 rounded-lg p-1 mb-4">
                 {['TW', 'US'].map(r => (
                   <button
                    key={r}
                    type="button"
                    onClick={() => setNewStock({...newStock, region: r as 'TW'|'US', currency: r === 'TW' ? 'TWD' : 'USD'})}
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                      newStock.region === r 
                        ? 'bg-white text-indigo-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                   >
                     {r === 'TW' ? '台灣股市 (TWSE)' : '美股 (NASDAQ/NYSE)'}
                   </button>
                 ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">代號 (Symbol)</label>
                <input 
                  type="text" 
                  required
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none uppercase font-mono"
                  value={newStock.symbol || ''}
                  onChange={e => setNewStock({...newStock, symbol: e.target.value.toUpperCase()})}
                  placeholder={newStock.region === 'TW' ? "例如: 2330" : "例如: AAPL"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">名稱 (可選)</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newStock.name || ''}
                  onChange={e => setNewStock({...newStock, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">股數</label>
                   <input 
                      type="number"
                      required
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={newStock.quantity}
                      onChange={e => setNewStock({...newStock, quantity: Number(e.target.value)})}
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">平均成本</label>
                   <input 
                      type="number"
                      required
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={newStock.avgCost}
                      onChange={e => setNewStock({...newStock, avgCost: Number(e.target.value)})}
                   />
                </div>
              </div>

               <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">當前市價 (初始)</label>
                   <input 
                      type="number"
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={newStock.currentPrice}
                      onChange={e => setNewStock({...newStock, currentPrice: Number(e.target.value)})}
                   />
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
                  加入投資組合
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
