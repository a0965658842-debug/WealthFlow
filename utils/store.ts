import { Account, AccountType, AppState, Category, Stock, Transaction, TransactionType, User } from "../types";

export const INITIAL_USER: User = {
  id: 'u1',
  name: '王小明',
  email: 'ming@example.com',
  avatar: 'https://picsum.photos/200/200'
};

export const INITIAL_ACCOUNTS: Account[] = [
  { id: 'a1', name: '中國信託薪轉戶', type: AccountType.BANK, balance: 150000, currency: 'TWD', bankName: 'CTBC', accountNumber: '****1234' },
  { id: 'a2', name: '錢包現金', type: AccountType.CASH, balance: 3500, currency: 'TWD' },
  { id: 'a3', name: '玉山證券戶', type: AccountType.INVESTMENT, balance: 50000, currency: 'TWD' },
  { id: 'a4', name: 'Richart', type: AccountType.BANK, balance: 80000, currency: 'TWD' },
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'c1', name: '飲食', icon: 'Utensils', color: '#ef4444', type: 'EXPENSE' },
  { id: 'c2', name: '交通', icon: 'Bus', color: '#f59e0b', type: 'EXPENSE' },
  { id: 'c3', name: '居住', icon: 'Home', color: '#3b82f6', type: 'EXPENSE' },
  { id: 'c4', name: '娛樂', icon: 'Gamepad2', color: '#8b5cf6', type: 'EXPENSE' },
  { id: 'c5', name: '薪資', icon: 'Banknote', color: '#10b981', type: 'INCOME' },
  { id: 'c6', name: '投資收益', icon: 'TrendingUp', color: '#06b6d4', type: 'INCOME' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', accountId: 'a1', type: TransactionType.INCOME, amount: 65000, date: '2023-10-05', categoryId: 'c5', note: '十月薪資' },
  { id: 't2', accountId: 'a2', type: TransactionType.EXPENSE, amount: 120, date: '2023-10-06', categoryId: 'c1', note: '午餐' },
  { id: 't3', accountId: 'a2', type: TransactionType.EXPENSE, amount: 500, date: '2023-10-07', categoryId: 'c2', note: '悠遊卡儲值' },
  { id: 't4', accountId: 'a4', type: TransactionType.EXPENSE, amount: 25000, date: '2023-10-10', categoryId: 'c3', note: '房租' },
  { id: 't5', accountId: 'a2', type: TransactionType.EXPENSE, amount: 1200, date: '2023-10-12', categoryId: 'c4', note: '看電影與聚餐' },
];

export const INITIAL_PORTFOLIO: Stock[] = [
  { symbol: '2330', name: '台積電', region: 'TW', quantity: 1000, avgCost: 550, currentPrice: 1000, currency: 'TWD' },
  { symbol: '0050', name: '元大台灣50', region: 'TW', quantity: 2000, avgCost: 120, currentPrice: 150, currency: 'TWD' },
  { symbol: 'AAPL', name: 'Apple Inc.', region: 'US', quantity: 50, avgCost: 150, currentPrice: 180, currency: 'USD' },
  { symbol: 'NVDA', name: 'NVIDIA', region: 'US', quantity: 20, avgCost: 400, currentPrice: 900, currency: 'USD' },
];

export const MOCK_STATE: AppState = {
  user: INITIAL_USER,
  accounts: INITIAL_ACCOUNTS,
  transactions: INITIAL_TRANSACTIONS,
  categories: INITIAL_CATEGORIES,
  portfolio: INITIAL_PORTFOLIO
};

// Simulate random market movement
export const fluctuatePrices = (stocks: Stock[]): Stock[] => {
  return stocks.map(stock => {
    const changePercent = (Math.random() - 0.5) * 0.02; // -1% to +1%
    const newPrice = stock.currentPrice * (1 + changePercent);
    return {
      ...stock,
      currentPrice: parseFloat(newPrice.toFixed(2))
    };
  });
};
