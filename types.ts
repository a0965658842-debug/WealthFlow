export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export enum AccountType {
  BANK = '銀行',
  CASH = '現金',
  INVESTMENT = '證券',
  CREDIT = '信用卡'
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  bankName?: string;
  accountNumber?: string;
}

export enum TransactionType {
  INCOME = '收入',
  EXPENSE = '支出',
  TRANSFER = '轉帳'
}

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  date: string;
  categoryId: string;
  note: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'INCOME' | 'EXPENSE';
}

export interface Stock {
  symbol: string;
  name: string;
  region: 'TW' | 'US';
  quantity: number;
  avgCost: number;
  currentPrice: number; // Real-time updated
  currency: string;
}

export interface AppState {
  user: User | null;
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
  portfolio: Stock[];
}
